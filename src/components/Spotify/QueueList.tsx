import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import prettyMilliseconds from "pretty-ms";

export interface QueueInterface {
  queue: any;
  timeAgo: any;
  open: boolean;
  setOpen: Function;
  spotify: any;
  handleAddSong: any;
}


const QueueList = ({ queue, timeAgo, open, setOpen, spotify, handleAddSong }: QueueInterface) => {
  return (
    <AnimatePresence>
      {queue.length > 0 ? (
        <motion.div className="w-full flex flex-col mt-1 p-2">
          <header className="fixed top-0 z-[60] p-3 flex items-center justify-end w-full">
            <button className="m-2 rounded-xl py-1 px-2 bg-green-900 text-xl font-black text-center hover:opacity-[0.5]" onClick={handleAddSong}>+</button>
          </header>
          <AnimatePresence>
            {queue.map((q: any) => (
              <motion.li key={q.title} className="p-2 mt-1 w-full">
                <div className="flex items-center">
                  <Image width="100" height="100" src={q.albumImageUrl || "/loading.png"} alt="Song Cover" className="rounded" />
                  <div onClick={() => setOpen(q.current)} className="flex flex-col px-2 justify-center w-full truncate cursor-pointer">
                    <p className="text-lg font-black">{q.title}</p>
                    <p className="text-md font-medium">{q.artist}</p>
                    {q.current && (
                      <motion.div>
                        <progress value={spotify.progress} max={spotify.duration} className="w-full h-2"></progress>
                        <div className="flex justify-between">
                          <p className="font-bold">{prettyMilliseconds(spotify.progress, { colonNotation: true, secondsDecimalDigits: 0 })}</p>
                          <p className="font-bold">{prettyMilliseconds(spotify.duration, { colonNotation: true, secondsDecimalDigits: 0 })}</p>
                        </div>
                      </motion.div>
                    )}
                    {!q.current && q.playedAt > 1 && (
                      <motion.div>
                        <p className="text-sm">{timeAgo.format(q.playedAt)}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div className="w-full h-screen flex flex-col text-center items-center justify-center">
          <p className="text-2xl font-black">Nothing Playing</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QueueList;
