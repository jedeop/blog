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
    pub async fn get_post_by_id(&self, id: u64) -> Result<Post> {
        let post: Post = sqlx::query_as!(Post, "SELECT * FROM post WHERE id = ?", id)
            .fetch_one(&self.pool)
            .await?;

        Ok(post)
    }
    pub async fn get_posts_by_group(&self, group_id: u64) -> Result<Vec<Post>> {
        let posts = sqlx::query_as!(Post, "SELECT * FROM post WHERE group_id = ?", group_id)
            .fetch_all(&self.pool)
            .await?;
        Ok(posts)
    }
    pub async fn create_post(&self, post: PostInput) -> Result<Post> {
        let post_id = sqlx::query!(
            "INSERT INTO post (title, intro, contents, group_id) VALUES (?, ?, ?, ?)",
            post.title,
            post.intro,
            post.contents,
            post.group_id
        )
        .execute(&self.pool)
        .await?
        .last_insert_id();

        let new_post = self.get_post_by_id(post_id).await?;

        Ok(new_post)
    }
}

impl Database {
    pub async fn get_post_group_by_id(&self, id: u64) -> Result<PostGroup> {
        let post_group: PostGroup = sqlx::query_as!(
            PostGroup,
            "SELECT id, title, intro, created, updated FROM post_group WHERE id = ?",
            id
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(post_group)
    }

    pub async fn get_post_group_count(&self, id: u64) -> Result<i64> {
        let count = sqlx::query!("SELECT count(id) AS count FROM post WHERE group_id = ?", id)
            .fetch_one(&self.pool)
            .await?
            .count;

        Ok(count)
    }

    pub async fn get_read_time_avg(&self, id: u64) -> Result<usize> {
        let posts = self.get_posts_by_group(id).await?;
        
        let len = posts.len();
        
        if len == 0 {
            return Ok(0)
        }

        let total_time: usize = posts.iter().map(|post| utils::get_read_time(&post.contents)).sum();
        
        let avg = total_time / len;

        Ok(avg)
    }

    pub async fn create_post_group(&self, post_group: PostGroupInput) -> Result<PostGroup> {
        let post_group_id = sqlx::query!(
            "INSERT INTO post_group (title, intro) VALUES (?, ?)",
            post_group.title,
            post_group.intro,
        )
        .execute(&self.pool)
        .await?
        .last_insert_id();

        let new_post_group = self.get_post_group_by_id(post_group_id).await?;

        Ok(new_post_group)
    }
}
