use async_graphql::{Context, FieldResult, InputObject, Object};

use sqlx::types::{
    chrono::{self, Utc},
    Uuid,
};

use crate::database::Database;

use super::post::Post;

#[derive(Debug, sqlx::FromRow)]
pub struct Series {
    pub series_id: Uuid,
    pub title: String,
    pub summary: Option<String>,
    pub created_at: chrono::DateTime<Utc>,
    pub last_update: Option<chrono::DateTime<Utc>>,
}

#[Object]
impl Series {
    async fn series_id(&self) -> Uuid {
        self.series_id
    }
    async fn title(&self) -> &str {
        &self.title
    }
    async fn summary(&self) -> Option<&str> {
        self.summary.as_deref()
    }
    async fn created_at(&self) -> chrono::DateTime<Utc> {
        self.created_at
    }
    async fn last_update(&self) -> Option<chrono::DateTime<Utc>> {
        self.last_update
    }
    async fn article_count(&self, ctx: &Context<'_>) -> FieldResult<i64> {
        let db = ctx.data::<Database>()?;
        let count = db.get_series_count(self.series_id).await?;

        Ok(count)
    }
    async fn read_time_avg(&self, ctx: &Context<'_>) -> FieldResult<u64> {
        let db = ctx.data::<Database>()?;
        let avg = db.get_read_time_avg(self.series_id).await? as u64;

        Ok(avg)
    }
    async fn posts(&self, ctx: &Context<'_>) -> FieldResult<Vec<Post>> {
        let db = ctx.data::<Database>()?;
        let posts = db.get_posts_by_series(self.series_id).await?;

        Ok(posts)
    }
}

#[derive(InputObject)]
pub struct SeriesInput {
    pub title: String,
    pub summary: Option<String>,
}
