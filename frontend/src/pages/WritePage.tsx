import React, { useState } from 'react'
import styled from 'styled-components'
import BaseContainer from '@/styles/container'
import PostContents from '@/components/post/postContents'
import BaseTextArea from '@/components/form/BaseTextArea'
import BaseInput from '@/components/form/BaseInput'
import Switch from '@/components/switch'
import BaseButton from '@/components/form/BaseButton'
import { gql, useMutation } from '@apollo/client'
import { PostInput } from '@/types/post'
import { useHistory } from 'react-router-dom'

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
interface CreatePostVariables {
  post: PostInput,
}

const Container = styled.div`
  ${BaseContainer}
  margin-top: 10px;
  
  > form > * {
    margin: 10px 0px;
  }
  
  input, textarea {
    width: 100%;
    font-size: 16px;
    display: block;
  }
`
const ContentsTextArea = styled(BaseTextArea)`
  resize: vertical;
`

export default function () {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [contents, setContents] = useState("")
  const [createPost, { data }] = useMutation<CreatePostData, CreatePostVariables>(CREATE_POST)
  const history = useHistory()

  return (
    <Container>
      <form method="post"
        onSubmit={ e => {
          e.preventDefault()
          if (!title) return;
          createPost({ variables: {
            post: {
              title,
              summary,
              contents,
              // TODO: tags, seriesId
            }
          }}).then(({ data }) => {
            history.push(`/post/${data?.createPost.postId}`)
          })
        }}
      >
        <BaseInput type="text" placeholder="제목을 입력하세요" maxLength={50} value={title} onChange={setTitle} />
        <BaseInput type="text" placeholder="개요를 입력하세요" maxLength={100} value={summary} onChange={setSummary} />
        <Switch 
          items={[
            {
              name: "작성하기",
              children: <ContentsTextArea value={contents} onChange={setContents} placeholder="본문 내용을 입력하세요" rows={20} />
            },
            {
              name: "미리보기",
              children: contents? <PostContents contents={contents} /> : <em>내용이 없습니다.</em>
            }
          ]} 
        />
        <BaseButton type="submit" value="저장하기" onClick={() => {}} />
      </form>
    </Container>
  )
}