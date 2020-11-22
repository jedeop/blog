use async_graphql::{Context, FieldResult, Object};

use super::{post::Post, post_group::PostGroup};
use crate::Database;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn post(&self, ctx: &Context<'_>, id: u64) -> FieldResult<Post> {
        let db = ctx.data::<Database>()?;

        let post = db.get_post_by_id(id).await?;

        Ok(post)
    }

    async fn post_group(&self, ctx: &Context<'_>, id: u64) -> FieldResult<PostGroup> {
        let db = ctx.data::<Database>()?;

        let post_group = db.get_post_group_by_id(id).await?;

        Ok(post_group)
    }
}
