import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { putSong } from "./spotify";

export const runtime = 'edge'

export default async function PutSong(req: NextApiRequest, res: NextApiResponse) {
    if(req.method?.toLowerCase() !== "post") return NextResponse.json({ code: 401, text: "Unauthorized" }, { status: 401 });
    const url = new URL(req.url as string)
    /*const song = await putSong(url.searchParams.get("song") as string)
    if(song.status !== 200) return NextResponse.json({
        code: 500,
        text: 'Internal Server Error.'
    }, { status: 500 });*/
    return NextResponse.json({
        code: 200,
        text: "success!"
    }, { status: 200 })
}