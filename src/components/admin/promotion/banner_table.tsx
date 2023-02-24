import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Banner } from '@/model/banner';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import BannerRow from './banner_row';
import style from "./banner.module.scss"

export default function BannerList() {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  
  // TODO: Put UseState Stuff here
  const [banners, setBanners] = useState<Banner[]>([])

  // TODO: Put UseEffect Stuff Here
  useEffect(() => {effect()}, [])

  async function effect() {
    const res = await From.Graphql.execute(SampleQuery.banner)
    if(res.success) {
      console.log(res.data);
      setBanners(res.data);
    }
    else {
      ShowNotification("danger", "Failed", "Fetching data failed")
      ShowNotification("danger", "Error " + res.status, res.data)
    }
  } 

  // TODO: Put Your Custom Logic here

  // TODO: Your React Element starts here...
  return (
    <div className={style["component"]} style={{backgroundColor: theme.background}}>
      {/* TODO: Your HTML code starts here */}
      <table className={style["table-container"]}>
        <thead>
          <tr>
            <td className={style["table-1"]} style={{color: theme.textColor}}>No</td>
            <td className={style["table-2"]} style={{color: theme.textColor}}>Label</td>
            <td className={style["table-3"]} style={{color: theme.textColor}}>Image Source</td>
            <td className={style["table-4"]} style={{color: theme.textColor}}>Destination Link</td>
            <td className={style["table-5"]} style={{color: theme.textColor}}>Status</td>
            <td className={style["table-6"]} style={{color: theme.textColor}}>Action</td>
          </tr>
        </thead>
        <tbody>
          {banners.map((data, idx) => (
            <BannerRow data={data} idx={idx} />           
          ))}
        </tbody>
      </table>
    </div>
  )
}