import Navbar from '@/components/navbar/navbar';
import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function test() {
  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  // TODO: Your React Element Starts here
  return (
    <ThemeContext.Provider value={theme}>
      <Navbar changeTheme={changeTheme} />
      <div className='main' style={{backgroundColor: theme.background}}>
        
      </div>
    </ThemeContext.Provider>
  )
}