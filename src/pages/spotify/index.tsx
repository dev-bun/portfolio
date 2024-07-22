import { useEffect, useState } from "react"
import useSWR from "swr"
const fetcher = (url: any) => fetch(url).then((r: any) => r.json())
import Vibrant from 'node-vibrant'
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"

export default function Spotify() {
  const router = useRouter()
  const { data: spotify, mutate, isLoading: loading} = useSWR("/api/spotify", fetcher)
  const [color, setColor] = useState("#FFFFFF")
  const [mutedColor, setMutedColor] = useState("#FFFFFF")
  const [lightMutedColor, setLightColor] = useState("#000000")

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
  }, [spotify?spotify.progress:spotify])

  useEffect(function () {
    mutate()
  }, [spotify])
    if(loading) return (
        <div className="h-screen w-full flex flex-col justify-center items-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
    );

    return (<AnimatePresence mode="wait">
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden flex flex-col w-full bg-[#1b1b1b]" style={{
      'accentColor': color,
      // overflow: 'hidden',
      backgroundColor: "#1b1b1b"
    }}>
        <div className={spotify?.isPlaying ? `p-5 w-full fixed z-[50] blur-3xl transition-all` : "p-5 w-full fixed z-[50] blur-3xl transition-all bg-[#1b1b1b]"} style={{ backgroundColor: `${color}` }}></div>
        <div className={spotify?.isPlaying ? `bottom-0 p-5 w-full fixed z-[50] transition-all blur-xl` : "bottom-0 p-5 w-full fixed z-[50] transition-all blur-xl"} style={{ backgroundColor: `#1b1b1b` }}></div>
        <div className={`w-full bg-[${mutedColor}]/10 backdrop-blur-xl p-4 sticky top-0 z-[60]`}><Image width="130" height="130" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"} /></div>
        <div className="w-full p-5 flex items-center">
            <Image className="avatar rounded-full p-2" src={spotify?.profile.images[1].url} alt="Spotify pfp" width="100" height="100"/>
            <div className="flex flex-col">
                <p className="text-xl font-black">{spotify?.profile?.display_name}</p>
                {/*<TextSlider texts={[spotify?.profile.followers.total + ' followers', `Listening to ${spotify?.isPlaying?spotify?.title:"Nothing"}`]} interval={3000}/>*/}
                <p>{spotify.profile.followers.total} followers</p>
                <div className="flex gap-x-2">
                  <button className={`btn btn-success btn-sm`} onClick={() => window.open(spotify?.profile.external_urls.spotify)}>See on Spotify</button>
                  <button className={`btn btn-neutral btn-sm`} onClick={() => router.push("/spotify/queue")}>See queue</button>
                </div>
            </div>
        </div>
        <div className="p-4">
            <p className="text-lg font-black">Top listened artists</p>
            <ul className="flex flex-col justify-center overflow-scroll">
                {spotify?.top.artists.map((art: any) => (
                    <motion.li key={art.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} onClick={() => window.open(art.url)} className="p-2 flex items-center">
                        <Image className="rounded-full" style={{ objectFit: 'cover', width: 80, height: 80 }} src={art.avatar} alt={`${art.name}'s Avatar`} height="80" width="80"/>
                        <div className="flex flex-col p-2">
                            <p className="text-lg font-black">{art.name}</p>
                        </div>
                    </motion.li>
                ))}
              {/*<li className="text-lg font-bold p-3">More {spotify?.top.artists.length-8}...</li>*/}
            </ul>
            <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10"/>
            <p className="text-lg font-black">Top listened songs</p>
            <motion.ul className="flex flex-col justify-center">
              {spotify?.top.tracks.map((track: any) => (
                <motion.li key={track.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1, transition: { duration: 1 } }} onClick={() => window.open(track.url)} className="p-2 flex items-center">
                  <Image className="rounded" style={{ width: 80, height: 80 }} src={track.albumImageUrl} alt={`${track.title} cover`} height="80" width="80" />
                  <div className="flex flex-col p-2 gap-y-1 truncate ellipsis">
                    <p className="text-lg font-black">{track.title}</p>
                    <p className="text-sm font-medium">{track.artist}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
        </div>
      </motion.div>
    </AnimatePresence>)
}
