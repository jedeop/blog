use async_graphql::{Context, FieldResult, InputObject, Object};

use sqlx::types::chrono;

use crate::database::Database;

use super::post::Post;

#[derive(Debug)]
pub struct PostGroup {
    pub id: u64,
    pub title: String,
    pub intro: Option<String>,
    pub created: chrono::NaiveDateTime,
    pub updated: chrono::NaiveDateTime,
}

#[Object]
impl PostGroup {
    async fn id(&self) -> u64 {
        self.id
    }
    async fn title(&self) -> &str {
        &self.title
    }
    async fn intro(&self) -> Option<&str> {
        self.intro.as_deref()
    }
    async fn created(&self) -> chrono::NaiveDateTime {
        self.created
    }
    async fn updated(&self) -> chrono::NaiveDateTime {
        self.updated
    }
    // TODO: article_count, read_time_avg
    async fn article_count(&self, ctx: &Context<'_>) -> FieldResult<i64> {
        let db = ctx.data::<Database>()?;
        let count = db.get_post_group_count(self.id).await?;

        Ok(count)
    }
    async fn read_time_avg(&self, ctx: &Context<'_>) -> FieldResult<u64> {
        let db = ctx.data::<Database>()?;
        let avg = db.get_read_time_avg(self.id).await? as u64;

        Ok(avg)
    }
    async fn posts(&self, ctx: &Context<'_>) -> FieldResult<Vec<Post>> {
        let db = ctx.data::<Database>()?;
        let posts = db.get_posts_by_group(self.id).await?;

        Ok(posts)
    }
}

#[derive(InputObject)]
pub struct PostGroupInput {
    pub title: String,
    pub intro: Option<String>,
}
