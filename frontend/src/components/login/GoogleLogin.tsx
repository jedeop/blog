import React, { ReactElement } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

const Login = styled.a`
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  padding: 9.6px;
  height: 48px;
  border: 1px solid hsl(0, 0%, 80%);
  transition: box-shadow .3s;
  :hover {
    box-shadow: hsl(0, 0%, 80%) 0px 0px 10px 0px;
  }
`;
const Text = styled.div`
  font-family: 'Roboto', 'IBM Plex Sans KR';
  margin-left: 28.8px;
  margin-right: 15px;
  font-size: 16.8px;
  color: hsl(0, 0%, 30%);
`;

export default function GoogleLogin(): ReactElement {
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet" />
      </Helmet>

      <Login href="/api/oauth2callback/google">
        <svg xmlns="http://www.w3.org/2000/svg" height="21.6px" width="21.6px" viewBox="0 0 18 18">
          <path fill="#4285f4" d="M17.82 9.205c0-.639-.057-1.252-.164-1.841H9.18v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
          <path fill="#34a853" d="M9.18 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H1.137v2.332A8.997 8.997 0 009.18 18z"/>
          <path fill="#fbbc05" d="M4.144 10.71A5.41 5.41 0 013.862 9c0-.593.102-1.17.282-1.71V4.958H1.137A8.996 8.996 0 00.18 9c0 1.452.348 2.827.957 4.042z"/>
          <path fill="#ea4335" d="M9.18 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.643.891 11.606 0 9.18 0a8.997 8.997 0 00-8.043 4.958L4.144 7.29c.708-2.127 2.692-3.71 5.036-3.71z"/>
        </svg>
        <Text>
          Google로 로그인
        </Text>
      </Login>
    </>
  );
}