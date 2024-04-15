import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { getSong, putSong } from "./spotify";

export const runtime = 'edge'

export default async function PutSong(req: NextApiRequest, res: NextApiResponse) {
    if(req.method?.toLowerCase() !== "post") return NextResponse.json({ code: 401, text: "Unauthorized" }, { status: 401 });
    const url = new URL(req.url as string)
    const son = await getSong(url.searchParams.get("song") as string)
    const music = await son.json()
    if(son.status !== 200) return NextResponse.json({
        code: 500,
        text: 'Interval Server Error.',
        debug: url.searchParams.get("debug") ? { music: music, error: "Failed to fetch songs" } : { status: "Failed to fetch songs" }
    }, {
        status: 500
    })
    console.log(music.tracks.items[0].uri)
    if(!music.tracks.items[0]) return NextResponse.json({
        code: 500,
        text: 'Internal Server Error.',
        debug: url.searchParams.get("debug") ? { music: music, status: "No matching songs found." } : { status: "No matching songs found." }
    }, { status: 500 });

    const song = await putSong(music?.tracks.items[0].uri)
    if(song.status !== 200) return NextResponse.json({
        code: 500,
        text: 'Internal Server Error.',
        debug: url.searchParams.get("debug") ? { music: music, status: song } : { status: song }
    }, { status: 500 });

    return NextResponse.json({
        code: 200,
        text: "success!",
        debug: url.searchParams.get("debug") ? { music: music, status: song } : { status: song }
    }, { status: 200 })
}
