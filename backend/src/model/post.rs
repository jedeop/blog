use async_graphql::{Context, FieldResult, InputObject, Object};
use sqlx::types::chrono;

use crate::database::Database;

use super::post_group::PostGroup;

#[derive(Debug)]
pub struct Post {
    pub id: u32,
    pub title: String,
    pub intro: Option<String>,
    pub contents: Option<String>,
    pub body: String,
    pub created: chrono::NaiveDateTime,
    pub edited: Option<chrono::NaiveDateTime>,
    pub read_time: u32,
    pub group_id: Option<u32>,
}

#[Object]
impl Post {
    async fn id(&self) -> u32 {
        self.id
    }
    async fn title(&self) -> &str {
        &self.title
    }
    async fn intro(&self) -> Option<&str> {
        self.intro.as_deref()
    }
    async fn contents(&self) -> Option<Vec<&str>> {
        self.contents
            .as_ref()
            .map(|contents| contents.split('\n').collect())
    }
    async fn body(&self) -> &str {
        &self.body
    }
    async fn created(&self) -> chrono::NaiveDateTime {
        self.created
    }
    async fn edited(&self) -> Option<chrono::NaiveDateTime> {
        self.edited
    }
    async fn read_time(&self) -> u32 {
        self.read_time
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
    pub body: String,
    pub group_id: Option<u32>,
}