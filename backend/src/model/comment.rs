use std::sync::Arc;

use async_graphql::{Context, FieldResult, InputObject, Object};
use chrono::Utc;
use sqlx::types::Uuid;

use crate::database::Database;

use super::{post::Post, user::User};

#[derive(sqlx::FromRow)]
pub struct Comment {
    pub comment_id: Uuid,
    pub user_id: String,
    pub post_id: Uuid,
    pub contents: String,
    pub created_at: chrono::DateTime<Utc>,
    pub last_update: Option<chrono::DateTime<Utc>>,
}

#[Object]
impl Comment {
    async fn comment_id(&self) -> Uuid {
        self.comment_id
    }
    async fn user(&self, ctx: &Context<'_>) -> FieldResult<User> {
        let db = ctx.data::<Arc<Database>>()?;
        let user = db.get_user_by_id(&self.user_id).await?;
        Ok(user)
    }
    async fn post(&self, ctx: &Context<'_>) -> FieldResult<Post> {
        let db = ctx.data::<Arc<Database>>()?;
        let post = db.get_post_by_id(self.post_id).await?;
        Ok(post)
    }
    async fn contents(&self) -> &str {
        &self.contents
    }
    async fn created_at(&self) -> chrono::DateTime<Utc> {
        self.created_at
    }
    async fn last_update(&self) -> Option<chrono::DateTime<Utc>> {
        self.last_update
    }
}

#[derive(InputObject)]
pub struct CommentInput {
    pub post_id: Uuid,
    pub contents: String,
}
