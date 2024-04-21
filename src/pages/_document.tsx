import PrelineScript from "@/components/PrelineScript";
import Transition from "@/components/Transition";
import { Html, Head, Main, NextScript } from "next/document";
import type { Metadata } from "next"
/*export const metadata: Metadata = {
  title: "Igor is a dev",
  description: "Oi, eu sou Igor, veja meu site aí"
}
*/
export default function Document() {

  return (
    <Html>
      <Head />
      <body className="w-full bg-[#1b1b1b] text-white">
        <Main />
        <NextScript />
        <PrelineScript />
      </body>
    </Html>
  );
}
