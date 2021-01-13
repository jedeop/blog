import GoogleLogin from '@/components/login/GoogleLogin'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
`

export default function () {
  return (
    <Container>
      <GoogleLogin />
    </Container>
  )
}