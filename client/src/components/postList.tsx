import React from 'react'
import { PostForList } from '@/types/post'
import PostItem from '@/components/postItem'
import { useQuery, gql } from '@apollo/client'
import styled from 'styled-components'

const GET_POSTS = gql`
query GetPosts {
  posts {
    edges {
      node {
        id
        title
        intro
        created
        readTime
      }
      cursor
    }
  }
}
`

const Container = styled.div`
  width: 50%;
  @media (max-width: 600px) {
    width: 90%;
  }
  margin: auto;
  padding: 20px;
`

export default function PostList() {
  const { loading, error, data } = useQuery(GET_POSTS)
  
  if (loading) return <div>로딩 중</div>
  if (error) return <div>에러 발생: {error}</div>

  const list = data.posts.edges.map(({ node }: { node: PostForList }) => <PostItem key={node.id} post={node}/>)
  return (
    <Container>
      {list}
    </Container>
  )
}