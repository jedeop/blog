mod database;
mod model;
mod utils;

use std::env;

use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::{EmptySubscription, Schema};
use database::Database;
use model::mutation::MutationRoot;
use model::query::QueryRoot;

use tide::{http::mime, Body, Response, StatusCode};

#[async_std::main]
async fn main() -> anyhow::Result<()> {
    let db = Database::new(&env::var("DATABASE_URL")?).await?;

    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(db)
        .finish();
    println!("Server Up!");

    tide::log::start();
    let mut app = tide::new();

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

    app.listen("0.0.0.0:7878").await?;

    Ok(())
}
