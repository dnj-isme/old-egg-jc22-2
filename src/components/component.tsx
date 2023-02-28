import { ThemeContext } from "@/contexts/ThemeContext"
import { MouseEvent, useContext } from "react"
import btn_style from "./button-component.module.scss"

export const Comp = (function() {
  function P({children, className, ...args}: {children: any, className?: string}) {
    const theme = useContext(ThemeContext)
  
    return (
      <p style={{color: theme.textColor}} className={className} {...args}>{children}</p>
    )
  }
  function H1({children, className, ...args}: {children: any, className?: string}) {
    const theme = useContext(ThemeContext)
  
    return (
      <h1 style={{color: theme.textColor}} className={className} {...args}>{children}</h1>
    )
  }

  function A({children, href, className, ...args}: {children: any, href: string, className?: string}) {
    const theme = useContext(ThemeContext)
  
    return (
      <a style={{color: theme.textColor}} className={className} href={href} {...args}>{children}</a>
    )
  }

  function Div({children, className, ...args}: {children:any, className?: string}) {
    const theme = useContext(ThemeContext)
  
    return (
      <div className={className} style={{backgroundColor: theme.background}} {...args}>{children}</div>
    )
  }

  function Div2({children, className, ...args}: {children:any, className?: string}) {
    const theme = useContext(ThemeContext)
  
    return (
      <div className={className} style={{backgroundColor: theme.background2}} {...args}>{children}</div>
    )
  }

  return {
    P, A, Div, Div2, H1
  }
})()

export interface ButtonParams {
  onClick? : (e: MouseEvent) => any,
  children: null | JSX.Element | JSX.Element[] | string
}

export const Button = {
  Save: ({onClick} : {onClick : (e: MouseEvent) => any}) => {
    return <button className={btn_style.save} onClick={onClick}>Save</button>
  },
  
  New: ({onClick} : {onClick : (e: MouseEvent) => any}) => {
    return <button className={btn_style.new} onClick={onClick}>New</button>
  },

  Send: ({onClick} : {onClick : (e: MouseEvent) => any}) => {
    return <button className={btn_style.send} onClick={onClick}>Send</button>
  },

  Edit: ({onClick} : {onClick : (e: MouseEvent) => any}) => {
    return <button className={btn_style.edit} onClick={onClick}>Edit</button>
  },

  Delete: ({onClick} : {onClick : (e: MouseEvent) => any}) => {
    return <button className={btn_style.delete} onClick={onClick}>Delete</button>
  },

  Cancel: ({onClick} : {onClick : (e: MouseEvent) => any}) => {
    return <button className={btn_style.cancel} onClick={onClick}>Cancel</button>
  },
  
  Submit: (params: ButtonParams) => {
    return <button className={btn_style.blue} type="submit" onClick={params.onClick}>{params.children}</button>
  },
  
  Green: (params: ButtonParams) => {
    return <button className={btn_style.green} onClick={params.onClick}>{params.children}</button>
  },
  
  Yellow: (params: ButtonParams) => {
    return <button className={btn_style.yellow} onClick={params.onClick}>{params.children}</button>
  },
  
  Red: (params: ButtonParams) => {
    return <button className={btn_style.red} onClick={params.onClick}>{params.children}</button>
  },
  
  Blue: (params: ButtonParams) => {
    return <button className={btn_style.blue} onClick={params.onClick}>{params.children}</button>
  }
}