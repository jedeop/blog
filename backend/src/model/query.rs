use std::sync::Arc;

use async_graphql::{Context, FieldResult, Object};
use chrono::DateTime;
use sqlx::types::Uuid;

use super::{
    comment::Comment,
    post::{Post, PostConnection},
    series::Series,
    user::User,
};
use crate::Database;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn post(&self, ctx: &Context<'_>, post_id: Uuid) -> FieldResult<Post> {
        let db = ctx.data::<Arc<Database>>()?;

        let post = db.get_post_by_id(post_id).await?;

        let user = ctx.data::<Option<User>>()?;
        let is_owner = match user {
            Some(user) => user.is_owner(),
            None => false,
        };
        if !is_owner && !post.is_published {
            return Err("Forbidden".into());
        }

        Ok(post)
    }

    async fn posts(
        &self,
        ctx: &Context<'_>,
        first: Option<u32>,
        after: Option<String>,
    ) -> FieldResult<PostConnection> {
        let user = ctx.data::<Option<User>>()?;
        let is_owner = match user {
            Some(user) => user.is_owner(),
            None => false,
        };

        let db = ctx.data::<Arc<Database>>()?;

        let first = first.unwrap_or(10);
        let after = match after {
            Some(after) => {
                let decode = base64::decode(after)?;
                String::from_utf8(decode)?
            }
            None => String::from("9999-01-01T00:00:00+00:00"),
        };
        let after = DateTime::parse_from_rfc3339(&after)?;

        let post_connection = PostConnection::new(&db, first, after, is_owner).await?;

        Ok(post_connection)
    }

    async fn series(&self, ctx: &Context<'_>, series_id: Uuid) -> FieldResult<Series> {
        let db = ctx.data::<Arc<Database>>()?;

        let series = db.get_series_by_id(series_id).await?;

        Ok(series)
    }

    async fn is_logined(&self, ctx: &Context<'_>) -> FieldResult<bool> {
        let user = ctx.data::<Option<User>>()?;

        Ok(user.is_some())
    }
    async fn is_owner(&self, ctx: &Context<'_>) -> FieldResult<bool> {
        let user = ctx.data::<Option<User>>()?;

        Ok(match user {
            Some(user) => user.is_owner(),
            None => false,
        })
    }

    async fn comment(&self, ctx: &Context<'_>, comment_id: Uuid) -> FieldResult<Comment> {
        let db = ctx.data::<Arc<Database>>()?;
        let comment = db.get_comment_by_id(comment_id).await?;
        Ok(comment)
    }
    async fn comments(&self, ctx: &Context<'_>, post_id: Uuid) -> FieldResult<Vec<Comment>> {
        let db = ctx.data::<Arc<Database>>()?;
        let comments = db.get_comments_by_post(post_id).await?;
        Ok(comments)
    }
}
