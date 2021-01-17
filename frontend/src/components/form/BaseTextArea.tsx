import React, { ChangeEvent, ReactElement } from "react";
import styled from "styled-components";

const StyledTextArea = styled.textarea`
  border: none;
  margin: 0px;
  background-color: hsl(0, 0%, 98%);
  :focus {
    background-color: hsl(0, 0%, 95%);
  }
`;

interface BaseTextAreaProps {
  value: string,
  onChange: (value: string) => void,
  placeholder?: string,
  rows?: number,
  className?: string,
  label: string,
}

export default function BaseTextArea({ value, onChange, placeholder, className, rows, label }: BaseTextAreaProps): ReactElement {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }
  return (                                                         
    <StyledTextArea className={className} rows={rows} value={value}
      aria-label={label}
      onChange={handleChange}
      placeholder={placeholder} >
    </StyledTextArea>
  );
}