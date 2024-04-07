import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useLanyardWS, type Data } from 'use-lanyard';
import { useEffect, useState } from "react";
import { start } from "repl";
import { AnimatePresence, motion } from 'framer-motion'
type Props = {
    // Add custom props here
}

const DISCORD_ID = "407859300527243275"

const About = function (_props: InferGetStaticPropsType<typeof getStaticProps>) {
    const data = useLanyardWS(DISCORD_ID);

    var [ct, setCT]= useState(0);
    var [duration, setDuration ]= useState(0);
    useEffect(() => {
      const start = Number(data?.spotify?.timestamps.start)
      const end = Number(data?.spotify?.timestamps.end)
      setDuration(end - start);
      console.log(start, ct, end)
      setCT(Date.now())
    }, [data])
    const {t, i18n} = useTranslation(['about'])
    return (
        <>
        <div className="grid grid-cols-1 justify-center md:grid-cols-2 gap-4 p-5">
            <div className="flex flex-col bg-blue-900 text-slate-100 p-3 rounded-xl" id="whoiam">
              <p className="text-2xl font-black">{t("title")}</p>
              <p className="ml-2">{t("description", {age: 15})}</p>
            </div>
            <div className="col-span-1 flex flex-col bg-[#1DB954] text-slate-200 p-3 rounded-xl overflow-hidden text-ellipsis whitespace-nowrap">
              <div className="py-2"><Image width="100" height="100" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"}/></div>
              {data?.listening_to_spotify?(<div className="mt-1 pb-2 flex">
                <AnimatePresence>
                  <div className="" key={data?.spotify?.album}>
                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}>
                      <Image placeholder="blur" blurDataURL="/loading.png" className="rounded" width="100" height="100" alt="Song Cover" src={!data?.spotify?.album_art_url?"/loading.png":data?.spotify?.album_art_url}/>
                    </motion.div>
                  </div>
                </AnimatePresence>
                <div className="w-full flex flex-col px-2 justify-center truncate">
                  <p className="w-full text-xl font-black">{data?.spotify?.song}</p>
                  <p className="w-full text-md font-medium">{data?.spotify?.artist}</p>
                  {/*<progress value={ct} max={duration} className="[&::-webkit-progress-bar]:rounded-lg h-2 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-green-700 [&::-moz-progress-bar]:bg-green-700"></progress>*/}
                </div>
              </div>):(<div className="mt-1 pb-2 flex"></div>)}
            </div>
        </div>
        </>
    )
}

export const getStaticProps: GetStaticProps<Props> = async ({
    locale,
  }) => ({
    props: {
      ...(await serverSideTranslations(locale ?? 'pt', [
        'about',
      ])),
    },
})

export default About;