mod auth;
mod database;
mod model;
mod thumbnail;
mod utils;

use std::{env, sync::Arc, time::Duration};

use async_graphql::extensions::Logger;
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::{EmptySubscription, Schema};
use auth::google_oauth2;
use database::Database;
use model::query::QueryRoot;
use model::{mutation::MutationRoot, user::User};

use tide::{
    http::{cookies::SameSite, mime},
    Body, Redirect, Request, Response, StatusCode,
};

#[derive(Clone)]
pub struct Context {
    db: Arc<Database>,
    auth: google_oauth2::Client,
}

#[async_std::main]
async fn main() -> anyhow::Result<()> {
    let db_uri = env::var("DATABASE_URL")?;
    let db = Arc::new(Database::new(&db_uri).await?);

    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(Arc::clone(&db))
        .extension(Logger)
        .finish();
    println!("Server Up!");

    tide::log::start();
    let mut app = tide::with_state(Context {
        db: Arc::clone(&db),
        auth: google_oauth2::Client::new(
            env::var("GOOGLE_CLIENT_ID")?,
            env::var("GOOGLE_CLIENT_SECRET")?,
            env::var("DOMAIN")?,
        ),
    });

    let session_store = async_sqlx_session::PostgresSessionStore::new(&db_uri).await?;
    session_store.migrate().await?;
    session_store.spawn_cleanup_task(Duration::from_secs(60 * 60));

    app.with(
        tide::sessions::SessionMiddleware::new(
            session_store,
            env::var("TIDE_SECRET").unwrap().as_bytes(),
        )
        .with_cookie_name("sid")
        .with_same_site_policy(SameSite::Lax),
    );

    app.at("/api/graphql").post(move |req: Request<Context>| {
        let schema = schema.clone();
        async move {
            let user = req.session().get::<User>("user");

            let mut req = async_graphql_tide::receive_request(req).await?;
            req = req.data(user);
            async_graphql_tide::respond(schema.execute(req).await)
        }
    });

    app.at("/").get(|_| async move {
        let mut res = Response::new(StatusCode::Ok);
        res.set_body(Body::from_string(playground_source(
            GraphQLPlaygroundConfig::new("/api/graphql"),
        )));
        res.set_content_type(mime::HTML);

        Ok(res)
    });

    app.at("/api/thumb/:post_id")
        .get(thumbnail::Thumbnail::route);

    app.at("/api/oauth2callback/google").get(auth::route);
    app.at("/api/logout")
        .get(|mut req: Request<Context>| async move {
            let session = req.session_mut();
            session.remove("user");
            Ok(Redirect::new("/"))
        });

    app.listen("0.0.0.0:7878").await?;

    Ok(())
}
