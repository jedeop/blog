use async_graphql::{Context, FieldResult, Object};

use super::{post::PostInput, post_group::PostGroupInput};
use crate::Database;

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_post(&self, ctx: &Context<'_>, post: PostInput) -> FieldResult<u32> {
        let db = ctx.data::<Database>()?;
        let post_id = db.create_post(post).await?;

        Ok(post_id)
    }

    async fn create_post_group(
        &self,
        ctx: &Context<'_>,
        post_group: PostGroupInput,
    ) -> FieldResult<u32> {
        let db = ctx.data::<Database>()?;
        let post_group_id = db.create_post_group(post_group).await?;

        Ok(post_group_id)
    }
}
