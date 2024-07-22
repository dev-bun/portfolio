import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { getAccessToken, getQueue, getSong, putSong } from "./spotify";

export const runtime = 'edge'

export default async function PutSong(req: NextApiRequest, res: NextApiResponse) {
    if (req.method?.toLowerCase() !== "post") return NextResponse.json({ code: 401, text: "Unauthorized" }, { status: 401 });
    const { access_token } = await getAccessToken();
    const url = new URL(req.url as string)
    const { queue } = await getQueue(access_token);
    const music = await getSong(url.searchParams.get("song") as string, access_token)
    
    if (!music) return NextResponse.json({
        code: 500,
        text: 'Interval Server Error.',
        debug: url.searchParams.get("debug") ? { music: music, error: "Failed to fetch songs" } : { status: "Failed to fetch songs" }
    }, {
        status: 500
    })
    console.log(music.tracks.items[0].uri)
    if (!music.tracks.items[0]) return NextResponse.json({
        code: 500,
        text: 'Internal Server Error.',
        debug: url.searchParams.get("debug") ? { music: music, status: "No matching songs found." } : { status: "No matching songs found." }
    }, { status: 500 });

    const q = queue.find((q: any) => q.uri === music.tracks.items[0].uri)

    //:console.log(q.uri)
    const song = await putSong(music?.tracks.items[0].uri, access_token)
    const songInfo = await song.text();
    console.log(songInfo)
    if (song.status !== 204) {
        return NextResponse.json({
            code: 500,
            text: 'Internal Server Error.',
            debug: url.searchParams.get("debug") ? { music: music, status: song } : { status: song }
        }, { status: 500 });
    }
    return NextResponse.json({
        code: 200,
        text: "success!",
        debug: url.searchParams.get("debug") ? { music: music, status: song } : { status: song }
    }, { status: 200 })
}
