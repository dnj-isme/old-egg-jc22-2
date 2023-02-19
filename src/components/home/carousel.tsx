import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper';
import BannerImage from './banner_image';

import { v4 } from 'uuid'
import { From } from '@/database/api';

export default function Carousel() {

  const [links, setLinks] = useState<string[]>([])

  useEffect(() => {effect()}, [])

  async function effect() {
    From.Graphql.execute()
  }

  const progressCircle = useRef<SVGSVGElement>(null);
  const progressContent = useRef<HTMLSpanElement>(null);
  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if(progressCircle.current != null && progressContent.current != null) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress));
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };
  return (
    <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        {
          links.map(link => {
            return <SwiperSlide key={v4()}><BannerImage src={link} /></SwiperSlide>
          })
        }
        <div className="autoplay-progress" slot="container-end">
          <span ref={progressContent} />
        </div>
      </Swiper>
  )
}