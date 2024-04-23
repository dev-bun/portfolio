import Layout from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import prettyMilliseconds from "pretty-ms";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from 'react-icons/fa6'
import useSWR from "swr";
const fetcher = (url: any) => fetch(url).then((r: any) => r.json())
import Vibrant from 'node-vibrant'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { Metadata, ResolvingMetadata } from "next";

TimeAgo.addDefaultLocale(en)

// const timeAgo = new TimeAgo('en-US')
/*xport const metadata = {
  title: "Spotify",
  description: "Veja o que eu estou ouvindo, e adicione uma música para eu ouvir!"
}*/

type Props = {
  params: { id: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  
  const { title, artist, album, albumImageUrl  } = await fetch("https://igor.is-a.dev/api/spotify").then(res => res.json())
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: "Igor is a dev - Spotify",
    description: "Listening to " + title + " - " + artist,
    openGraph: {
      title: "Igor is a dev - Spotify",
      description: "Listening to " + title + " - " + artist,
      images: [albumImageUrl, ...previousImages],
    },
  }
}

const keys = [
  "idk",
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B"
]
const mode = {
  0: "Major",
  1: "Minor"
}
export default function Spotify() {
  const { data: spotify, mutate, isLoading: loading } = useSWR("/api/spotify", fetcher)
  const [color, setColor] = useState("#FFFFFF")
  const [mutedColor, setMutedColor] = useState("#FFFFFF")
  const [lightMutedColor, setLightColor] = useState("#000000")
  const [previewPlaying, setPreviewPlaying] = useState<boolean>(false)
  const [ open, setOpen ] = useState<boolean>(false);
  const player = useRef<any>()
  const queue = spotify?.queue
  const timeAgo = new TimeAgo('en-US')
  const percentage = (num:number) => {
    if(spotify?.artist.includes("Taylor Swift")) return 0;
    return Number((num / 1) * 100)
  }
  const previewPlay = async () => {
    if (!player.current) return;
    if (player.current.paused) {
      player.current.play()
      setPreviewPlaying(true)
    } else {
      player.current.pause();
      player.current.currentTime = 0;
      setPreviewPlaying(false);
    }
  }
  const addSong = async () => {
    const inpt = prompt("Song name");
    if (!inpt) return alert("Não pude encontrar a música, pois você deixou em branco.");
    await fetch("/api/putSong?song=" + inpt, {
      method: 'post'
    })
    //  alert("Desativado temporariamente: Provavelmente vou ativar novamente em breve...")
  }
  useEffect(function () {
    /*if(window) {
      window.scrollTo(0,0)
    }*/
    if(document) {
      document.getElementById("current")?.scrollIntoView({ inline: "center", block: "center", behavior: "smooth" })
    }
    async function getCol() {
      if (spotify?.isPlaying) {
        const col = await Vibrant.from(spotify?.albumImageUrl).getPalette();

        setColor(col.Muted?.hex.toString() as string)
        setMutedColor(col.DarkMuted?.getHex().toString() as string);
        setLightColor(col.LightMuted?.getHex().toString() as string)
      }
    }
    getCol()
  }, [spotify])
  
  useEffect(function () {
    /*const intervalId = setInterval(() => mutate(), 1000)
    return () => clearInterval(intervalId);*/
    mutate()
  }, [spotify ? spotify.progress : spotify])

  /*if(loading) return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  )*/

  return (loading?(
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden">
      <div className="loading loading-spinner loading-lg" id="current"></div>
    </div>
  ):(<Layout>
    <div className="overflow-hidden h-screen flex flex-col w-full bg-[#1b1b1b]" style={{
      'accentColor': color,
      // overflow: 'hidden',
      backgroundColor: "#1b1b1b"
    }}>
      <div className={spotify?.isPlaying ? `p-5 w-full fixed z-[50] blur-3xl transition-all` : "p-5 w-full fixed z-[50] blur-3xl transition-all bg-[#1b1b1b]"} style={{ backgroundColor: `${color}` }}></div>
      <div className={spotify?.isPlaying ? `bottom-0 p-5 w-full fixed z-[50] transition-all blur-xl` : "bottom-0 p-5 w-full fixed z-[50] transition-all blur-xl"} style={{ backgroundColor: `#1b1b1b` }}></div>
      <div className={`w-full bg-[${mutedColor}]/10 backdrop-blur-xl p-4 fixed top-0 z-[60]`}><Image width="130" height="130" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"} /></div>
      <div className="w-full p-4"></div>
      <AnimatePresence mode="sync">
        {spotify?.isPlaying ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full overflow-hidden flex flex-col mt-1 p-2">
          {/*<div className="sticky z-[40]">
            <div className="flex p-3">
              <div key={spotify?.album}>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <div className="">
                      <Image placeholder="blur" blurDataURL={"/loading.png"} className="rounded" width="150" height="150" alt="Song Cover" src={spotify?.albumImageUrl} />
                      {/*<Image placeholder="blur" blurDataURL={"/loading.png"} className="absolute blur-xl rounded" width="150" height="150" alt="Song Cover" src={spotify?.albumImageUrl}/>}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="w-full flex flex-col px-2 justify-center truncate">
                <p className="w-full text-xl font-black">{spotify?.title}</p>
                <p className="w-full font-medium">{spotify?.artist}</p>
                <p className="w-full text-sm font-regular">{spotify?.album}</p>
                <progress value={spotify?.progress} max={spotify?.duration} className={`w-full [&::-webkit-progress-bar]:rounded-lg h-2 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-webkit-progress-value]:bg-[${color}] [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 [&::-moz-progress-bar]:bg-[${color}]`}></progress>
                <div className="flex justify-between"><p className="font-bold">{prettyMilliseconds(spotify?.progress, { colonNotation: true, secondsDecimalDigits: 0 })}</p><p className="font-bold">{prettyMilliseconds(spotify?.duration, { colonNotation: true, secondsDecimalDigits: 0 })}</p></div>
                {/*spotify?.preview?(<>
                    <audio src={spotify?.preview} ref={player}></audio>
                    {player.current?(<div className="flex text-sm" onClick={previewPlay}>
                      <div className="radial-progress" style={{ "--value": Math.floor((player.current.currentTime/player.current.duration)*100).toFixed(), "--size": "2rem", color: lightMutedColor }} role="progressbar">
                        {player.current.paused?(<FaPlay/>):(<FaPause/>)}
                      </div>
                    </div>):(<div></div>)}
                  </>):(<></>)}
              </div>
            </div>
                </div>*/}
          <AnimatePresence>
          {open&&(
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`bg-[#1b1b1b]/75 transition-all p-3 z-[55] fixed w-full h-screen backdrop-blur-lg`}>
              <div onClick={() => setOpen(false)} className="p-4 flex w-full justify-end items-center"><p className="text-xl font-black">X</p></div>
              <div className="flex items-center gap-x-2">
                <Image width="100" height="100" src={spotify?.albumImageUrl} alt="Album Cover" className="rounded"/>
                <div className="flex flex-col justify-center p-2">
                  <p className="text-xl font-black">{spotify?.title}</p>
                  <p className="font-medium">{spotify.artist}</p>
                  <div className="badge badge-accent">{Number(spotify?.info.tempo).toFixed()} bpm</div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xl font-bold">Song Info</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2">
                  <div className="flex flex-col justify-center items-center text-center p-3">
                    <p className="text-lg font-bold">Key</p>
                    <p className="text-xl font-black">{keys[spotify?.info.key+1]}</p>
                  </div>
                  <div className="flex flex-col justify-center items-center text-center p-3">
                    <p className="text-lg font-bold">Energy</p>
                    <p className="text-xl font-black">{percentage(spotify?.info.energy).toFixed()}%</p>
                  </div>
                  <div className="flex flex-col justify-center items-center text-center p-3">
                    <p className="text-lg font-bold">Danceability</p>
                    <p className="text-xl font-black">{percentage(spotify?.info.danceability).toFixed()}%</p>
                  </div>
                  <div className="flex flex-col justify-center items-center text-center p-3">
                    <p className="text-lg font-bold">Loudness</p>
                    <p className="text-xl font-black">{Math.floor(spotify?.info.loudness).toFixed()}db</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          <motion.ul layoutScroll className="flex flex-col w-full h-screen bg-[#1b1b1b] overflow-hidden scroll-smooth justify-center items-center">
            <div className="fixed top-0 z-[60] p-3 flex items-center justify-end w-full">
              {/*<p className="text-xl font-black">Queue</p>*/}
              <button className="m-2 rounded-xl py-1 px-2 bg-green-900 text-xl font-black text-center hover:opacity-[0.5] transition-all" style={{ backgroundColor: mutedColor, color: lightMutedColor }} onClick={addSong}>+</button>
            </div>
            {/*<div className="pt-20"></div>*/}
            <AnimatePresence mode="sync" initial={true}>
              {queue.map((q: any) => (
                <motion.li
                  layout
                  initial={{ opacity: 0.5 }}
                  animate={q?.current?{ opacity: 1 }:{ opacity: 0.5 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ type: "tween", layout: { }, duration: 1, delay: 0.5 }}
                 // onTransitionEndCapture={() => { document.getElementById("current")?.scrollIntoView({ inline: 'center', block: 'center', behavior: 'smooth' }) }}
                  className="justify-center items-center flex p-2 mt-1 w-full backdrop-blur-lg rounded-2xl"
                  key={q?.title}
                  id={q?.current?"current":""}
                >
                  <div key={q?.album}>
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}>
                        <div className="">
                          <Image placeholder="blur" blurDataURL={"/loading.png"} className="z-10 rounded" width="100" height="100" alt="Song Cover" src={q?.albumImageUrl} />
                          {/*<Image placeholder="blur" blurDataURL={"/loading.png"} className="blur-xl rounded" width="100" height="100" alt="Song Cover" src={q?.albumImageUrl}/>*/}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div onClick={() => { q.current?setOpen(true):setOpen(false); }} className={q?.current?"drop-shadow-xl px-2 flex flex-col justify-center w-full truncate cursor-pointer":"drop-shadow-xl px-2 flex flex-col justify-center w-full truncate"}>
                    <p className="w-full text-lg font-black">{q?.title}</p>
                    <p className="w-full text-md font-medium">{q?.artist}</p>
                    <AnimatePresence mode="sync">
                        {q.current && (<motion.div key={q?.current} transition={{ duration: 0.5 }} initial={{ height: 0, width: "0%", opacity: 0 }} animate={{ height: "50%", width: "100%", opacity: 1 }} exit={{ height: 0, width: "0%", opacity: 0 }}>
                          <progress value={spotify?.progress} max={spotify?.duration} className={`w-full [&::-webkit-progress-bar]:rounded-lg h-2 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-webkit-progress-value]:bg-slate-900 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 [&::-moz-progress-bar]:bg-slate-100`}></progress>
                          <div className="flex justify-between"><p className="font-bold">{prettyMilliseconds(spotify?.progress, { colonNotation: true, secondsDecimalDigits: 0 })}</p><p className="font-bold">{prettyMilliseconds(spotify?.duration, { colonNotation: true, secondsDecimalDigits: 0 })}</p></div>
                        </motion.div>)}
                        {!q?.current && q?.playedAt>1&& (
                          <motion.div>
                            <p className="w-full text-sm font-regular text-left">{q?.current?"Playing since":"Played"} {timeAgo?.format(q?.playedAt)}</p>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </motion.div>
      ) : (
        <motion.div initial={{opacity: 0}} animate={{ opacity: 1 }} exit={{ opacity:0 }} id="current" className="w-full h-screen flex flex-col text-center items-center justify-center overflow-hidden">
          <p className="text-2xl font-black">Nothing Playing</p>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
    <style jsx>{`
          * {
            overflow: hidden;
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
          }
          progress::-webkit-progress-value {
            background-color: ${lightMutedColor};
          }
          progress::-webkit-progress-bar {
            background-color: ${mutedColor};
          }
          ::-webkit-progress-value {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
          }
          ::-moz-selection {
            background-color: ${lightMutedColor};
            color: ${mutedColor};
          }
          ::selection {
            background-color: ${lightMutedColor};
            color: ${mutedColor};
          }
        `}</style>
  </Layout>))
}
