mod database;
mod model;
mod thumbnail;
mod utils;

use std::{env, sync::Arc};

use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::{EmptySubscription, Schema};
use database::Database;
use model::mutation::MutationRoot;
use model::query::QueryRoot;

use tide::{http::mime, Body, Response, StatusCode};

#[derive(Clone)]
pub struct Context {
    db: Arc<Database>,
}

#[async_std::main]
async fn main() -> anyhow::Result<()> {
    let db = Arc::new(Database::new(&env::var("DATABASE_URL")?).await?);

    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(Arc::clone(&db))
        .finish();
    println!("Server Up!");

    tide::log::start();
    let mut app = tide::with_state(Context {
        db: Arc::clone(&db),
    });

    app.at("/api/graphql")
        .post(async_graphql_tide::endpoint(schema));

    app.at("/").get(|_| async move {
        let mut res = Response::new(StatusCode::Ok);
        res.set_body(Body::from_string(playground_source(
            GraphQLPlaygroundConfig::new("/api/graphql"),
        )));
        res.set_content_type(mime::HTML);

        Ok(res)
    });

    app.at("/api/thumb/:post_id").get(thumbnail::Thumbnail::route);

    app.listen("0.0.0.0:7878").await?;

    Ok(())
}
