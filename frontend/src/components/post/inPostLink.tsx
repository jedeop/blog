import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

const Background = styled.span`
  position: absolute;
  width: 100%;
  height: 10%;
  background-color: ${props => props.theme.primary};
  bottom: 0px;
  left: 0px;
  transition: background-color 0.1s ease 0s, height 0.2s cubic-bezier(.8,0,.27,1.55) 0s;
  z-index: -1;
`;
const LinkCss = css`
  position: relative;
  padding: 0px 1px;
  z-index: 1;
  &:hover ${Background} {
    height: 90%;
    background-color: ${props => `${props.theme.primary}80`};
  }
`;
const StyledLink = styled(Link)`
  ${LinkCss}
`;
const StyledA = styled.a`
  ${LinkCss}
`;

interface InPostLinkProps {
  href: string,
  children: React.ReactNode
}
export default function InPostLink({ href, children }: InPostLinkProps): ReactElement {
  const contents = (
    <>
      <Background />
      {children}
    </>
  );

  return /^(https?:\/\/|#)/.test(href)
    ? (
      <StyledA href={href}>
        {contents}
      </StyledA>
    )
    : (
      <StyledLink to={href}>
        {contents}
      </StyledLink>
    );
}