import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Sidebar from './sidebar';
import style from "./banner.module.scss"
import Carousel from './carousel/carousel';

export default function Banner() {
  const theme = useContext(ThemeContext) // For Theme

  return (
    <div className='element' style={{backgroundColor: theme.background}}>
      {/* TODO: Your HTML code starts here */}
      <Sidebar />
      <div>
        <Carousel />
      </div>
    </div>
  )
}