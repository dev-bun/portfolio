// Generated with ChatGPT

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaY } from 'react-icons/fa6';

interface TextSliderProps {
  texts: string[];
  interval?: number; // Optional prop for setting the interval between slides
}

const TextSlider: React.FC<TextSliderProps> = ({ texts, interval = 3000 }) => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex === texts.length - 1 ? 0 : prevIndex + 1));
    }, interval);

    return () => clearInterval(intervalId);
  }, [texts.length, interval]);

  const variants = {
    enter: {
      opacity: 0,
      y: 100,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -100,
    },
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          transition={ { type: 'keyframes' } }
        >
          <h1>{texts[index]}</h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TextSlider;
