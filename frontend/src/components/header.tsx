import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Logo from './logo'
import { Edit3, LogIn } from 'react-feather'

const Container = styled.header`
  padding: 5px 15px;
  background: linear-gradient(272deg, #61CDB7 0%, #24B799 100%);
  font-size: 25px;
  font-weight: bold;
  color: white;

  display: flex;
`
const FlexLink = styled(Link)`
  display: flex;
  align-items: center;
`
const Title = styled.span`
  margin-left: 5px;
`
const LeftLink = styled(FlexLink)`
  margin-right: auto;
`
const RightLink = styled(FlexLink)`
  margin: 0px 5px;
`

export default function Header() {
  return (
    <Container>
      <LeftLink to="/">
        <Logo width={100} />
        <Title>블로그</Title>
      </LeftLink>
      <RightLink to="/write">
        <Edit3 size={25} />
      </RightLink>
      <RightLink to="/login">
        <LogIn size={25} />
      </RightLink>
    </Container>
  )
}
