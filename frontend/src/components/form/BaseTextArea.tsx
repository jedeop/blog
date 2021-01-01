import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

const StyledTextArea = styled.textarea`
  border: none;
  margin: 0px;
  background-color: hsl(0, 0%, 98%);
  :focus {
    background-color: hsl(0, 0%, 95%);
  }
`

interface BaseTextAreaProps {
  value: string,
  onChange: Function,
  placeholder?: string,
  rows?: number,
  className?: string,
}

export default function BaseTextArea({ value, onChange, placeholder, className, rows }: BaseTextAreaProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value)
  }
  return (                                                         
    <StyledTextArea className={className} rows={rows} value={value}
      onChange={handleChange}
      placeholder={placeholder} >
    </StyledTextArea>
  )
}