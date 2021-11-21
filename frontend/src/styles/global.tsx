import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    background-color: var(--bg-color);
    color: var(--fg-color);
  }
  
  input, textarea {
    color: var(--fg-color);
  }
  
  html, body, input, textarea {
    font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    -webkit-appearance: none;
  }
  
  :root {
    --primary-color:hsl(168, 52%, 59%);
    --primary-dark-color: hsl(168, 52%, 42%);
    --link-color: var(--primary-color);

    --fg-color: #000000;
    --fg1-color: hsl(0, 0%, 30%);
    --fg2-color: hsl(0, 0%, 40%);

    --bg-color: #FFFFFF;
    --bg1-color: hsl(0, 0%, 90%);
    --bg2-color: hsl(0, 0%, 80%);

    --formBase-color: hsl(0, 0%, 97%);
    --formFocus-color: hsl(0, 0%, 94%);
    --formActive-color: hsl(0, 0%, 87%);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --link-color: var(--primary-dark-color);

      --fg-color: #FFFFFF;
      --fg1-color: hsl(0, 0%, 60%);
      --fg2-color: hsl(0, 0%, 50%);
     
      --bg-color: #111111;
      --bg1-color: hsl(0, 0%, 10%);
      --bg2-color: hsl(0, 0%, 20%);
     
      --formBase-color: hsl(0, 0%, 3%);
      --formFocus-color: hsl(0, 0%, 6%);
      --formActive-color: hsl(0, 0%, 13%);
    }
  }
`;

export default GlobalStyle;