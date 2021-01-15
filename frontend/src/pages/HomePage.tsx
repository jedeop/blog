import PostList from "@/components/postList/postList";
import React, { ReactElement } from "react";
import { Helmet } from "react-helmet";

export default function Home(): ReactElement {
  return (
    <div>
      <Helmet>
        <title>제덮 블로그</title>
      </Helmet>
      <PostList />
    </div>
  );
}
