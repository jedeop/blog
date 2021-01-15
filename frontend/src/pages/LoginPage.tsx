import GoogleLogin from "@/components/login/GoogleLogin";
import React, { ReactElement } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
`;

export default function LoginPage(): ReactElement {
  return (
    <Container>
      <GoogleLogin />
    </Container>
  );
}