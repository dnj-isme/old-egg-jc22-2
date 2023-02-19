import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Sidebar from './sidebar';
import style from "./banner.module.scss"
import BannerImage from './banner_image';
import Carousel from './carousel';

export default function Banner() {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating
  
  // TODO: Put UseState Stuff here

  // TODO: Put UseEffect Stuff Here
  useEffect(() => {effect()}, [])

  function effect() {

  }

  // TODO: Put Your Custom Logic here
  function test() {
    return 'In Progres...'
  }

  // TODO: Your React Element starts here...
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