import { ThemeContext } from "@/contexts/ThemeContext"
import { useContext } from "react"

export const Comp = (function() {
  function P({children, className, ...args}: {children: any, className?: string}) {
    const theme = useContext(ThemeContext)
  
    return (
      <p style={{color: theme.textColor}} className={className} {...args}>{children}</p>
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
    P, A, Div, Div2
  }
})()