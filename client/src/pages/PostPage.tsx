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
  query ($id: Int!) {
  	post(id: $id) {
      id
      title
      intro
      contents
      created
      edited
      readTime
    }
  }
`
interface GetPostData {
  post: Post,
}
interface GetPostVariable {
  id: number,
}  


const Container = styled.div`
  ${BaseContainer}
  background-color: white;
  padding: 20px;
`

const Post = () => {
  const { postId } = useParams<Params>()
  const { loading, error, data } = useQuery<GetPostData, GetPostVariable>(GET_POST, { variables: { id: parseInt(postId) } })
  
  if (loading) return <div>로딩 중</div>
  if (error || !data) return <div>에러 발생: {error}</div>
    
  const post = data.post

  return (
    <div>
      <Container>
        <PostTitle title={post.title} />
        <PostContents contents={post.contents} />
      </Container>
      <Link to="/">글 목록으로 돌아가기</Link>
    </div>
  )
}

export default Post;