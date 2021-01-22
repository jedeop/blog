import React, { ChangeEvent, ReactElement } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  border: none;
  background-color: var(--formBase-color);
  :focus {
    background-color: var(--formFocus-color);
  }
`;

interface BaseInputProps {
  type: string,
  label: string,
  placeholder?: string,
  maxLength?: number,
  value: string,
  onChange: (value: string) => void,
}
export default function BaseInput({ type, label, placeholder, maxLength, value, onChange }: BaseInputProps): ReactElement {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }
  return (
    <StyledInput type={type} aria-label={label} placeholder={placeholder} maxLength={maxLength}
      value={value} onChange={handleChange} />
  );
}