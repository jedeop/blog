use async_graphql::{Context, FieldResult, Object};
use chrono::DateTime;
use sqlx::types::{chrono, Uuid};

use super::{
    post::{Post, PostConnection},
    series::Series,
};
use crate::Database;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn post(&self, ctx: &Context<'_>, post_id: Uuid) -> FieldResult<Post> {
        let db = ctx.data::<Database>()?;

        let post = db.get_post_by_id(post_id).await?;

        Ok(post)
    }

    async fn posts(
        &self,
        ctx: &Context<'_>,
        first: Option<u32>,
        after: Option<String>,
    ) -> FieldResult<PostConnection> {
        let db = ctx.data::<Database>()?;

        let first = first.unwrap_or(10);
        let after = match after {
            Some(after) => {
                let decode = base64::decode(after)?;
                String::from_utf8(decode)?
            }
            None => String::from("1970-01-01T00:00:00+00:00"),
        };
        let after = DateTime::parse_from_rfc3339(&after)?;

        let post_connection = PostConnection::new(&db, first, after).await?;

        Ok(post_connection)
    }

    async fn series(&self, ctx: &Context<'_>, series_id: Uuid) -> FieldResult<Series> {
        let db = ctx.data::<Database>()?;

        let series = db.get_series_by_id(series_id).await?;

        Ok(series)
    }
}