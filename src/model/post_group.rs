use async_graphql::{Enum, InputObject, Object};

use sqlx::types::chrono;

#[derive(sqlx::Type, Debug, Enum, Eq, PartialEq, Copy, Clone)]
#[sqlx(rename_all = "lowercase")]
pub enum PostGroupType {
    Series,
    Group,
}

#[derive(Debug)]
pub struct PostGroup {
    pub id: u32,
    pub title: String,
    pub intro: Option<String>,
    //pub article_count: u32,
    // pub read_time_avg: u32,
    pub updated: chrono::NaiveDateTime,
    pub group_type: PostGroupType,
}

#[Object]
impl PostGroup {
    async fn id(&self) -> u32 {
        self.id
    }
    async fn title(&self) -> &str {
        &self.title
    }
    async fn intro(&self) -> Option<&str> {
        self.intro.as_deref()
    }
    async fn updated(&self) -> chrono::NaiveDateTime {
        self.updated
    }
    async fn group_type(&self) -> PostGroupType {
        self.group_type
    }
    // TODO: article_count, read_time_avg
}

#[derive(InputObject)]
pub struct PostGroupInput {
    pub title: String,
    pub intro: Option<String>,
    pub group_type: PostGroupType,
}
