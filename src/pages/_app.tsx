import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from 'next-i18next'

const app = function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

appWithTranslation(app)