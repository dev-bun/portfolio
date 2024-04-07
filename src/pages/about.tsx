import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useLanyardWS, type Data } from 'use-lanyard';
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { withCoalescedInvoke } from "next/dist/lib/coalesced-function";
import { HSCarousel } from "preline";
import { FaBrazilianRealSign, FaDiscord, FaGithub, FaInstagram, FaSpotify, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6'
type Props = {
    // Add custom props here
}

const DISCORD_ID = "407859300527243275"

const About = function (_props: InferGetStaticPropsType<typeof getStaticProps>) {
    const data = useLanyardWS(DISCORD_ID);

    var [ ct, setCT ]= useState(0);
    var [ duration, setDuration ]= useState(0);
    useEffect(() => {
      const start = Number(data?.spotify?.timestamps.start)
      const end = Number(data?.spotify?.timestamps.end)
      setDuration(end - start);
      console.log(start, ct, end)
      setCT(Date.now())
      console.log("I love Alice ❤️")
    }, [data])
    const {t, i18n} = useTranslation(['about'])
    return (
        <>
        <div className="grid grid-cols-1 content-center md:grid-cols-2 gap-2 p-5 w-full">
            <div className="flex flex-col bg-blue-900 text-slate-100 p-3 rounded-xl" id="whoiam">
              <p className="text-2xl font-black">{t("title")}</p>
              <p className="ml-1">{t("description", {age: 15})}</p>
            </div>
            <div onClick={() => window.open(data?.listening_to_spotify?`https://open.spotify.com/track/${data.spotify?.track_id}?ref=igor.is-a.dev`:"https://open.spotify.com/playlist/2BbTZ0WHEf7nkq5kH9WmXU")} className="select-none hover:scale-[0.95] scale-1 transition-all hover:bg-[#1DB954]/50 col-span-1 flex flex-col bg-[#1DB954] text-slate-200 p-3 rounded-xl overflow-hidden text-ellipsis whitespace-nowrap">
              <div className="py-2"><Image width="100" height="100" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"}/></div>
              {data?.listening_to_spotify?(<div className="mt-1 pb-2 flex">
                <div key={data.spotify?.album}>
                  <AnimatePresence>
                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}>
                      <Image placeholder="blur" blurDataURL={"/loading.png"} className="rounded" width="100" height="100" alt="Song Cover" src={!data?.spotify?.album_art_url?"/loading.png":data?.spotify?.album_art_url}/>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="w-full flex flex-col px-2 justify-center truncate">
                  <p className="w-full text-xl font-black">{data?.spotify?.song}</p>
                  <p className="w-full font-medium">{data?.spotify?.artist}</p>
                  {/*<progress value={ct} max={duration} className="[&::-webkit-progress-bar]:rounded-lg h-2 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-green-700 [&::-moz-progress-bar]:bg-green-700"></progress>*/}
                </div>
              </div>):(<div className="mt-1 pb-2 flex">
                <div>
                  <Image alt="Metal, Caralho" src={"https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84b03a54b93b69f64684b8718e"} height="100" width="100"/>
                </div>
                <div className="w-full flex flex-col p-2 justify-center">
                  <p className="w-full text-xl font-black">Metal, Caralho</p>
                  <p className="w-full font-medium">igorwastaken; Alice Dalsasso</p>
                </div>
              </div>)}
            </div>
            <div className="text-2xl lg:text-4xl p-2 flex gap-2 rounded-xl bg-slate-800 self-start justify-center items-center">
              <button onClick={() => window.open("https://discord.com/users/407859300527243275")}><FaDiscord/></button>
              <button onClick={() => window.open("https://x.com/notigorwastaken")}><FaXTwitter/></button>
              <button onClick={() => window.open("https://youtube.com/@igorwastaken")}><FaYoutube/></button>
              <button onClick={() => window.open("https://github.com/igorwastaken")}><FaGithub/></button>
              <button onClick={() => window.open("https://instagram.com/a.igor.fig")}><FaInstagram/></button>
              <button onClick={() => window.open("https://open.spotify.com/user/z9q572lf0ytsndqyzb0m4giwj")}><FaSpotify/></button>
              <button onClick={() => window.open("tiktok.com/@notigorwastaken")}><FaTiktok/></button>
            </div>
            <div className="relative rounded-xl">
              <p className="[text-shadow:_0_4px_8px_rgb(0_0_0_/_40%)] absolute w-full p-3 text-xl font-black">{t("projects")}</p>
              <div className="w-full h-full carousel rounded-box">
                {/*<p className="absolute w-full p-3 text-xl font-black drop-shadow-xl">{t("projects")}</p>*/}
                <div onClick={() => window.open("https://igor.mom/")} className="carousel-item w-full h-full">
                  <Image className="w-full h-full" src={"/wtfl.png"} alt={"What The Floosh Game"} height={"356"} width={"356"}/>
                </div>
                <div onClick={() => alert("Projeto indisponível.")} className="carousel-item w-full h-full">
                  <Image className="w-full h-full" src={"/dogla.gif"} alt={"Server do Dogla"} height={"356"} width={"356"}/>
                </div>
                <div onClick={() => window.open("https://bruteone.com")} className="carousel-item w-full h-full">
                  <Image className="w-full h-full" src={"/bruteone.png"} alt={"BruteOne"} height="356" width="356"/>
                </div>
              </div>
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