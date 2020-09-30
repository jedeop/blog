mod database;
mod model;

use std::env;

use database::Database;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv()?;

    let db = Database::new(&env::var("DATABASE_URL")?).await?;

    let rec = db.get_post_by_id(1).await?;

    println!("{:?}", rec);

    Ok(())
}
