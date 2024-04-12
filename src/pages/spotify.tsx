import Layout from "@/components/Layout";
import { Html } from "next/document";
import Image from "next/image";
import useSWR from "swr";
const fetcher = (url: any) => fetch(url).then((r:any) => r.json())

export default function Spotify() {
    const { data: spotify } = useSWR("/api/spotify", fetcher, {refreshInterval: 1000})
    return(<Layout>
        <div className="flex flex-col w-full h-[94vh] md:h-screen overflow-hidden bg-[#1DB954]">
            <div className="p-4"><Image width="130" height="130" alt="Spotify logo" src={"/Spotify_Logo_RGB_White.png"}/></div>
            {spotify?.isPlaying?(
            <div className="flex mt-1 p-2">
                
            </div>
        ):(
            <div className="w-full h-screen flex flex-col text-center items-center justify-center">
                <p className="text-2xl font-black">Nothing Playing</p>
            </div>
        )}
        </div>
    </Layout>)
}