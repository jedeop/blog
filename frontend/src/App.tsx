import React, { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import { Helmet } from "react-helmet";
import styled from "styled-components";

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
  margin: auto;
  width: 90%;
  @media screen and (min-width: 768px) {
    width: 80%;
  }
  @media screen and (min-width: 1024px) {
    width: 800px;
  }
`;

export default function App(): ReactElement {
  return (
    <Container>
      <GlobalStyle />
      <Helmet>
        <title>제덮 블로그</title>
        <link rel="stylesheet" href="/fonts/pretendardvariable.css"/>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="제덮 블로그" />
        <meta property="og:locale" content="ko_KR" />
      </Helmet>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/write/:postId" element={<UpdatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
      </footer>
    </Container>
  );
}