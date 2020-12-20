use anyhow::Result;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject};
use sqlx::types::chrono::{self, Utc};
use sqlx::types::Uuid;

use crate::{database::Database, utils};

use super::{
    pagination::{Edge, PageInfo},
    series::Series,
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
    async fn intro(&self) -> Option<&str> {
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
    // TOOD: tags
    async fn series(&self, ctx: &Context<'_>) -> FieldResult<Option<Series>> {
        let db = ctx.data::<Database>()?;
        let post_group = match self.series_id {
            Some(id) => db.get_post_group_by_id(id).await?,
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
    pub series_id: Option<Uuid>,
}

#[derive(SimpleObject)]
pub struct PostConnection {
    pub edges: Vec<Edge<Post>>,
    pub page_info: PageInfo,
}

impl PostConnection {
    pub async fn new(db: &Database, first: u64, after: &str) -> Result<PostConnection> {
        let posts = db.get_posts(first, after).await?;

        let mut edges: Vec<Edge<Post>> = posts
            .into_iter()
            .map(|post| {
                let cursor = base64::encode(post.created.to_string());
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
