import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Loader } from 'react-feather'

const Container = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const spin = keyframes`
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
`
const StyledLoader = styled(Loader)`
  animation: ${spin} 2s infinite linear;
`

export default function Loading() {
  return (
    <Container>
      <StyledLoader color="gray" />
    </Container>
  )
}