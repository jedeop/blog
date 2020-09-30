use sqlx::MySqlPool;

use crate::model::Post;

pub struct Database {
    pool: MySqlPool,
}

impl Database {
    pub async fn new(uri: &str) -> anyhow::Result<Database> {
        let pool = MySqlPool::connect(uri).await?;
        Ok(Database { pool })
    }
}

impl Database {
    pub async fn get_post_by_id(&self, id: i32) -> anyhow::Result<Post> {
        let post: Post = sqlx::query_as!(Post, "SELECT * FROM post WHERE id = ?", id)
        .fetch_one(&self.pool)
        .await?;

        Ok(post)
    }
}
