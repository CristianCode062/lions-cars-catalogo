import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AutoCarousel = ({ images, interval = 3000 }: { images: string[], interval?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"; }}
        />
      </AnimatePresence>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <motion.div key={idx} animate={{ width: currentIndex === idx ? 24 : 6, backgroundColor: currentIndex === idx ? '#dc2626' : 'rgba(255,255,255,0.5)' }} className="h-1.5 rounded-full" />
        ))}
      </div>
    </div>
  );
};