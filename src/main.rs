mod database;
mod model;
mod utils;

use std::env;

use database::Database;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv()?;

    let db = Database::new(&env::var("DATABASE_URL")?).await?;

    let post_id = db
        .create_post(model::PostInput {
            title: String::from("Rust의 소유권 규칙"),
            body: String::from(
                "
# 소유권
        ",
            ),
            intro: Some(String::from(
                "메모리 안전성을 보장하기 위한 Rust만의 규칙, 소유권에 대해 배워보자",
            )),
            collection_id: None,
        })
        .await?;

    let rec = db.get_post_by_id(post_id).await?;

    println!("{:?}", rec);

    Ok(())
}
