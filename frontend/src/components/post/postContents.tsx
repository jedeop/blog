import React from 'react'
import ReactMarkdown from 'react-markdown'

interface PostContentsProp {
  contents: string,
}

const PostContents = ({ contents }: PostContentsProp) => {
  return (
    <ReactMarkdown plugins={[]} children={contents} />
  )
}

export default PostContents