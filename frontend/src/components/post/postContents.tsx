import React, {ReactElement} from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import github from "react-syntax-highlighter/dist/cjs/styles/hljs/github";
import gfm from "remark-gfm";
import InPostLink from "./inPostLink";
import Heading, { slugger } from "./heading";

const renderers = {
  code: function MDCode({language, value}: {language: string, value: React.ReactNode}) {
    return <SyntaxHighlighter style={github} language={language} showLineNumbers showInlineLineNumbers>{value}</SyntaxHighlighter>;
  },
  link: function MDLink({href, children}: {href: string, children: React.ReactNode}) {
    return <InPostLink href={href}>{children}</InPostLink>;
  },
  heading: function MDHeading({level, children}: {level: number, children: JSX.Element[]}) {
    return <Heading level={level}>{children}</Heading>;
  }
};

interface PostContentsProp {
  contents: string,
}

const Body = styled.div`
  img {
    max-width: 100%;
  }
`;

export default function PostContent({ contents }: PostContentsProp): ReactElement {
  slugger.reset();
  return (
    <Body>
      <ReactMarkdown plugins={[gfm]} renderers={renderers}>
        {contents}
      </ReactMarkdown>
    </Body>
  );
}