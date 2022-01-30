import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const StyledH1 = styled.h1`
  font-size: 35px;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function NotFound(): ReactElement {
  return (
    <StyledH1>
      404 NOT FOUND
    </StyledH1>
  );
}