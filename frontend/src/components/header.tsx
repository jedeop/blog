import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Logo from "./logo";
import { Edit3, LogIn, LogOut } from "react-feather";
import { gql, useQuery } from "@apollo/client";
import Loading from "./loading";

const IS_LOGINED = gql`
  query IsLogined {
    isLogined
    isOwner
  }
`;
interface IsLoginedData {
  isLogined: boolean,
  isOwner: boolean,
}

const Container = styled.header`
  padding: 5px 15px;
  background: linear-gradient(272deg, #61CDB7 0%, #24B799 100%);
  font-size: 25px;
  font-weight: bold;
  color: white;

  display: flex;
`;
const FlexLink = styled(Link)`
  display: flex;
  align-items: center;
`;
const Title = styled.span`
  margin-left: 5px;
`;
const LeftLink = styled(FlexLink)`
  margin-right: auto;
`;
const RightLink = styled(FlexLink)`
  margin: 0px 5px;
`;
const RightA = styled.a`
  display: flex;
  align-items: center;
  margin: 0px 5px;
`;

export default function Header(): ReactElement {
  const { loading, error, data } = useQuery<IsLoginedData>(IS_LOGINED);
  return (
    <Container>
      <LeftLink to="/">
        <Logo width={100} />
        <Title>블로그</Title>
      </LeftLink>
      {
        loading ? <Loading />
          : error || !data ? <div>에러 발생: {error}</div>
            : data.isLogined ? (
              <>
                {
                  data.isOwner ? (
                    <RightLink to="/write">
                      <Edit3 size={25} />
                    </RightLink>
                  )
                    : <div></div>
                }
                <RightA href="/api/logout">
                  <LogOut size={25} />
                </RightA>
              </>
            )
              : (
                <RightLink to="/login">
                  <LogIn size={25} />
                </RightLink>
              )
      }
    </Container>
  );
}
