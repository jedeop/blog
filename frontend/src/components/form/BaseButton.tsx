import React, { ReactElement } from "react";
import styled, { css } from "styled-components";

const StyledButton = styled.input<{ active: boolean }>`
  border: none;
  background-color: hsl(0, 0%, 95%);
  margin: 0px; 
  font-size: 16px;
  width: unset !important;
  border-radius: 0px;
  :hover {
    background-color: hsl(0, 0%, 90%);
  }
  ${props => props.active && css`
    background-color: hsl(0, 0%, 87%);
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