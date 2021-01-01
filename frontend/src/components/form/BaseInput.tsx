import React, { ChangeEvent } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  border: none;
  background-color: hsl(0, 0%, 98%);
  :focus {
    background-color: hsl(0, 0%, 95%);
  }
`

interface BaseInputProps {
  type: string,
  placeholder?: string,
  maxLength?: number,
  value: any,
  onChange: Function,
}
export default function BaseInput({ type, placeholder, maxLength, value, onChange }: BaseInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }
  return (
    <StyledInput type={type} placeholder={placeholder} maxLength={maxLength}
      value={value} onChange={handleChange} />
  )
}