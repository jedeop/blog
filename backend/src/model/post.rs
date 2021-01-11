use std::sync::Arc;

use anyhow::Result;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject};
use chrono::{FixedOffset, Utc};
use sqlx::types::Uuid;

use crate::{database::Database, utils};

use super::{
    pagination::{Edge, PageInfo},
    series::Series,
    tag::Tag,
};

#[derive(Debug, sqlx::FromRow)]
pub struct Post {
    pub post_id: Uuid,
    pub title: String,
    pub summary: Option<String>,
    pub contents: String,
    pub created_at: chrono::DateTime<Utc>,
    pub last_update: Option<chrono::DateTime<Utc>>,
    pub tags: Option<Vec<Uuid>>,
    pub series_id: Option<Uuid>,
}

#[Object]
impl Post {
    async fn post_id(&self) -> Uuid {
        self.post_id
    }
    async fn title(&self) -> &str {
        &self.title
    }
    async fn summary(&self) -> Option<&str> {
        self.summary.as_deref()
    }
    async fn contents(&self) -> &str {
        &self.contents
    }
    async fn created_at(&self) -> chrono::DateTime<Utc> {
        self.created_at
    }
    async fn last_update(&self) -> Option<chrono::DateTime<Utc>> {
        self.last_update
    }
    async fn read_time(&self) -> u64 {
        utils::get_read_time(&self.contents) as u64
    }
    async fn tags(&self, ctx: &Context<'_>) -> FieldResult<Option<Vec<Tag>>> {
        let db = ctx.data::<Arc<Database>>()?;
        let tags = match &self.tags {
            Some(tags) => Some(db.get_tags(tags).await?),
            None => None,
        };

        Ok(tags)
    }
    async fn series(&self, ctx: &Context<'_>) -> FieldResult<Option<Series>> {
        let db = ctx.data::<Arc<Database>>()?;
        let post_group = match self.series_id {
            Some(series_id) => db.get_series_by_id(series_id).await?,
            None => return Ok(None),
        };

        Ok(Some(post_group))
    }
}

#[derive(InputObject)]
pub struct PostInput {
    pub title: String,
    pub summary: Option<String>,
    pub contents: String,
    pub tags: Option<Vec<String>>,
    pub series_id: Option<Uuid>,
}

#[derive(SimpleObject)]
pub struct PostConnection {
    pub edges: Vec<Edge<Post>>,
    pub page_info: PageInfo,
}

impl PostConnection {
    pub async fn new(
        db: &Database,
        first: u32,
        after: chrono::DateTime<FixedOffset>,
    ) -> Result<PostConnection> {
        let posts = db.get_posts(first, after).await?;

        let mut edges: Vec<Edge<Post>> = posts
            .into_iter()
            .map(|post| {
                let cursor = base64::encode(post.created_at.to_rfc3339());
                Edge::<Post> { node: post, cursor }
            })
            .collect();

        let has_next_page = edges.len() > first as usize;
        if has_next_page {
            edges.remove(edges.len() - 1);
        }

        let end_cursor = edges.last().map(|edge| edge.cursor.clone());

        Ok(PostConnection {
            page_info: PageInfo {
                has_next_page,
                end_cursor,
            },
            edges,
        })
    }
}
