use async_graphql::SimpleObject;
use sqlx::types::Uuid;

#[derive(SimpleObject, sqlx::FromRow)]
pub struct Tag {
    pub tag_id: Uuid,
    pub name: String,
}
