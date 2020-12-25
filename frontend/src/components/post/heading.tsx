import React from 'react'
import GithubSlugger from 'github-slugger'

export const slugger = new GithubSlugger()

interface HeadingProps {
  level: number,
  children: JSX.Element[]
}

export default function Heading({ level, children }: HeadingProps) {
  console.log(children)
  return React.createElement(
    `h${level}`,
    {
      id: slugger.slug(children[0].props.children),
    },
    children
  )
}