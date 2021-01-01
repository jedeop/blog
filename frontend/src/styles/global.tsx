import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: 'IBM Plex Sans KR', sans-serif;
  }
  
  input, textarea {
    font-family: 'IBM Plex Sans KR', sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    -webkit-appearance: none;
  }
`

export default GlobalStyle