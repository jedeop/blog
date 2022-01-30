import React, { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import github from "react-syntax-highlighter/dist/cjs/styles/hljs/github";
import gfm from "remark-gfm";
import InPostLink from "./inPostLink";
import loadable from "@loadable/component";

const SyntaxHighlighter = loadable(() => import("react-syntax-highlighter"));

interface PostContentsProp {
  contents: string,
}

const Body = styled.div`
  img {
    max-width: 100%;
  }
`;

export default function PostContent({ contents }: PostContentsProp): ReactElement {
  return (
    <Body>
      <ReactMarkdown remarkPlugins={[gfm]} components={{
        // code: ({ language, value }: { language: string, value: React.ReactNode }) => (
        //   <SyntaxHighlighter style={github} language={language} showLineNumbers showInlineLineNumbers>{value}</SyntaxHighlighter>
        // ),
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={github}
              language={match[1]}
              PreTag="div"
              showLineNumbers
              showInlineLineNumbers
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a({ href, children }) {
          return <InPostLink href={href || "#"}>{children}</InPostLink>;
        },
        //TODO: heading에 링크 걸기. heading.tsx에 이전 소스 있음.
      }}>
        {contents}
      </ReactMarkdown>
    </Body>
  );
}