use std::sync::Arc;

use async_graphql::{Context, FieldResult, Object};

use super::{post::Post, post::PostInput, series::Series, series::SeriesInput};
use crate::Database;

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_post(&self, ctx: &Context<'_>, post: PostInput) -> FieldResult<Post> {
        let db = ctx.data::<Arc<Database>>()?;
        let post = db.create_post(post).await?;

        Ok(post)
    }

    async fn create_series(&self, ctx: &Context<'_>, series: SeriesInput) -> FieldResult<Series> {
        let db = ctx.data::<Arc<Database>>()?;
        let post_group = db.create_series(series).await?;

        Ok(post_group)
    }
}
