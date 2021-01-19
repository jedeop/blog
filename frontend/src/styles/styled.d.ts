import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    primary: string,
    primaryDark: string,
 
    fg: string,
    fg1: string,
    fg2: string,
    fg3: string,
 
    bg: string,
    bg1: string,
    bg2: string,
 
    formBase: string,
    formFocus: string,
    formActive: string,
  }
}