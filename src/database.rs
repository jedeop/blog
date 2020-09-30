use sqlx::MySqlPool;

use crate::model::{Post, PostInput};
use crate::utils;

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
    pub async fn get_post_by_id(&self, id: u32) -> anyhow::Result<Post> {
        let post: Post = sqlx::query_as!(Post, "SELECT * FROM post WHERE id = ?", id)
            .fetch_one(&self.pool)
            .await?;

        Ok(post)
    }
    pub async fn create_post(&self, post: PostInput) -> anyhow::Result<u32> {
        let contents = utils::get_contents(&post.body).join("\n");
        let read_time = utils::get_read_time(&post.body);

        let post_id = sqlx::query!(
            "INSERT INTO post (title, intro, contents, body, read_time, collection_id)
            VALUES (?, ?, ?, ?, ?, ?)",
            post.title,
            post.intro,
            contents,
            post.body,
            read_time,
            post.collection_id
        )
        .execute(&self.pool)
        .await?
        .last_insert_id() as u32;

        Ok(post_id)
    }
}
