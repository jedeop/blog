import { DefaultTheme } from "styled-components";

export const LightTheme: DefaultTheme = {
  primary:"#61CDB7",
  primaryDark: "#24B799",

  fg: "#000000",
  fg1: "hsl(0, 0%, 45%)",
  fg2: "hsl(0, 0%, 55%)",
  fg3: "hsl(0, 0%, 60%)",

  bg: "#FFFFFF",
  bg1: "hsl(0, 0%, 90%)",
  bg2: "hsl(0, 0%, 80%)",

  formBase: "hsl(0, 0%, 97%)",
  formFocus: "hsl(0, 0%, 94%)",
  formActive: "hsl(0, 0%, 87%)",
};
export const DarkTheme: DefaultTheme = {
  primary:"#54b1a0",
  primaryDark: "#399280",

  fg: "#FFFFFF",
  fg1: "hsl(0, 0%, 45%)",
  fg2: "hsl(0, 0%, 50%)",
  fg3: "hsl(0, 0%, 55%)",

  bg: "#111111",
  bg1: "hsl(0, 0%, 10%)",
  bg2: "hsl(0, 0%, 20%)",

  formBase: "hsl(0, 0%, 3%)",
  formFocus: "hsl(0, 0%, 6%)",
  formActive: "hsl(0, 0%, 13%)",
};