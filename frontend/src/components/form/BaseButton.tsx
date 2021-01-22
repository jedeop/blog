import React, { ReactElement } from "react";
import styled, { css } from "styled-components";

const StyledButton = styled.input<{ active: boolean }>`
  border: none;
  background-color: var(--formBase-color);
  margin: 0px; 
  font-size: 16px;
  width: unset !important;
  border-radius: 0px;
  :hover {
    background-color: var(--formFocus-color);
  }
  ${props => props.active && css`
    background-color: var(--formActive-color);
  `}
`;

interface BaseButtonProps {
  value: string,
  onClick: () => void,
  active?: boolean,
  type?: "button" | "submit"
}

export default function BaseButton({ value, onClick, active, type }: BaseButtonProps): ReactElement {
  function handleClick() {
    onClick();
  }
  return (
    <StyledButton type={ type || "button" } active={active || false} onClick={handleClick} value={value} />
  );
}