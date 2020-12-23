import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import PostTitle from '@/components/post/postTitle'
import { Post } from '@/types/post'
import PostContents from '@/components/post/postContents'
import styled from 'styled-components'
import BaseContainer from '@/styles/container'

interface Params {
  postId: string,
}

const GET_POST = gql`
  query ($id: UUID!) {
  	post(postId: $id) {
      postId
      title
      summary
      contents
      createdAt
      lastUpdate
      readTime
    }
  }
`
interface GetPostData {
  post: Post,
}
interface GetPostVariable {
  id: string,
}  


const Container = styled.div`
  ${BaseContainer}
  background-color: white;
  padding: 10px;
`

const Post = () => {
  const { postId } = useParams<Params>()
  const { loading, error, data } = useQuery<GetPostData, GetPostVariable>(GET_POST, { variables: { id: postId } })
  
  if (loading) return <div>로딩 중</div>
  if (error || !data) return <div>에러 발생: {error}</div>
    
  const post = data.post

  return (
    <div>
      <Container>
        <PostTitle title={post.title} createdAt={post.createdAt} readTime={post.readTime} />
        <PostContents contents={post.contents} />
      </Container>
    </div>
  )
}

export default Post;