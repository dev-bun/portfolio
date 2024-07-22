import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Vibrant from 'node-vibrant';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { fetcher } from "@/utils/fetcher";
import Layout from "@/components/Layout";
import SongDetails from "@/components/Spotify/SongDetails";
import QueueList from "@/components/Spotify/QueueList";

TimeAgo.addDefaultLocale(en);

export default function Spotify() {
  const { data: spotify, mutate, isLoading: loading } = useSWR("/api/spotify", fetcher);
  const [color, setColor] = useState("#FFFFFF");
  const [mutedColor, setMutedColor] = useState("#FFFFFF");
  const [lightMutedColor, setLightColor] = useState("#000000");
  const [open, setOpen] = useState<boolean>(false);
  const player = useRef<any>();
  const queue = spotify?.queue;
  const timeAgo = new TimeAgo('en-US');

  useEffect(() => {
    if (spotify?.isPlaying) {
      Vibrant.from(spotify?.albumImageUrl).getPalette().then((col) => {
        setColor(col.Muted?.hex.toString() as string);
        setMutedColor(col.DarkMuted?.getHex().toString() as string);
        setLightColor(col.LightMuted?.getHex().toString() as string);
      });
    }
  }, [spotify]);

  useEffect(() => {
    mutate();
  }, [spotify ? spotify?.progress : spotify?.isPlaying]);

  const handleAddSong = async () => {
    const inpt = prompt("Song name");
    if (!inpt) return alert("Song name cannot be empty.");
    await fetch("/api/putSong?song=" + inpt, {
      method: 'post'
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col w-full bg-[#1b1b1b]" style={{ 'accentColor': color }}>
        <header className="w-full fixed z-[50] p-5" style={{ backgroundColor: color }}></header>
        <QueueList queue={queue} timeAgo={timeAgo} open={open} setOpen={setOpen} spotify={spotify} handleAddSong={handleAddSong} />
        <SongDetails open={open} setOpen={setOpen} spotify={spotify} />
      </div>
      <style jsx>{`
        progress::-webkit-progress-value {
          background-color: ${lightMutedColor};
        }
        progress::-webkit-progress-bar {
          background-color: ${mutedColor};
        }
      `}</style>
    </Layout>
  );
}
