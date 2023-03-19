import { Icon } from "@iconify/react"

export function GetStars(rating: number) {
  var output: JSX.Element[] = []
  
  for(let i = 0; i < 5; i++) {
    // kondisi 1, rating > i + 1
    if(rating >= i + 1) {
      output.push(<Icon icon="dashicons:star-filled" className='star'/>)
    }
    else if(rating >= i + 0.5) {
      output.push(<Icon icon="dashicons:star-half" className='star'/>)
    }
    else {
      output.push(<Icon icon="dashicons:star-empty" className='star'/>)
    }
  }
  return output
}