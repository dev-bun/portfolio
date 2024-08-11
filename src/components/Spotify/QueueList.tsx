import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import prettyMilliseconds from "pretty-ms";

export interface QueueInterface {
  queue: any[]; // assuming queue is an array of objects
  timeAgo: any;
  open: boolean;
  setOpen: Function;
  spotify: any;
  lightMutedColor: string;
  mutedColor: string;
  addSong: (event: any) => void;
}

export const percentage = (num: number) => {
  return Number((num / 1) * 100);
}

const QueueList = ({ queue = [], timeAgo, open, setOpen, spotify, lightMutedColor, mutedColor, addSong }: QueueInterface) => {
  return (
    <AnimatePresence mode="sync">
      {queue.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={"w-full overflow-hidden flex flex-col mt-1 p-2"}>
          <motion.ul layoutScroll className={spotify?.isPlaying ?
            "flex flex-col w-full h-screen bg-[#1b1b1b] overflow-hidden scroll-smooth justify-center items-center"
            : "flex flex-col w-full h-screen bg-[#1b1b1b] overflow-scroll scroll-smooth justify-center items-center"
          }>
            <div className="fixed top-0 z-[60] p-3 flex items-center justify-end w-full">
              <button className="m-2 rounded-xl py-1 px-2 bg-green-900 text-xl font-black text-center hover:opacity-[0.5] transition-all" style={{ backgroundColor: mutedColor, color: lightMutedColor }} onClick={addSong}>+</button>
            </div>
            <AnimatePresence mode="sync" initial={true}>
              {queue.map((q: any, index: number) => (
                <motion.li
                  layout
                  initial={{ opacity: 0.5 }}
                  animate={q?.current ? { opacity: 1 } : { opacity: 0.5 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ type: "tween", layout: {}, duration: 1, delay: 0.5 }}
                  className="justify-center items-center flex p-2 mt-1 w-full backdrop-blur-lg rounded-2xl"
                  key={index}
                  id={q?.current ? "current" : ""}
                >
                  <div key={q?.album}>
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}>
                        <div className="">
                          <Image placeholder="blur" blurDataURL={"/loading.png"} className="z-10 rounded" width="100" height="100" alt="Song Cover" src={q.albumImageUrl ? q?.albumImageUrl : "/loading.png"} />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div onClick={() => { q.current ? setOpen(true) : setOpen(false); }} className={q?.current ? "drop-shadow-xl px-2 flex flex-col justify-center w-full truncate cursor-pointer" : "drop-shadow-xl px-2 flex flex-col justify-center w-full truncate"}>
                    <p className="w-full text-lg font-black">{q?.title}</p>
                    <p className="w-full text-md font-medium">{q?.artist}</p>
                    <AnimatePresence mode="sync">
                      {q.current && (
                        <motion.div key={q?.current} transition={{ duration: 0.5 }} initial={{ height: 0, width: "0%", opacity: 0 }} animate={{ height: "50%", width: "100%", opacity: 1 }} exit={{ height: 0, width: "0%", opacity: 0 }}>
                          <progress value={spotify?.progress} max={spotify?.duration} className={`w-full [&::-webkit-progress-bar]:rounded-lg h-2 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-webkit-progress-value]:bg-slate-900 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 [&::-moz-progress-bar]:bg-slate-100`}></progress>
                          <div className="flex justify-between"><p className="font-bold">{prettyMilliseconds(spotify?.progress, { colonNotation: true, secondsDecimalDigits: 0 })}</p><p className="font-bold">{prettyMilliseconds(spotify?.duration, { colonNotation: true, secondsDecimalDigits: 0 })}</p></div>
                        </motion.div>
                      )}
                      {!q?.current && q?.playedAt > 1 && (
                        <motion.div>
                          <p className="w-full text-sm font-regular text-left">{q?.current ? "Playing since" : "Played"} {timeAgo?.format(q?.playedAt)}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} id="current" className="w-full h-screen flex flex-col text-center items-center justify-center overflow-hidden">
          <p className="text-2xl font-black">Nothing Playing</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QueueList;
