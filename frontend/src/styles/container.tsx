import { css } from "styled-components";

const Container = css`
  margin: auto;
  width: 90%;
  @media screen and (min-width: 768px) {
    width: 80%;
  }
  @media screen and (min-width: 1024px) {
    width: 800px;
  }
`;

export default Container;