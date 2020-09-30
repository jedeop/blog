use sqlx::types::chrono;

#[derive(Debug)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub intro: Option<String>,
    pub contents: Option<String>,
    pub body: String,
    pub created: chrono::NaiveDateTime,
    pub edited: Option<chrono::NaiveDateTime>,
    pub read_time: i32,
    pub collection_id: Option<i32>,
}
