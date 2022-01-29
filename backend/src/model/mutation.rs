use std::sync::Arc;

use async_graphql::{Context, FieldResult, Object};
use sqlx::types::Uuid;

use super::{
    comment::{Comment, CommentInput},
    post::Post,
    post::{PostInput, PostPartialInput},
    series::Series,
    series::SeriesInput,
    user::User,
};
use crate::Database;

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_post(&self, ctx: &Context<'_>, post: PostInput) -> FieldResult<Post> {
        let user = ctx.data::<Option<User>>()?;
        let is_owner = match user {
            Some(user) => user.is_owner(),
            None => false,
        };
        if !is_owner {
            return Err("Forbidden".into());
        }

        let db = ctx.data::<Arc<Database>>()?;
        let post = db.create_post(post).await?;

        Ok(post)
    }
    async fn update_post(
        &self,
        ctx: &Context<'_>,
        post_id: Uuid,
        post: PostPartialInput,
    ) -> FieldResult<Post> {
        let user = ctx.data::<Option<User>>()?;
        let is_owner = match user {
            Some(user) => user.is_owner(),
            None => false,
        };
        if !is_owner {
            return Err("Forbidden".into());
        }

        let db = ctx.data::<Arc<Database>>()?;
        let post = db.update_post(post_id, post).await?;

        Ok(post)
    }
    async fn delete_post(&self, ctx: &Context<'_>, post_id: Uuid) -> FieldResult<Uuid> {
        let user = ctx.data::<Option<User>>()?;
        let is_owner = match user {
            Some(user) => user.is_owner(),
            None => false,
        };
        if !is_owner {
            return Err("Forbidden".into());
        }

        let db = ctx.data::<Arc<Database>>()?;
        db.delete_post(&post_id).await?;

        Ok(post_id)
    }

    async fn create_series(&self, ctx: &Context<'_>, series: SeriesInput) -> FieldResult<Series> {
        let user = ctx.data::<Option<User>>()?;
        let is_owner = match user {
            Some(user) => user.is_owner(),
            None => false,
        };
        if !is_owner {
            return Err("Forbidden".into());
        }

        let db = ctx.data::<Arc<Database>>()?;
        let post_group = db.create_series(series).await?;

        Ok(post_group)
    }

    async fn create_comment(
        &self,
        ctx: &Context<'_>,
        comment: CommentInput,
    ) -> FieldResult<Comment> {
        let user_id = match ctx.data::<Option<User>>()? {
            Some(user) => &user.user_id,
            None => return Err("Not logged in".into()),
        };

        let db = ctx.data::<Arc<Database>>()?;
        let comment = db.create_comment(comment, user_id).await?;

        Ok(comment)
    }
}
