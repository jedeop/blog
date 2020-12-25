import React from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import gfm from 'remark-gfm'
import InPostLink from './inPostLink'

const renderers = {
  code: ({language, value}) => {
    return <SyntaxHighlighter style={github} language={language} children={value} showLineNumbers showInlineLineNumbers />
  },
  link: ({href, children}) => {
    return <InPostLink href={href} children={children} />
  }
}

interface PostContentsProp {
  contents: string,
}

const Body = styled.div`
`

const PostContents = ({ contents }: PostContentsProp) => {
  return (
    <Body>
      <ReactMarkdown plugins={[gfm]} renderers={renderers} children={contents} />
    </Body>
  )
}

export default PostContents