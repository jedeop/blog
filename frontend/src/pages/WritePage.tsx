import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { PostInput } from '@/types/post'
import { useHistory, useParams } from 'react-router-dom'
import PostForm from '@/components/form/postForm'
import Loading from '@/components/loading'

const CREATE_POST = gql`
  mutation CreatePost($post: PostInput!) {
    createPost(post: $post) {
      postId
    }
  }
`
interface CreatePostData {
  createPost: {
    postId: string,
  }
}
interface CreatePostVariable {
  post: PostInput,
}
const UPDATE_POST = gql`
  mutation UpdatePost($postId: UUID!, $post: PostInput!) {
    updatePost(postId: $postId, post: $post) {
      postId
    }
  }
`
interface UpdatePostData {
  updatePost: {
    postId: string,
  }
}
interface UpdatePostVariable {
  postId: string,
  post: PostInput,
}

const GET_POST = gql`
  query GetPostForUpdate($postId: UUID!) {
    post(postId: $postId) {
      title
      summary
      contents
    }
  }
`
interface GetPostData {
  post: PostInput
}
interface GetPostVariable {
  postId: string,
}

interface Params {
  postId?: string,
}

export default function () {
  const { postId } = useParams<Params>()

  const [createPost] = useMutation<CreatePostData, CreatePostVariable>(CREATE_POST)
  const [updatePost] = useMutation<UpdatePostData, UpdatePostVariable>(UPDATE_POST)
  const history = useHistory()

  let existingPost: PostInput | undefined;
  if (postId) {
    const { loading, error, data } = useQuery<GetPostData, GetPostVariable>(GET_POST, { variables: { postId: postId } })
    if (loading) return <Loading />
    if (error || !data) return <div>에러 발생: {error}</div>

    existingPost = data.post
  }
  const [title, setTitle] = useState(existingPost?.title || "")
  const [summary, setSummary] = useState(existingPost?.summary || "")
  const [contents, setContents] = useState(existingPost?.contents || "")

  return (
    <PostForm onSubmit={
      e => {
        e.preventDefault()
        if (!title) return;
        if (postId) {
          updatePost({
            variables: {
              postId: postId,
              post: {
                title,
                summary,
                contents,
                // TODO: tags, seriesId
              }
            }
          })
          .then(({ data }) => {
            history.push(`/post/${data?.updatePost.postId}`)
          })
        } else {
          createPost({
            variables: {
              post: {
                title,
                summary,
                contents,
                // TODO: tags, seriesId
              }
            }
          })
          .then(({ data }) => {
            history.push(`/post/${data?.createPost.postId}`)
          })
        }
      }}
      title={[title, setTitle]}
      summary={[summary, setSummary]}
      contents={[contents, setContents]}
    />

  )
}