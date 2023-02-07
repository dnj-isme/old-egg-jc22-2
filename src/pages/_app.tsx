import '@/styles/globals.css'
import type { AppProps } from 'next/app'

declare global {
  var debug: boolean
}
global.debug = true

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
