import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const AutoCarousel = ({ images, interval = 3000 }: { images: string[], interval?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
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
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800";
          }}
        />
      </AnimatePresence>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              width: currentIndex === idx ? 24 : 6,
              backgroundColor: currentIndex === idx ? '#dc2626' : 'rgba(255,255,255,0.5)'
            }}
            className="h-1.5 rounded-full transition-all"
          />
        ))}
      </div>
    </div>
  );
};

export const DetailItem = ({ icon: Icon, label, value, highlight = false }: any) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
    <div className="p-2 rounded-lg bg-gray-100 text-red-600 border border-gray-200 shadow-sm">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">{label}</p>
      <p className={`font-medium text-sm ${highlight ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
    </div>
  </div>
);

export const ImageZoomModal = ({ image, onClose, onNext, onPrev, currentIndex, totalImages }: any) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
  >
    <button onClick={onClose} className="absolute top-4 right-4 z-[110] bg-white/10 text-white p-3 rounded-full"><X size={24} /></button>
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full"><span className="text-sm font-bold">{currentIndex + 1} / {totalImages}</span></div>
    <motion.img 
      initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={image} 
      className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
      onClick={(e) => e.stopPropagation()} 
    />
    {totalImages > 1 && (
      <>
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 text-white p-4 rounded-full"><ChevronLeft size={32} /></button>
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 text-white p-4 rounded-full"><ChevronRight size={32} /></button>
      </>
    )}
  </motion.div>
);