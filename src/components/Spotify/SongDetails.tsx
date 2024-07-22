import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export interface SongDetailsInterface {
    open: boolean;
    setOpen: Function;
    spotify: any;
}

const SongDetails = ({ open, setOpen, spotify }: SongDetailsInterface) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="bg-[#1b1b1b]/75 p-3 fixed w-full h-screen backdrop-blur-lg">
          <header onClick={() => setOpen(false)} className="p-4 flex justify-end">
            <p className="text-xl font-black">X</p>
          </header>
          <div className="flex items-center gap-x-2">
            <Image width="100" height="100" src={spotify.albumImageUrl} alt="Album Cover" className="rounded" />
            <div className="flex flex-col p-2">
              <p className="text-xl font-black">{spotify.title}</p>
              <p className="font-medium">{spotify.artist}</p>
              <div className="badge badge-accent">{`${spotify.info.tempo.toFixed()} bpm`}</div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xl font-bold">Song Info</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2">
              {/* Additional song info here */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SongDetails;
