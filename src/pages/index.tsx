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
import { FaBrazilianRealSign, FaDiscord, FaGithub, FaInstagram, FaSpotify, FaTiktok, FaXTwitter, FaYoutube, FaJs, FaNodeJs, FaHtml5, FaReact, FaCss3 } from 'react-icons/fa6'
import { SiKotlin, SiTypescript, SiJavascript, SiNextdotjs, SiReact, SiHtml5, SiCsharp, SiCss3, SiNpm, SiTailwindcss } from "react-icons/si";
import { setDefaultAutoSelectFamily } from "net";
import useSWR from "swr";
type Props = {
    // Add custom props here
}
import prettyMS from 'pretty-ms';
import Layout from "@/components/Layout";

const fetcher = (url: any) => fetch(url).then((r:any) => r.json())

const DISCORD_ID = "407859300527243275"

const About = function (_props: InferGetStaticPropsType<typeof getStaticProps>) {
    const data = useLanyardWS(DISCORD_ID);
    var [ ct, setCT ]= useState<any>(0);
    var [ duration, setDuration ]= useState<any>(0);
    var [ current, setCurrent ] = useState<any>("00:00");
    var [ durationM, setDurationM ] = useState<any>("00:00")
    const router = useRouter()
    const { data: spotify } = useSWR("/api/spotify", fetcher, {  refreshInterval: 1000 })
    const statuses = {
      online: "badge-success",
      offline: "badge-neutral",
      dnd: "badge-error",
      idle: "badge-warning"
    }
    const dcStatus = data?.discord_status;
    const status = ""

    const {t, i18n} = useTranslation(['about'])
    return (
        <Layout>
        <div className="grid grid-cols-1 content-center md:grid-cols-2 gap-2 p-5 w-full">
            <div className="flex flex-col bg-blue-900 text-slate-100 p-3 rounded-xl" id="whoiam">
              <p className="text-2xl font-black">{t("title")}</p>
              <p className="ml-1">{t("description", {age: 15})}</p>
            </div>
            <div onClick={() => router.push("/spotify")} className="select-none hover:scale-[0.95] scale-1 transition-all hover:bg-[#1DB954]/50 col-span-1 flex flex-col bg-[#1DB954] text-slate-200 p-3 rounded-xl overflow-hidden text-ellipsis whitespace-nowrap">
              <div className="py-2"><Image width="100" height="100" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"}/></div>
              {spotify?.isPlaying?(<div className="mt-1 pb-2 flex">
                <div key={spotify?.album}>
                  <AnimatePresence>
                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}>
                        <div>
                         <Image placeholder="blur" blurDataURL={"/loading.png"} className="rounded" width="100" height="100" alt="Song Cover" src={!spotify?.albumImageUrl?"/loading.png":spotify?.albumImageUrl}/>
                         {/*<Image placeholder="blur" blurDataURL={"/loading.png"} className="absolute rounded" width="100" height="100" alt="Song Cover" src={!data?.spotify?.album_art_url?"/loading.png":data?.spotify?.album_art_url}/>*/}
                        </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="w-full flex flex-col px-2 justify-center truncate">
                  <p className="w-full text-xl font-black">{spotify?.title}</p>
                  <p className="w-full font-medium">{spotify?.artist}</p>
                  <progress value={spotify?.progress} max={spotify?.duration} className="w-full [&::-webkit-progress-bar]:rounded-lg h-2 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-webkit-progress-value]:bg-green-700 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 [&::-moz-progress-bar]:bg-green-700"></progress>
                  <div className="flex justify-between"><p className="font-bold">{prettyMS(spotify?.progress, {colonNotation: true, secondsDecimalDigits: 0})}</p><p className="font-bold">{prettyMS(spotify?.duration, {colonNotation: true, secondsDecimalDigits: 0})}</p></div>
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
            <div className="text-2xl lg:text-4xl p-1 flex gap-2 rounded-xl bg-slate-800 self-start justify-center items-center">
              <p className="tooltip" data-tip="100%">🇵🇹</p>
              <p className="tooltip" data-tip="100%"><SiJavascript/></p>
              <p className="tooltip" data-tip="100%"><SiTypescript/></p>
              <p className="tooltip" data-tip="100%"><SiHtml5/></p>
              <p className="tooltip" data-tip="100%"><SiTailwindcss/></p>
              <p className="tooltip" data-tip="90%"><SiReact/></p>
              <p className="tooltip" data-tip="90%"><SiNextdotjs/></p>
              <p className="tooltip" data-tip="30%"><SiKotlin/></p>
              {/*<p className="tooltip" data-tip="5%"><SiCsharp/></p>*/}
              <p className="tooltip" data-tip="1%">🇬🇧</p>
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
            <div className="select-none transition-all col-span-1 flex flex-col bg-[#5865F2] text-slate-200 p-3 rounded-xl overflow-hidden text-ellipsis whitespace-nowrap">
              <div className="py-2"><Image width="110" height="110" alt="Discord Logo" src={"https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0b544a3e3c7c05753bcd_full_logo_white_RGB.png"}/></div>
              <div className="flex gap-2">
                <div className="justify-center items-center relative">
                  <Image className="z-[10] scale-[1.2] absolute w-24" width="100" height="100" alt="De" src={`https://cdn.discordapp.com/avatar-decoration-presets/${data?.discord_user.avatar_decoration_data?.asset}?size=4096`}/>
                  <div className="scale-[1]">
                    <div className="right-3 bottom-0 absolute flex gap-2 text-center items-center"><span className={`badge badge-sm ${status} transition-all`}></span></div>
                    <Image className="w-24 rounded-full" width="100" height="100" alt="Me" src={`https://cdn.discordapp.com/avatars/${data?.discord_user.id}/${data?.discord_user.avatar}?size=4096`}/>
                  </div>
                </div>
                <div className="h-full flex flex-col justify-center hover:cursor-pointer">
                  <span className="flex gap-2 ">
                    <p className="text-xl font-black">{data?.discord_user.username}</p>
                  </span>
                  <p className="opacity-[0.8]">{data?.activities[0] && data?.activities[0].type===4?data.activities[0].state:""}</p>
                </div>
              </div>
            </div>
        </div>
        </Layout>
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
