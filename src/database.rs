use anyhow::Result;
use sqlx::MySqlPool;

use crate::model::post_group::PostGroup;
use crate::model::{
    post::{Post, PostInput},
    post_group::PostGroupInput,
};
use crate::utils;

pub struct Database {
    pool: MySqlPool,
}

impl Database {
    pub async fn new(uri: &str) -> Result<Database> {
        let pool = MySqlPool::connect(uri).await?;
        Ok(Database { pool })
    }
}

impl Database {
    pub async fn get_post_by_id(&self, id: u32) -> Result<Post> {
        let post: Post = sqlx::query_as!(Post, "SELECT * FROM post WHERE id = ?", id)
            .fetch_one(&self.pool)
            .await?;

        Ok(post)
    }
    pub async fn create_post(&self, post: PostInput) -> Result<u32> {
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

impl Database {
    pub async fn get_post_group_by_id(&self, id: u32) -> Result<PostGroup> {
        let post_group: PostGroup = sqlx::query_as_unchecked!(
            PostGroup,
            "SELECT id, title, intro, updated, group_type FROM post_group WHERE id = ?",
            id
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(post_group)
    }

    pub async fn create_post_group(&self, post_group: PostGroupInput) -> Result<u32> {
        let post_group_id = sqlx::query!(
            "INSERT INTO post_group (title, intro, group_type) VALUES (?, ?, ?)",
            post_group.title,
            post_group.intro,
            post_group.group_type
        )
        .execute(&self.pool)
        .await?
        .last_insert_id() as u32;

        Ok(post_group_id)
    }
}
