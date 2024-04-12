import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from 'next-i18next'
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const app = function App({ Component, pageProps, router }: AppProps) {
 // const router = useRouter()
  return (<AnimatePresence mode="wait" initial={false}>
     <Component {...pageProps} key={router.asPath}/>
  </AnimatePresence>)
}

export default appWithTranslation(app)