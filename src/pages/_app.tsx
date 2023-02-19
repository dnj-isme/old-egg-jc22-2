import '@/styles/globals.css'
import '@/styles/template.css'
import '@/../node_modules/react-notifications-component/dist/theme.css'
import type { AppProps } from 'next/app'

declare global {
  var debug: boolean
  var signin: boolean
  var logout: boolean
  var unauthorized: boolean
  var register: boolean
}
global.debug = true
global.signin = false
global.unauthorized = false
global.logout = false
global.register = false

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
