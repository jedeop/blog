mod database;
mod model;
mod utils;
mod thumbnail;

use std::{convert::TryInto, env, sync::Arc};

use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::{EmptySubscription, Schema};
use database::Database;
use model::{mutation::MutationRoot, post::Post};
use model::query::QueryRoot;

use sqlx::types::Uuid;
use tide::{Body, Request, Response, StatusCode, http::mime};

#[derive(Clone)]
struct Context {
    db: Arc<Database>
}

#[async_std::main]
async fn main() -> anyhow::Result<()> {
    let db = Arc::new(Database::new(&env::var("DATABASE_URL")?).await?);

    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(Arc::clone(&db))
        .finish();
    println!("Server Up!");

    tide::log::start();
    let mut app = tide::with_state(Context { db: Arc::clone(&db) });

    app.at("/graphql")
        .post(async_graphql_tide::endpoint(schema));

    app.at("/").get(|_| async move {
        let mut res = Response::new(StatusCode::Ok);
        res.set_body(Body::from_string(playground_source(
            GraphQLPlaygroundConfig::new("/graphql"),
        )));
        res.set_content_type(mime::HTML);

        Ok(res)
    });
    
    app.at("/api/thumb/:post_id").get(|req: Request<Context>| async move {
        let post_id = Uuid::parse_str(req.param("post_id")?)?;
        
        let post = req.state().db.get_post_by_id(post_id).await?;
        
        let Post { title, summary, tags, created_at, contents, .. } = post;
        
        let tags = match tags {
            Some(tags) => req.state().db.get_tags(&tags).await?.into_iter().map(|tag| tag.name).collect(),
            None => Vec::new(),
        };
        let date = created_at.format("%Y.%m.%d").to_string();
        let read_time = utils::get_read_time(&contents).try_into()?;
        
        let image = thumbnail::new(&title[..], summary.as_deref(), tags, date, read_time)?;
        let path = format!("/{}.png", &post_id);
        image.save_png(&path)?;
        
        let mut res = Response::new(StatusCode::Ok);

        res.set_content_type(mime::PNG);

        res.set_body(Body::from_file(&path).await?);

        Ok(res)
    });

    app.listen("0.0.0.0:7878").await?;

    Ok(())
}
