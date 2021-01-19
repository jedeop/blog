import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import PostTitle from "@/components/post/postTitle";
import { Post } from "@/types/post";
import PostContents from "@/components/post/postContents";
import styled from "styled-components";
import BaseContainer from "@/styles/container";
import Loading from "@/components/loading";
import { Helmet } from "react-helmet";
import PostManage from "@/components/post/postManage";

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
      tags {
        tagId
        name
      }
    }

    isOwner
  }
`;
interface GetPostData {
  post: Post,
  isOwner: boolean,
}
interface GetPostVariable {
  id: string,
}  


const Container = styled.article`
  ${BaseContainer}
  padding: 10px;
`;

export default function Post(): ReactElement {
  const { postId } = useParams<Params>();
  const { loading, error, data } = useQuery<GetPostData, GetPostVariable>(GET_POST, { variables: { id: postId } });
  
  if (loading) return <Loading />;
  if (error || !data) return <div>에러 발생: {error}</div>;
    
  const post = data.post;

  return (
    <div>
      <Helmet>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.title}`} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:image" content={`/api/thumb/${post.postId}`} />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta property="og:article:published_time" content={data.post.createdAt} />
        <meta property="og:article:modified_time" content={data.post.lastUpdate} />
        {
          data.post.tags?.map(tag => <meta key={tag.tagId} property="og:tag" content={tag.name} />)
        }
        <meta name="description" content={post.summary} />
        <title>{post.title} - 제덮 블로그</title>
      </Helmet>
      <Container>
        <PostTitle title={post.title} summary={post.summary} createdAt={post.createdAt} readTime={post.readTime} tags={post.tags} />
        {data.isOwner? <PostManage postId={post.postId} /> : null}
        <PostContents contents={post.contents} />
      </Container>
    </div>
  );
}