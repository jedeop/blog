import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import GlobalStyle from '@/styles/global'
import Header from './components/header'

const HomePage = loadable(() => import('@/pages/HomePage'))
const PostPage = loadable(() => import('@/pages/PostPage'))

const Container = styled.div`
  min-height: 100vh;
`


const App = () => (
  <Container>
    <GlobalStyle />
    <Helmet>
      <title>제덮 블로그</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="/dist/fonts/css/ibm-plex-sans-kr.min.css"/>
    </Helmet>
    <Header />
    <main>
      <Switch>
        <Route exact path="/" render={() => <HomePage />} />
        <Route path="/post/:postId">
          <PostPage />
        </Route>
      </Switch>
    </main>
    <footer>
    </footer>
  </Container>
)

export default App