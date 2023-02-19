import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Comp } from '../component';
import style from "./sidebar.module.scss"

import { Icon } from '@iconify/react';

export default function Sidebar() {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating
  
  // TODO: Put UseState Stuff here
  const [stuff, setStuff] = useState()

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
    <Comp.Div2 className={style.sidebar}>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Components & Storage</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Computer Systems</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Computer Peripherals</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Appliances</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>TV & Home Theater</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Electronics</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Gaming & VR</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Networking</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Smart Home & Security</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Office Solutions</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Software & Services</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Automotive & Tools</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Home & Outdoors</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
      <a style={{color: theme.textColor}} href="#">
        <div>
          <Comp.P>Health & Sports</Comp.P>
          <Icon icon="material-symbols:chevron-right-sharp" />
        </div>
      </a>
    </Comp.Div2>
  )
}