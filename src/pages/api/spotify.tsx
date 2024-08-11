import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
const {
    SPOTIFY_CLIENT_ID: client_id,
    SPOTIFY_CLIENT_SECRET: client_secret,
    SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`;
const HISTORY_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`;

export type Queue = {
    title?: string;
    artist?: string;
    album?: string;
    albumImageUrl?: string;
    current?: boolean;
};

export type SongInfo = {
    title?: string;
    artist?: string;
    isPlaying?: boolean;
    album?: string;
    albumImageUrl?: string;
    duration?: number;
    songUrl?: string;
    progress?: number;
    queue?: Queue[];
    history?: Queue[];
    preview?: string;
    playedAt?: string;
};

export type SongItem = {
    title?: string;
    artist?: string;
    isPlaying?: boolean;
    album?: string;
    albumImageUrl?: string;
    duration?: number;
    songUrl?: string;
    progress?: number;
    preview?: string;
    info?: SongTempoInfo;
}

export type SongTempoInfo = {
    tempo?: number;
    key?: number;
    energy?: number;
    danceability?: number;
    loudness?: number;
}

// Simple in-memory cache
const cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 30 * 1000; // 30 seconds

const getCachedData = (key: string) => {
    const cached = cache[key];
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        return cached.data;
    }
    return null;
};

const setCachedData = (key: string, data: any) => {
    cache[key] = { data, timestamp: Date.now() };
};

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USERNAME = process.env.LASTFM_USERNAME;
const LASTFM_RECENT_TRACKS_ENDPOINT = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=10`;

async function fetchLastFmRecentTrack() {
    const response = await fetch(LASTFM_RECENT_TRACKS_ENDPOINT);
    if (!response.ok) {
        throw new Error('Failed to fetch data from Last.fm');
    }
    return response.json();
}
export const getAccessToken = async () => {
    const params = new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token as string,
    }).toString();

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    });

    if (!response.ok) {
        throw new Error('Failed to refresh access token');
    }

    return response.json();
};

const fetchSpotify = async (endpoint: string, access_token: string) => {
    const response = await fetch(endpoint, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired access token');
    }

    if (response.status === 429) {
        throw new Error('Rate limited: Too many requests to Spotify API');
    }

    if (response.status !== 200) {
        throw new Error(`Spotify API request failed with status ${response.status}`);
    }

    return response.json();
};

export const getProfile = async (access_token: string) => {
    return fetchSpotify('https://api.spotify.com/v1/me', access_token);
};

export const getTop = async (type: string, access_token: string) => {
    const cacheKey = `top_${type}`;
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    const data = await fetchSpotify(`https://api.spotify.com/v1/me/top/${type}`, access_token);
    setCachedData(cacheKey, data);

    return data;
};

export const getNowPlaying = async (access_token: string) => {
    return fetchSpotify(NOW_PLAYING_ENDPOINT, access_token);
};

export const getQueue = async (access_token: string) => {
    return fetchSpotify(`${QUEUE_ENDPOINT}?limit=10`, access_token);
};

export const getHistory = async (access_token: string) => {
    return fetchSpotify(HISTORY_ENDPOINT, access_token);
};

export const getSong = async (song: string, access_token: string) => {
    return fetchSpotify(`https://api.spotify.com/v1/search?query=${song}&type=track&market=BR&locale=pt-BR&offset=0&limit=1`, access_token);
};

export const putSong = async (song: string, access_token: string) => {
    return fetch(QUEUE_ENDPOINT + "?uri=" + song, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SongInfo>) {
    try {
        const { access_token } = await getAccessToken();

        const [profile, topArtists, topTracks, nowPlaying, queue, history] = await Promise.all([
            getProfile(access_token),
            getTop('artists', access_token),
            getTop('tracks', access_token),
            getNowPlaying(access_token),
            getQueue(access_token),
            getHistory(access_token),
        ]);
        const lastFmData = await fetchLastFmRecentTrack();
        const recentTrack = lastFmData.recenttracks.track//.reverse(); // Assuming the most recent track is at index 0
        const trackInfo = recentTrack.filter((q: any) => q).map((q: any, i: any) => {
            return {
                title: q.name,
                artist: q.artist['#text'] ?? "Unknown",
                album: q.album['#text'] ?? "Unknown",
                albumImageUrl: q.image.find((img: any) => img.size === 'large')['#text'],
                isPlaying: q['@attr']?.nowplaying === 'true',
                playedAt: q.date ? new Date(q.date['#text']).getTime() : null,
            }
        }).filter((v: any, i: any, a: any) => a.findIndex((t: any) => t.title === v.title && t.artist === v.artist) === i);
        const song = await nowPlaying;
        const isPlaying = song.is_playing;

        const songInfo = isPlaying ? {
            title: song.item?.name,
            artist: song.item?.artists.map((_artist: any) => _artist.name).join(', '),
            album: song.item?.album.name,
            albumImageUrl: song.item?.album.images[0].url,
            songUrl: song.item?.external_urls.spotify,
            duration: song.item?.duration_ms,
            progress: song.progress_ms,
            preview: song.item?.preview_url,
            isPlaying,
            current: true
        } : { isPlaying };

        const queueInfo = [
            ...history.items.map((q: any) => ({
                album: q.track.album.name,
                title: q.track.name,
                artist: q.track.artists.map((_artist: any) => _artist.name).join(', '),
                albumImageUrl: q.track.album.images[0].url,
                current: false,
                playedAt: new Date(q.played_at).getTime(),
            })).reverse().filter((q: any) => !q.isPlaying),
            ...trackInfo.reverse().filter((q: any) => !q.isPlaying),
            songInfo,
            ...queue.queue.map((q: any) => ({
                album: q.album.name,
                title: q.name,
                artist: q.artists.map((_artist: any) => _artist.name).join(', '),
                albumImageUrl: q.album.images[0].url,
                current: false,
                playedAt: 0,
            })),
        ]//.filter((v, i, a) => a.findIndex(t => t.title === v.title && t.artist === v.artist) === i);

        const top = {
            artists: topArtists.items.map((q: any) => ({
                name: q.name,
                avatar: q.images[0].url,
                url: q.external_urls.spotify,
            })),
            tracks: topTracks.items.map((q: any) => ({
                album: q.album.name,
                artist: q.artists.map((_artist: any) => _artist.name).join(', '),
                albumImageUrl: q.album.images[0].url,
                title: q.name,
                url: q.external_urls.spotify,
            })),
        };

        return NextResponse.json({
            profile: {
                display_name: profile.display_name,
                external_urls: profile.external_urls,
                images: profile.images,
                followers: profile.followers,
                id: profile.id,
            },
            top,
            info: {
                tempo: 0,
                key: -1,
                energy: 0,
                danceability: 0,
                loudness: 0
            },
            ...songInfo,
            lastFm: trackInfo,
            queue: queueInfo,
        }, {
            status: 200
        });
    } catch (error: any) {
        console.log(error.message);

        let errorMessage = 'Failed to fetch data from Spotify';
        if (error.message.includes('Unauthorized')) {
            errorMessage = 'Spotify API authentication failed';
        } else if (error.message.includes('Rate limited')) {
            errorMessage = 'Too many requests: Rate limited by Spotify API';
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
