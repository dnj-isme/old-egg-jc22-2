
import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import style from "./banner.module.scss"
import {SwiperSlide} from 'swiper/react'

export default function BannerImage({src, link}: {src: string, link?: string}) {
  if(link != undefined) 

  return (
    <SwiperSlide>
      <a href={link}>
        <img src={src} className={style.img}></img>
      </a>
    </SwiperSlide>
  )
  
  else return (
    <SwiperSlide>
      <img src={src} className={style.img}></img>
    </SwiperSlide>
  ) 
}