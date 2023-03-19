import { createContext } from "react"

export type ThemeType = {
  button: string,
  className: "light" | "dark",
  navbar: string,
  background: string,
  background2: string,
  textColor: string,
  cardBG: string,
  border: string,
  footer: string,
  sidebar: string
}

export const Theme:{LIGHT: ThemeType, DARK: ThemeType} = {
  LIGHT: {
    className: "light",
    navbar: "white",
    background: "white",
    background2: "whitesmoke",
    textColor: "#212121",
    cardBG: "#ECF1FF",
    border: "transparent",
    button: "#FFF",
    footer: "#0A185C",
    sidebar: "#F2B179",
  },
  DARK: {
    className: "dark",
    navbar: "#050C2E",
    background: "#212121",
    background2: "#121212",
    textColor: "white",
    cardBG: "#282828",
    border: "whitesmoke",
    button: "#363636",
    footer: "#121212",
    sidebar: "#404040",
  },
}

export function getTheme(text: string | null) : ThemeType{
  if(text === null) return DEFAULT_THEME
  console.log(text);
  switch(text) {
    case Theme.LIGHT.className:
      return Theme.LIGHT
    case Theme.DARK.className:
      return Theme.DARK
    default:
      return DEFAULT_THEME
  }
}

export const DEFAULT_THEME = Theme.LIGHT

export const ThemeContext = createContext(DEFAULT_THEME)


