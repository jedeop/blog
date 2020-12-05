import PostList from '@/components/postList/postList'
import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

const Title = styled.h1`
  text-align: center;
  margin: 20px 0px;
`

const Home = () => (
  <div>
    <Helmet>
      <title>제덮 블로그</title>
    </Helmet>
    <Title>글 목록</Title>
    <PostList />
  </div>
)

export default Home