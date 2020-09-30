use async_graphql::{Context, FieldResult, Object};

use super::post::Post;
use crate::Database;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn post(&self, ctx: &Context<'_>, id: u32) -> FieldResult<Post> {
        let db = ctx.data_unchecked::<Database>();

        let post = db.get_post_by_id(id).await?;

        Ok(post)
    }
}
