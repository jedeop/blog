import React from 'react'
import { Link, useParams } from 'react-router-dom'

interface Params {
  postId: string,
}

const Post = () => {
  const { postId } = useParams<Params>()
  return (
    <div>
      <div>
        블로그 본문: {postId}
      </div>
      <Link to="/">글 목록으로 돌아가기</Link>
    </div>
  )
}

export default Post;