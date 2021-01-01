import React from 'react'
import GithubSlugger from 'github-slugger'

export const slugger = new GithubSlugger()

interface HeadingProps {
  level: number,
  children: JSX.Element[]
}

export default function Heading({ level, children }: HeadingProps) {
  return React.createElement(
    `h${level}`,
    {
      id: children.length > 0 ? slugger.slug(children[0].props.children) : undefined,
    },
    children
  )
}