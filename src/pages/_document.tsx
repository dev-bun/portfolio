import PrelineScript from "@/components/PrelineScript";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {

  return (
    <Html>
      <Head />
      <body className="w-full bg-[#1b1b1b] text-slate-100">
        <Main />
        <NextScript />
        <PrelineScript />
      </body>
    </Html>
  );
}
