import PrelineScript from "@/components/PrelineScript";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  
  return (
    <Html>
      <Head />
      <body className="h-screen w-full bg-slate-900 text-slate-100">
        <Main />
        <NextScript />
        <PrelineScript/>
      </body>
    </Html>
  );
}
