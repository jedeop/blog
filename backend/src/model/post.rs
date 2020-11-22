use async_graphql::{Context, FieldResult, InputObject, Object};
use sqlx::types::chrono;

use crate::{database::Database, utils};

use super::post_group::PostGroup;

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
