use async_graphql::{Context, FieldResult, Object};

use super::post::PostInput;
use crate::Database;

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_post(&self, ctx: &Context<'_>, post: PostInput) -> FieldResult<u32> {
        let db = ctx.data::<Database>()?;
        let post_id = db.create_post(post).await?;

        Ok(post_id)
    }
}
