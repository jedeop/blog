import React, { ReactElement } from "react";
import { Route, Switch } from "react-router-dom";
import loadable from "@loadable/component";
import { Helmet } from "react-helmet";
import styled, { ThemeProvider } from "styled-components";

import * as theme from "@/styles/theme";

import GlobalStyle from "@/styles/global";
import Header from "./components/header";
import NotFound from "./components/error/notFound";

const HomePage = loadable(() => import("@/pages/HomePage"));
const PostPage = loadable(() => import("@/pages/PostPage"));
const WritePage = loadable(() => import("@/pages/WritePage"));
const UpdatePage = loadable(() => import("@/pages/UpdatePage"));
const LoginPage = loadable(() => import("@/pages/LoginPage"));

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.bg};
`;


export default function App(): ReactElement {
  return (
    <Container>
      <GlobalStyle />
      <ThemeProvider theme={theme.Light}>
        <Helmet>
          <title>제덮 블로그</title>
          <link rel="stylesheet" href="/dist/fonts/css/ibm-plex-sans-kr.min.css"/>
          <link rel="icon" type="image/png" href="/favicon.png" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="제덮 블로그" />
          <meta property="og:locale" content="ko_KR" />
        </Helmet>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" render={() => <HomePage />} />
            <Route exact path="/post/:postId">
              <PostPage />
            </Route>
            <Route exact path="/write">
              <WritePage />
            </Route>
            <Route exact path="/write/:postId">
              <UpdatePage />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route
              render={({ staticContext }) => {
                if (staticContext) staticContext.statusCode = 404;
                return <NotFound />;
              }}
            />
          </Switch>
        </main>
        <footer>
        </footer>
      </ThemeProvider>
    </Container>
  );
}