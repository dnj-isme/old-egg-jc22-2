import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';
import Sidebar from './sidebar';
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