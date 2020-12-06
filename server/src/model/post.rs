use anyhow::Result;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject};
use sqlx::types::chrono;

use crate::{database::Database, utils};

use super::{
    pagination::{Edge, PageInfo},
    post_group::PostGroup,
};

#[derive(Debug)]
pub struct Post {
    pub id: u64,
    pub title: String,
    pub intro: Option<String>,
    pub contents: String,
    pub created: chrono::NaiveDateTime,
    pub edited: Option<chrono::NaiveDateTime>,
    pub group_id: Option<u64>,
}

#[Object]
impl Post {
    async fn id(&self) -> u64 {
        self.id
    }
    async fn title(&self) -> &str {
        &self.title
    }
    async fn intro(&self) -> Option<&str> {
        self.intro.as_deref()
    }
    async fn contents(&self) -> &str {
        &self.contents
    }
    async fn created(&self) -> chrono::NaiveDateTime {
        self.created
    }
    async fn edited(&self) -> Option<chrono::NaiveDateTime> {
        self.edited
    }
    async fn read_time(&self) -> u64 {
        utils::get_read_time(&self.contents) as u64
    }
    async fn group(&self, ctx: &Context<'_>) -> FieldResult<Option<PostGroup>> {
        let db = ctx.data::<Database>()?;
        let post_group = match self.group_id {
            Some(id) => db.get_post_group_by_id(id).await?,
            None => return Ok(None),
        };

        Ok(Some(post_group))
    }
}

#[derive(InputObject)]
pub struct PostInput {
    pub title: String,
    pub intro: Option<String>,
    pub contents: String,
    pub group_id: Option<u64>,
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
