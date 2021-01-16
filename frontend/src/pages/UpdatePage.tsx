import React, { ReactElement, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { PostForUpdate, PostInput } from "@/types/post";
import { useHistory, useParams } from "react-router-dom";
import PostForm from "@/components/form/postForm";
import Loading from "@/components/loading";

const GET_POST = gql`
  query GetPostForUpdate($postId: UUID!) {
    post(postId: $postId) {
      title
      summary
      contents
      tags {
        name
      }
    }
  }
`;
interface GetPostData {
  post: PostForUpdate
}
interface GetPostVariable {
  postId: string,
}

const UPDATE_POST = gql`
  mutation UpdatePost($postId: UUID!, $post: PostInput!) {
    updatePost(postId: $postId, post: $post) {
      postId
    }
  }
`;
interface UpdatePostData {
  updatePost: {
    postId: string,
  }
}
interface UpdatePostVariable {
  postId: string,
  post: PostInput,
}

interface Params {
  postId: string,
}

export default function WritePage (): ReactElement {
  const { postId } = useParams<Params>();

  const [updatePost] = useMutation<UpdatePostData, UpdatePostVariable>(UPDATE_POST);
  const history = useHistory();

  const [isInited, setIsInited] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contents, setContents] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { loading, error, data } = useQuery<GetPostData, GetPostVariable>(GET_POST, { variables: { postId: postId } });
  if (loading) return <Loading />;
  if (error || !data) return <div>에러 발생: {error}</div>;
  if (!isInited) {
    setTitle(data.post.title);
    setSummary(data.post.summary || "");
    setContents(data.post.contents);
    setTags(data.post.tags?.map(tag => tag.name) || []);
    setIsInited(true);
  }

  return (
    <PostForm onSubmit={
      e => {
        e.preventDefault();
        if (!title) return;
        updatePost({
          variables: {
            postId: postId,
            post: {
              title,
              summary,
              contents,
              tags,
              // TODO: seriesId
            }
          }
        })
          .then(({ data }) => {
            history.push(`/post/${data?.updatePost.postId}`);
          });
      }}
    title={[title, setTitle]}
    summary={[summary, setSummary]}
    contents={[contents, setContents]}
    tags={[tags, setTags]}
    />

  );
}