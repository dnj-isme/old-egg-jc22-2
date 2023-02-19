import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';

export default function empty() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(sessionStorage.getItem('theme'))
    sessionStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    ShowNotification('info', 'In Progress', 'This Page is still in progress...')
  }, [])

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      // MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <div className='main' style={{backgroundColor: theme.background}}>
          {/* TODO: Your HTML code starts here */}
          
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}