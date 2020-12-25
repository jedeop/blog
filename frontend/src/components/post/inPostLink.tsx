import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 10%;
  background-color: rgba(97, 205, 183, 0.8);
  bottom: 0px;
  left: 0px;
  transition: background-color 0.1s ease 0s, height 0.2s cubic-bezier(.8,0,.27,1.55) 0s;
`
const LinkCss = css`
  position: relative;
  padding: 0px 1px;
  &:hover ${Background} {
    height: 90%;
    background-color: rgba(97, 205, 183, 0.5);
  }
`
const StyledLink = styled(Link)`
  ${LinkCss}
`
const StyledA = styled.a`
  ${LinkCss}
`

interface InPostLinkProps {
  href: string,
  children: React.ReactNode
}
export default function InPostLink({ href, children }: InPostLinkProps) {
  const contents = (
    <>
      <Background />
      {children}
    </>
  )

  return /^https?:\/\//.test(href)
    ? (
      <StyledA href={href}>
        {contents}
      </StyledA>
    )
    : (
      <StyledLink to={href}>
        {contents}
      </StyledLink>
    )
}