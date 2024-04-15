import Layout from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import prettyMilliseconds from "pretty-ms";
import { useEffect, useState } from "react";
import useSWR from "swr";
const fetcher = (url: any) => fetch(url).then((r:any) => r.json())
import Vibrant from 'node-vibrant'

export default function Spotify() {
    const { data: spotify } = useSWR("/api/spotify", fetcher, { refreshInterval: 100 })
    const [ color, setColor ] = useState("#FFFFFF")
    const addSong = async () => {
      const inpt = prompt("Song name");
      if(!inpt) return alert("Não pude encontrar a música, pois você deixou em branco.");
      await fetch("/api/putSong?song=" + inpt, {
         method: 'post'
      })
    //  alert("Desativado temporariamente: Provavelmente vou ativar novamente em breve...")
    }
    useEffect(function() {
      async function getCol() {
        if(spotify?.isPlaying) {
          const col = await Vibrant.from(spotify?.albumImageUrl).getPalette();

          setColor(col.Vibrant?.hex.toString() as string)
        }
      }
      getCol()
    }, [spotify])
    return(<Layout>
        <div className="flex flex-col w-full h-[94vh] md:h-screen overflow-hidden">
            <div className={spotify?.isPlaying?`p-5 w-full fixed z-[50] blur-3xl transition-all`:"p-5 w-full fixed z-[50] blur-3xl transition-all bg-[#1b1b1b]"} style={{ backgroundColor: `${color}` }}></div>
            <div className="p-4 sticky z-[60]"><Image width="130" height="130" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"}/></div>
            {spotify?.isPlaying?(
            <div className="flex flex-col mt-1 p-2">
               <div className="flex p-3">
                 <div key={spotify?.album}>
                  <AnimatePresence>
                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}>
                        <div className="">
                          <Image placeholder="blur" blurDataURL={"/loading.png"} className="rounded" width="150" height="150" alt="Song Cover" src={spotify?.albumImageUrl}/>
                          {/*<Image placeholder="blur" blurDataURL={"/loading.png"} className="absolute blur-xl rounded" width="150" height="150" alt="Song Cover" src={spotify?.albumImageUrl}/>*/}
                        </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="w-full flex flex-col px-2 justify-center truncate">
                  <p className="w-full text-xl font-black">{spotify?.title}</p>
                  <p className="w-full font-medium">{spotify?.artist}</p>
                  <p className="w-full text-sm font-regular">{spotify?.album}</p>
                  <progress value={spotify?.progress} max={spotify?.duration} className="w-full [&::-webkit-progress-bar]:rounded-lg h-2 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-webkit-progress-value]:bg-green-700 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 [&::-moz-progress-bar]:bg-green-700"></progress>
                  <div className="flex justify-between"><p className="font-bold">{prettyMilliseconds(spotify?.progress, {colonNotation: true, secondsDecimalDigits: 0})}</p><p className="font-bold">{prettyMilliseconds(spotify?.duration, {colonNotation: true, secondsDecimalDigits: 0})}</p></div>
                </div>
            </div>
            <div className="divider"></div>
            <div className="backdrop-blur-xl p-2 flex justify-between w-full">
              <p className="text-xl font-black">Up next</p>
              <button className="rounded-xl px-2 bg-green-900 text-xl font-black text-center hover:opacity-[0.5] transition-all" onClick={addSong}>+</button>
            </div>
            <motion.ul layoutScroll className="flex flex-col w-full h-screen overflow-scroll pt-8 pb-20">
                <AnimatePresence mode="sync" initial={false}>
                    {spotify?.queue.map((q: any) => (
                    <motion.li
                       layout
                       animate={{ y:0, opacity: 1 }}
                       exit={{ y:-(100+q?.artist.length+q?.title.length*2), opacity: 0 }}
                       transition={{ type: "tween" }}
                       className="flex p-2 mt-1 w-full backdrop-blur-lg rounded-2xl"
                       key={q?.title}
                    >
                        <div key={q?.album}>
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}>
                               <div className="relative">
                                <Image placeholder="blur" blurDataURL={"/loading.png"} className="absolute z-10 rounded" width="75" height="75" alt="Song Cover" src={q?.albumImageUrl}/>
                                <Image placeholder="blur" blurDataURL={"/loading.png"} className="blur-xl rounded" width="100" height="100" alt="Song Cover" src={q?.albumImageUrl}/>
                              </div>
                            </motion.div>
                           </AnimatePresence>
                        </div>
                        <div className="drop-shadow-xl px-2 flex flex-col justify-center w-full truncate">
                          <p className="w-full text-lg font-black">{q?.title}</p>
                          <p className="w-full text-md font-medium">{q?.artist}</p>
                        </div>
                      </motion.li>
                ))}
                </AnimatePresence>
          </motion.ul>
        </div>
        ):(
            <div className="w-full h-screen flex flex-col text-center items-center justify-center">
                <p className="text-2xl font-black">Nothing Playing</p>
            </div>
        )}
        </div>
    </Layout>)
}
