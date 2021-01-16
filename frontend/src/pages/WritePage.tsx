import React, { ReactElement, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { PostInput } from "@/types/post";
import { useHistory } from "react-router-dom";
import PostForm from "@/components/form/postForm";

const CREATE_POST = gql`
  mutation CreatePost($post: PostInput!) {
    createPost(post: $post) {
      postId
    }
  }
`;
interface CreatePostData {
  createPost: {
    postId: string,
  }
}
interface CreatePostVariable {
  post: PostInput,
}

export default function WritePage (): ReactElement {

  const [createPost] = useMutation<CreatePostData, CreatePostVariable>(CREATE_POST);
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contents, setContents] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  return (
    <PostForm onSubmit={
      e => {
        e.preventDefault();
        if (!title) return;
        createPost({
          variables: {
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
            history.push(`/post/${data?.createPost.postId}`);
          });
      }}
    title={[title, setTitle]}
    summary={[summary, setSummary]}
    contents={[contents, setContents]}
    tags={[tags, setTags]}
    />

  );
}