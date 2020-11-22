use async_graphql::{OutputValueType, SimpleObject};

#[derive(SimpleObject)]
pub struct Edge<Node>
where
    Node: Send + Sync + OutputValueType,
{
    pub node: Node,
    pub cursor: String,
}
