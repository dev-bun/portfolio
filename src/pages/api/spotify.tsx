import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
//import querystring from 'querystring';
export const runtime = "edge";
const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`
const HISTORY_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`// ?after=${new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), new Date().getHours(),59,59,999).getTime()}&before=${new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), new Date().getHours(),0,0,0).getTime()}`
export type Queue = {
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  current?: boolean;
}

export type SongInfo = {
  title?: string;
  artist?: string;
  isPlaying?: boolean;
  album?: string;
  albumImageUrl?: string;
  duration?: number;
  songUrl?: string;
  progress?: number;
  queue?: Queue;
  history?: Queue;
  preview?: string;
}

const getAccessToken = async () => {
  const params = new URLSearchParams({
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token as string
  }).toString();

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
    /* new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),*/
  });

  return response.json();
};

export const getProfile = async () => {
  const { access_token } = await getAccessToken();

  return fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
}
export const getTop = async (type: string) => {
  const { access_token } = await getAccessToken();
  return fetch("https://api.spotify.com/v1/me/top/"+ type, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
}

export const getSongInfo = async (song: string) => {
  const { access_token } = await getAccessToken();

  return fetch("https://api.spotify.com/v1/audio-features/" + song, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
export const getQueue = async () => {
  const { access_token } = await getAccessToken();
  return fetch(QUEUE_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  })
}

export const getHistory = async () => {
  const { access_token } = await getAccessToken();
  const now = new Date()
  return fetch(HISTORY_ENDPOINT + "?after="+Math.floor(Date.now()/1000), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  })
}
export const getSong = async (song: string) => {
  const { access_token } = await getAccessToken();
  return fetch(`https://api.spotify.com/v1/search?query=${song}&type=track&market=BR&locale=pt-BR&offset=0&limit=1`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
}
export const putSong = async (song: string) => {
  const { access_token } = await getAccessToken();
  return fetch(QUEUE_ENDPOINT + "?uri=" + song, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  })
}
export default async function GET(req: NextApiRequest, res: NextApiResponse<SongInfo>) {
  const response = await getNowPlaying();
  const que = await getQueue();
  const his = await getHistory();
  const pro = await getProfile();
  const topArt = await getTop("artists");
  const topTra = await getTop("tracks");
  const profile = await pro.json();
  var tracks: any = [];
  var artists: any = [];
  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({ profile, top: { tracks, artists }, isPlaying: false }, { status: 200 });
  }
  const song = await response.json();
  const topArtists = await topArt.json();
  const topTracks = await topTra.json();
  const queu = await que.json();
  const histo = await his.json();
  // console.log(histo.items)
  const queue = queu.queue;
  const history = histo.items;
  var item: any = []
  var historyItem: any = []
 // console.log(history)
  await history.forEach(async (q: any) => {
    // console.log(q.track.album.images)
    if (history.length < 1) return;
    historyItem.push({
      album: q.track.album.name,
      title: q.track.name,
      artist: q.track.artists.map((_artist: any) => _artist.name).join(', '),
      albumImageUrl: q.track.album.images[0].url,
      current: false,
      playedAt: new Date(q.played_at).getTime()
    })
  })
  await queue.forEach(async (q: any) => {
    if (item.filter((n: any) => n?.title === q?.name).length >= 1) return;
    item.push({
      album: q.album.name,
      title: q.name,
      artist: q.artists.map((_artist: any) => _artist.name).join(', '),
      albumImageUrl: q.album.images[0].url,
      current: false,
      playedAt: 0
    })
  })
  // var artists: any = [];
  await topArtists.items.forEach(async (q: any) => {
    if(!q) return;
    artists.push({
      name: q.name,
      avatar: q.images[0].url,
      url: q.external_urls.spotify
    })
  })
 // var tracks: any = [];
  await topTracks.items.forEach(async (q: any) => {
    if(!q) return;
    tracks.push({
      album: q.album.name,
      artist: q.artists.map((_artist: any) => _artist.name).join(', '),
      albumImageUrl: q.album.images[0].url,
      title: q.name,
      url: q.external_urls.spotify
    })
  })
  // console.log(item)
  
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;
  const duration = song.item.duration_ms;
  const progress = song.progress_ms
  const preview = song.item.preview_url
  const songInf = await getSongInfo(song.item.id);
  const songInfo = await songInf.json();
  return NextResponse.json({
    profile: {
      display_name: profile.display_name,
      external_urls: profile.external_urls,
      images: profile.images,
      followers: profile.followers,
      id: profile.id
    },
    top: {
      artists,
      tracks
    },
    info: {
      beta: true,
      ...songInfo
    },
    album,
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
    duration,
    progress,
    preview,
    queue: [
      ...historyItem,
      {
        album,
        albumImageUrl,
        artist,
        isPlaying,
        songUrl,
        title,
        duration,
        progress,
        preview,
        current: true,
        playedAt: song.timestamp
      },
      ...item
    ],
  }, { status: 200 });
};
