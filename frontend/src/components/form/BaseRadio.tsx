import React, { ReactElement } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  border: none;
  background-color: var(--formBase-color);
  :focus {
    background-color: var(--formFocus-color);
  }
  appearance: radio;
  display: inline !important;
  width: auto !important;
`;

interface BaseRadioProps {
  name: string,
  label: string,
  value: string,
  checked: string,
  onChange: (value: string) => void,
}
export default function BaseRadio({ name, label, value, checked, onChange }: BaseRadioProps): ReactElement {
  function handleChange() {
    onChange(value);
  }
  const radioId = `radio-${label.replace(/ /g, "-")}`;
  return (
    <span>
      <label htmlFor={radioId}>{label}</label>
      <StyledInput id={radioId} type="radio" aria-label={label} 
        name={name} value={value} onChange={handleChange} checked={checked == value} />
    </span>
  );
}