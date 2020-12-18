use async_graphql::{Context, FieldResult, Object};
use base64;

use super::{
    post::{Post, PostConnection},
    post_group::PostGroup,
};
use crate::Database;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn post(&self, ctx: &Context<'_>, id: u64) -> FieldResult<Post> {
        let db = ctx.data::<Database>()?;

        let post = db.get_post_by_id(id).await?;

        Ok(post)
    }

    async fn posts(
        &self,
        ctx: &Context<'_>,
        first: Option<u64>,
        after: Option<String>,
    ) -> FieldResult<PostConnection> {
        let db = ctx.data::<Database>()?;

        let first = first.unwrap_or(10);
        let after = match after {
            Some(after) => {
                let decode = base64::decode(after)?;
                String::from_utf8(decode)?
            }
            None => "1000-01-01 00:00:00".to_string(),
        };

        let post_connection = PostConnection::new(&db, first, &after).await?;

        Ok(post_connection)
    }

    async fn post_group(&self, ctx: &Context<'_>, id: u64) -> FieldResult<PostGroup> {
        let db = ctx.data::<Database>()?;

        let post_group = db.get_post_group_by_id(id).await?;

        Ok(post_group)
    }
}
