use sqlx::types::Uuid;
use async_graphql::SimpleObject;

#[derive(SimpleObject, sqlx::FromRow)]
pub struct Tag {
    pub tag_id: Uuid,
    pub name: String,
}