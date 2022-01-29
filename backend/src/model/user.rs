use std::env;

use async_graphql::SimpleObject;

use crate::auth::Service;

#[derive(sqlx::FromRow)]
pub struct UserInput {
    pub user_id: String,
    pub name: Option<String>,
    pub avatar_url: Option<String>,
}
impl UserInput {
    pub fn new(
        service: Service,
        user_id: String,
        name: Option<String>,
        avatar_url: Option<String>,
    ) -> Self {
        let user_id = format!("{}{}", service.to_string(), user_id,);

        Self {
            user_id,
            name,
            avatar_url,
        }
    }
}

#[derive(sqlx::FromRow, Debug, serde::Serialize, serde::Deserialize, SimpleObject)]
pub struct User {
    pub user_id: String,
    pub name: String,
    pub avatar_url: String,
}
impl User {
    pub fn is_owner(&self) -> bool {
        self.user_id == env::var("OWNER_ID").expect("expected OWNER_ID var in env")
    }
}
