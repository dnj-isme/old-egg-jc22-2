import { ThemeContext } from "@/contexts/ThemeContext"
import { MouseEvent, useContext } from "react"

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

export const Button = (function() {
  function Save({onClick} : {onClick : (e: MouseEvent) => any}) {
    return <button onClick={onClick}>Save</button>
  }

  function New({onClick} : {onClick : (e: MouseEvent) => any}) {
    return <button onClick={onClick}>New</button>
  }

  function Send({onClick} : {onClick : (e: MouseEvent) => any}) {
    return <button onClick={onClick}>Send</button>
  }
  
  function Edit({onClick} : {onClick : (e: MouseEvent) => any}) {
    return <button onClick={onClick}>Edit</button>
  }
  
  function Delete({onClick} : {onClick : (e: MouseEvent) => any}) {
    return <button onClick={onClick}>Delete</button>
  }
  
  function Cancel({onClick} : {onClick : (e: MouseEvent) => any}) {
    return <button onClick={onClick}>Cancel</button>
  }
  
  return {
    Save, New, Send, Edit, Delete, Cancel
  }
})()
