import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Banner } from '@/model/banner';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import BannerRow from './banner_row';

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
    <div className='component' style={{backgroundColor: theme.background}}>
      {/* TODO: Your HTML code starts here */}
      <table>
        <thead>
          <tr>
            <td>No</td>
            <td>Label</td>
            <td>Image Source</td>
            <td>Destination Link</td>
            <td>Status</td>
            <td>Action</td>
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