use async_graphql::{Context, FieldResult, Object};

use super::{
    pagination::Edge,
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
        first: u64,
        after: String,
    ) -> FieldResult<PostConnection> {
        let db = ctx.data::<Database>()?;

        let posts = db.get_posts(first, &after).await?;

        let edges: Vec<Edge<Post>> = posts
            .into_iter()
            .map(|post| {
                let cursor = base64::encode(post.created.to_string());
                Edge::<Post> { node: post, cursor }
            })
            .collect();

        let post_connection = PostConnection { edges };

        Ok(post_connection)
    }

    async fn post_group(&self, ctx: &Context<'_>, id: u64) -> FieldResult<PostGroup> {
        let db = ctx.data::<Database>()?;

        let post_group = db.get_post_group_by_id(id).await?;

        Ok(post_group)
    }
}
