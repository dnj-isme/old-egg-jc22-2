import { useEffect, useRef, useState } from 'react';

import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';

import style from "./carousel.module.scss"
import { Banner } from '@/model/banner';

export default function Carousel() {

  const [links, setLinks] = useState<Banner[]>([])
  const [position, setPosition] = useState(1);

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval)
  }, [position, links])

  async function getData() {
    const res = await From.Graphql.execute(SampleQuery.banner);
    let l:Banner[] = [];
    if(res.success) {
      const data = res.data
      data.forEach((img:Banner) => {
        l.push(img)
      })
      console.log(l);

      setLinks(l)
    }
  }
  const next = () => {
    if(links.length == 0) {
      return
    }
    const len = links.length;
    let target = position;
    for(let i = 0; i < len; i++) {
      const temp = (target + 1 + i + len) % len;
      console.log(links[temp].status);
      if(links[temp].status == "active") {
        target = temp;
        break;
      }
    }
    console.log(target);
    setPosition(target);
  }

  const prev = () => {
    if(links.length == 0) {
      return
    }
    const len = links.length;
    let target = position;
    for(let i = 0; i < len; i++) {
      const temp = (target + i + 1 + len) % len;
      if(links[temp].status == "active") {
        target = temp;
        break;
      }
    }
    setPosition(target);
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