import Layout from "@/components/Layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
const fetcher = (url: any) => fetch(url).then((r: any) => r.json())
import Vibrant from 'node-vibrant'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import Head from "next/head";
import QueueList from "@/components/Spotify/QueueList";
import QueueList2 from "@/components/Spotify/QueueList2";

TimeAgo.addDefaultLocale(en)


export default function Spotify() {
  const { data: spotify, mutate, isLoading: loading } = useSWR("/api/spotify", fetcher)
  const [color, setColor] = useState("#FFFFFF")
  const [mutedColor, setMutedColor] = useState("#FFFFFF")
  const [lightMutedColor, setLightColor] = useState("#000000")
  const [open, setOpen] = useState<boolean>(false);
  const [lasthour, setLastHour] = useState<any>()
  const queue = spotify?.queue.length > 0 ? spotify?.queue : [];
  const timeAgo = new TimeAgo('en-US')

  const addSong = async () => {
    const inpt = prompt("Song name");
    if (!inpt) return alert("Não pude encontrar a música, pois você deixou em branco.");
    await fetch("/api/putSong?song=" + inpt, {
      method: 'post'
    });
  }

  useEffect(function () {
    if (document) {
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
    var lasthr = new Date();
    lasthr.setHours(lasthr.getHours() - 1)
    setLastHour(lasthr)
    mutate()
  }, [spotify ? spotify?.progress : spotify?.isPlaying])

  return (loading ? (
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden">
      <Head>
        <title>Igor is a dev | Loading</title>
      </Head>
      <div className="loading loading-spinner loading-lg" id="current"></div>
    </div>
  ) : (<Layout>
    <Head>
      <title>Igor is a dev | Spotify</title>
      <meta name="og:title" content="Igor is a dev | Spotify"></meta>
      <meta name="og:description" content={"Listening to " + spotify?.name}></meta>
    </Head>
    <div className="flex flex-col w-full bg-[#1b1b1b]" style={{
      'accentColor': color,
      backgroundColor: "#1b1b1b"
    }}>
      <div className={spotify?.isPlaying ? `p-5 w-full fixed z-[50] blur-3xl transition-all` : "p-5 w-full fixed z-[50] blur-3xl transition-all bg-[#1b1b1b]"} style={{ backgroundColor: `${color}` }}></div>
      <div className={spotify?.isPlaying ? `bottom-0 p-5 w-full fixed z-[50] transition-all blur-xl` : "bottom-0 p-5 w-full fixed z-[50] transition-all blur-xl"} style={{ backgroundColor: `#1b1b1b` }}></div>
      <div className={`w-full bg-[${mutedColor}]/10 backdrop-blur-xl p-4 fixed top-0 z-[60]`}><Image width="130" height="130" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"} /></div>
      <div className="w-full p-10"></div>
      <QueueList2
        queue={queue}
        timeAgo={timeAgo}
        open={open}
        setOpen={setOpen}
        spotify={spotify}
        lightMutedColor={lightMutedColor}
        mutedColor={mutedColor}
        addSong={addSong} />
    </div>
    <style jsx>{`
          * {
            /* overflow: hidden; */
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
