import GoogleLogin from "@/components/login/GoogleLogin";
import React, { ReactElement } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
`;

export default function LoginPage(): ReactElement {
  return (
    <Container>
      <Helmet>
        <title>로그인 - 제덮 블로그</title>
      </Helmet>
      <GoogleLogin />
    </Container>
  );
}