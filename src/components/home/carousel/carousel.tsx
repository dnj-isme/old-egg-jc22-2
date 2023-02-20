import { useEffect, useRef, useState } from 'react';

import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';

import style from "./carousel.module.scss"
import { Banner } from '@/model/banner';

export default function Carousel() {

  const [links, setLinks] = useState<Banner[]>([])
  const [position, setPosition] = useState(1);

  useEffect(() => {
    let res: any;
    effect()
    .then(output => res = output)
    return res
  }, [])

  async function effect() {
    const res = await From.Graphql.execute(SampleQuery.banner);
    let l:Banner[] = [];
    if(res.success) {
      const data = res.data
      data.forEach((img:Banner) => {
        l.push(img)
      })
      setLinks(l)
    }
    const intervalId = setInterval(() => {
      console.log(l.length);
      next(l.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }
  const next = (len: number) => {
    let length = links.length
    if(length == 0) {
      length = len
    }
    setPosition((position + 1) % length);
  };

  const prev = () => {
    if(links.length == 0) {
      return
    }
    setPosition((position - 1 + links.length) % links.length);
  }; 

  return (
    <div className={style.carousel}>
      {links.map(link => (
        <div
          key={link.id}
          
          className={
            links[position].id === link.id ? style.fade : `${style.slide} ${style.fade}`
          }>
        {
          link.link == undefined || link.link == '' ?
          <img src={link.src} alt="banner" className={style.photo} />
          :
          <a href={link.link} target="_blank">
            <img src={link.src} alt="banner" className={style.photo} />
          </a>
        }
        </div>
      ))}

      {/* <button onClick={prev} className={style.prev}>
        &lt;
      </button> */}

      {/* Next button */}
      {/* <button onClick={_ => next(links.length)} className={style.next}>
        &gt;
      </button> */}
    </div>
  )
}