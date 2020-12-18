use async_graphql::{OutputType, SimpleObject};

#[derive(SimpleObject)]
pub struct Edge<Node>
where
    Node: Send + Sync + OutputType,
{
    pub node: Node,
    pub cursor: String,
}

#[derive(SimpleObject)]
pub struct PageInfo {
    pub has_next_page: bool,
    pub end_cursor: Option<String>,
}
