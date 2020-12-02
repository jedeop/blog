import PostList from '@/components/postList'
import React from 'react'
import { Helmet } from 'react-helmet'

const Home = () => (
  <div>
    <Helmet>
      <title>Basic SSR: Home</title>
    </Helmet>
    <PostList />
  </div>
)

export default Home