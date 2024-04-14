import Layout from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import prettyMilliseconds from "pretty-ms";
import useSWR from "swr";
const fetcher = (url: any) => fetch(url).then((r:any) => r.json())

export default function Spotify() {
    const { data: spotify } = useSWR("/api/spotify", fetcher, { refreshInterval: 100 })
    const addSong = async () => {
      /*const inpt = prompt("Song url");
      const first = inpt?.replace("https://open.spotify.com/track/", "") as string;
      const second = first.replace(/\?+.

      await fetch("/api/putSong?song=spotify:track:" + second, {
         method: 'post'
         
      })*/
      alert("Desativado temporariamente: Provavelmente vou ativar novamente em breve...")
    }
    return(<Layout>
        <div className="flex flex-col w-full h-[94vh] md:h-screen overflow-hidden bg-[#1DB954]">
            <div className="p-4"><Image width="130" height="130" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"}/></div>
            <div className="p-5 w-full fixed bottom-0"></div>
            {spotify?.isPlaying?(
            <div className="flex flex-col mt-1 p-2">
               <div className="flex p-3">
                 <div key={spotify?.album}>
                  <AnimatePresence>
                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}>
                        <div>
                         <Image placeholder="blur" blurDataURL={"/loading.png"} className="rounded" width="150" height="150" alt="Song Cover" src={spotify?.albumImageUrl}/>
                         {/*<Image placeholder="blur" blurDataURL={"/loading.png"} className="absolute rounded" width="100" height="100" alt="Song Cover" src={!data?.spotify?.album_art_url?"/loading.png":data?.spotify?.album_art_url}/>*/}
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
            <hr className="divider"/>
            <div className="p-2 flex justify-between">
              <p className="text-xl font-black">Up next</p>
              <button className="rounded-xl px-2 bg-green-700 text-xl font-black text-center hover:opacity-[0.5] transition-all" onClick={addSong}>+</button>
            </div>
            <motion.ul layoutScroll style={{ overflow: "scroll" }} className="flex flex-col w-full">
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
                               <div>
                                <Image placeholder="blur" blurDataURL={"/loading.png"} className="rounded" width="75" height="75" alt="Song Cover" src={q?.albumImageUrl}/>
                                {/*<Image placeholder="blur" blurDataURL={"/loading.png"} className="absolute rounded" width="100" height="100" alt="Song Cover" src={!data?.spotify?.album_art_url?"/loading.png":data?.spotify?.album_art_url}/>*/}
                                </div>
                            </motion.div>
                           </AnimatePresence>
                        </div>
                        <div className="px-2 flex flex-col justify-center w-full truncate">
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