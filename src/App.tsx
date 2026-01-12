import React, { useState, useMemo, useEffect } from 'react';
import {
  Car, Calendar, Gauge, Fuel, Settings2, Users, Key, ThermometerSnowflake,
  Disc, DollarSign, Info, CheckCircle2, Search, X, MessageCircle, ChevronRight,
  ChevronLeft, Filter, Heart, Share2, LayoutDashboard, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SellerPortal from './components/SellerPortal';

const createImageArray = (folder: string, count: number) => {
  const normFolder = folder.toLowerCase().replace(/[^a-z0-9-_]/g, '').replace(/\s+/g, '-');
  return Array.from({ length: count }, (_, i) => `/autoefec/${normFolder}/${i + 1}.jpg`);
};

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  version: string;
  ano: number;
  precio: number;
  km: number;
  duenos: number;
  traccion: string;
  transmision: string;
  cilindrada: string;
  combustible: string;
  tipoVenta: 'Propio' | 'Consignado';
  vendedor: string;
  financiable: boolean;
  valorPie: number;
  aire: boolean;
  neumaticos: string;
  llaves: number;
  obs: string;
  imagenes: string[];
  estado?: 'Disponible' | 'Vendido' | 'Reservado';
  diasStock?: number;
  vistas?: number;
  interesados?: number;
  patente?: string;
  color?: string;
  comisionEstimada?: number;
  precioHistorial?: { date: string; price: number; }[];
}

interface CarCardProps {
  car: Vehiculo;
  onClick: (c: Vehiculo) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: number) => void;
}

const stockInicial: Vehiculo[] = [
  {
    id: 1, marca: "CITROEN", modelo: "BERLINGO", version: "",
    ano: 2020, precio: 10990000, km: 140000, duenos: 1, traccion: "Delantera",
    transmision: "Automática CVT", cilindrada: "1.0L Turbo", combustible: "Diesel",
    tipoVenta: "Propio", vendedor: "Carlos Pérez", financiable: true, valorPie: 4000000,
    aire: true, neumaticos: "Nuevos", llaves: 2,
    obs: "Vehículo seminuevo, garantía de marca vigente",
    imagenes: createImageArray("CITROEN-BERLINGO", 8)
  },
  {
    id: 2, marca: "FORD", modelo: "F150", version: "5.0",
    ano: 2024, precio: 44990000, km: 35000, duenos: 1, traccion: "4x4",
    transmision: "Automática", cilindrada: "3.5L Twin-Turbo", combustible: "Gasolina",
    tipoVenta: "Propio", vendedor: "Carlos Pérez", financiable: true, valorPie: 15000000,
    aire: true, neumaticos: "Nuevos", llaves: 2,
    obs: "Unidad en estado de vitrina.",
    imagenes: createImageArray("FORD-F150", 9)
  },
  {
    id: 3, marca: "HYUNDAI", modelo: "GRAND-I10-GLS", version: "1.2",
    ano: 2018, precio: 6790000, km: 85000, duenos: 2, traccion: "",
    transmision: "Mecánica 6V", cilindrada: "2.4L Diesel", combustible: "Diesel",
    tipoVenta: "Consignado", vendedor: "María González", financiable: true, valorPie: 2000000,
    aire: true, neumaticos: "Media vida", llaves: 1,
    obs: "Mecánicamente impecable. Uso mayoritario en carretera. Ideal para trabajo pesado.",
    imagenes: createImageArray("HYUNDAI -GRAND-I10-GLS", 8)
  },
  {
    id: 4, marca: "HYUNDAI", modelo: "TUCSON", version: "M Sport",
    ano: 2015, precio: 8900000, km: 41000, duenos: 1, traccion: "Trasera",
    transmision: "Mecanica", cilindrada: "2.0L Turbo", combustible: "Gasolina",
    tipoVenta: "Propio", vendedor: "Alex Hernandez", financiable: true, valorPie: 20000000,
    aire: true, neumaticos: "Buen estado", llaves: 2,
    obs: "Solo uso fin de semana. Láminas certificadas. Garantía vigente. Paquete M completo.",
    imagenes: createImageArray("HYUNDAI-TUCSON", 8)
  },
  {
    id: 5, marca: "MAXUS", modelo: "T60", version: "2.8 turbo diesel",
    ano: 2018, precio: 13900000, km: 44000, duenos: 2, traccion: "Delantera",
    transmision: "Automática", cilindrada: "1.6L BlueHDi", combustible: "Diesel",
    tipoVenta: "Consignado", vendedor: "Roberto Diaz", financiable: false, valorPie: 4000000,
    aire: true, neumaticos: "Nuevos", llaves: 2,
    obs: "Consignación virtual. El dueño lo muestra en su domicilio. Techo panorámico.",
    imagenes: createImageArray("MAXUS-T60", 9)
  },
  {
    id: 6, marca: "NISSAN", modelo: "NAVARA", version: "2.3",
    ano: 2023, precio: 20990000, km: 55000, duenos: 3, traccion: "4x4",
    transmision: "Automática", cilindrada: "3.6L V6", combustible: "Diesel",
    tipoVenta: "Consignado", vendedor: "María González", financiable: true, valorPie: 12000000,
    aire: true, neumaticos: "Off-road 35''", llaves: 1,
    obs: "Equipamiento extra: Winche, suspensión elevada Fox, focos LED. Listo para aventura.",
    imagenes: createImageArray("NISSAN-NAVARA", 8)
  },
  {
    id: 7, marca: "PEUGEOT", modelo: "208", version: "Z71 Trail Boss",
    ano: 2020, precio: 42500000, km: 45000, duenos: 1, traccion: "4x4",
    transmision: "Automática 10V", cilindrada: "5.3L V8", combustible: "Gasolina",
    tipoVenta: "Propio", vendedor: "Alex Hernandez", financiable: true, valorPie: 14000000,
    aire: true, neumaticos: "Nuevos M/T", llaves: 2,
    obs: "Potencia americana pura. Suspensión rancho de fábrica. Pisaderas eléctricas.",
    imagenes: createImageArray("PEUGEOT-208", 7)
  },

  {
    id: 8, marca: "TOYOTA-HILUX- 4X4", modelo: "Frontier", version: "GT AWD",
    ano: 2022, precio: 9490000, km: 25000, duenos: 1, traccion: "AWD",
    transmision: "Automática 6V", cilindrada: "2.5L Skyactiv", combustible: "Gasolina",
    tipoVenta: "Consignado", vendedor: "Roberto Diaz", financiable: true, valorPie: 9000000,
    aire: true, neumaticos: "Buen estado", llaves: 2,
    obs: "SUV familiar seguro y confiable. Audio Bose, Head-up display y cuero nappa.",
    imagenes: createImageArray("TOYOTA-HILUX- 4X4", 7)
  },


];


const LOCAL_STORAGE_KEY = 'autos_catalogo_stock';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

type VehiculoLegacy = Vehiculo & { imagen?: string };
function loadStockFromLocalStorage(): Vehiculo[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const loaded: VehiculoLegacy[] = JSON.parse(data);
      return loaded.map((car) => {
        let imagenesArray = car.imagenes || [];
        if (imagenesArray.length === 0 && car.imagen) {
          imagenesArray = [car.imagen];
        }
        if (imagenesArray.length === 0) {
          imagenesArray = ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"];
        }
        console.log(`🚗 ${car.marca} ${car.modelo} - Imágenes cargadas:`, imagenesArray.length);
        return {
          ...car,
          imagenes: imagenesArray
        };
      });
    }
  } catch (e) {
    console.error('Error cargando stock:', e);
  }
  return stockInicial;
}

function saveStockToLocalStorage(stock: Vehiculo[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stock));
  } catch {
    // ignore
  }
}

const AutoCarousel = ({ images, interval = 3000 }: { images: string[], interval?: number }) => {
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


const CarCard = ({ car, onClick, isFavorite, onToggleFavorite }: CarCardProps) => {
  // 1. VALIDACIÓN DE SEGURIDAD (Evita errores de carga)
  if (!car) return null;

  // Logs originales
  console.log(`🎴 Card ${car.marca} ${car.modelo} - Imágenes:`, car.imagenes?.length || 0, car.imagenes);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => {
        if (onClick) onClick(car);
      }}
      className="group bg-[#121212] border border-white/5 rounded-[24px] overflow-hidden cursor-pointer hover:border-red-600/40 hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)] flex flex-col h-full relative transition-all duration-300"
    >
      {/* BADGE TIPO VENTA Y ESTADO */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border ${
          car.tipoVenta === 'Propio'
            ? 'bg-red-600 text-white border-red-500/50'
            : 'bg-zinc-800 text-zinc-100 border-white/10'
          }`}>
          {car.tipoVenta}
        </span>
        {car.estado && car.estado !== 'Disponible' && (
          <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-600 text-white border border-orange-500/50 backdrop-blur-md">
            {car.estado}
          </span>
        )}
      </div>

      {/* BOTÓN FAVORITO */}
      <button
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation(); 
          if (onToggleFavorite) onToggleFavorite(e, car.id);
        }}
        className="absolute top-3 right-3 z-30 p-2.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all border border-white/10 shadow-lg"
      >
        <Heart 
          size={18} 
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-300"} 
        />
      </button>

      {/* CONTENEDOR DE IMAGEN / CAROUSEL */}
      <div className="relative h-60 overflow-hidden bg-zinc-900">
        <AutoCarousel
          images={(() => {
            const imgs = Array.isArray(car.imagenes) && car.imagenes.length > 0
              ? car.imagenes
              : ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"];
            console.log(`🎠 AutoCarousel de ${car.marca} ${car.modelo} recibe:`, imgs.length, 'imágenes');
            return imgs;
          })()}
        />
        
        {/* Gradiente sutil para legibilidad del precio */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />

        <div className="absolute bottom-4 left-5">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 drop-shadow-md">
            {car.marca}
          </p>
          <p className="text-white font-bold text-2xl drop-shadow-2xl tracking-tight">
            {formatPrice(car.precio)}
          </p>
          {car.financiable && (
            <p className="text-zinc-400 text-[10px] mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Pie: {formatPrice(car.valorPie)}
            </p>
          )}
        </div>
      </div>

      {/* CUERPO DE LA CARD */}
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
        <div className="mb-5">
          <h3 className="text-zinc-100 font-bold text-xl leading-tight group-hover:text-red-500 transition-colors">
            {car.modelo}
          </h3>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1 opacity-70">
            {car.version}
          </p>
        </div>

        {/* GRID DE ESPECIFICACIONES */}
        <div className="grid grid-cols-2 gap-y-4 text-[13px] text-zinc-400 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 text-red-500 border border-white/5">
              <Calendar size={14} />
            </div>
            <span className="font-semibold">{car.ano}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 text-red-500 border border-white/5">
              <Gauge size={14} />
            </div>
            <span className="font-semibold">{car.km.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 text-red-500 border border-white/5">
              <Fuel size={14} />
            </div>
            <span className="font-semibold">{car.combustible}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 text-red-500 border border-white/5">
              <Settings2 size={14} />
            </div>
            <span className="font-semibold truncate">{car.transmision}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-red-500 font-black border border-white/10 shadow-inner">
              {car.vendedor.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-zinc-600">Vendedor</span>
              <span className="text-zinc-300 font-bold leading-none">{car.vendedor.split(' ')[0]}</span>
            </div>
          </div>
          
          <span className="text-red-500 text-[11px] font-black uppercase flex items-center gap-1.5 group-hover:translate-x-1 transition-transform bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">
            Ficha <ChevronRight size={14} />
          </span>
        </div>
      </div>

      {/* Borde de brillo sutil en hover */}
      <div className="absolute inset-0 pointer-events-none rounded-[24px] border border-white/0 group-hover:border-red-600/20 transition-all duration-500" />
    </motion.div>
  );
};

const ImageZoomModal = ({
  image,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalImages
}: {
  image: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalImages: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-md border border-white/20 shadow-2xl"
      >
        <X size={24} />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 shadow-lg">
        <span className="text-sm font-bold">{currentIndex + 1} / {totalImages}</span>
      </div>

      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        src={image}
        alt="Zoom"
        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {totalImages > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-2xl"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-2xl"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 shadow-lg">
        <p className="text-xs font-medium">Click fuera para cerrar • Usa las flechas para navegar</p>
      </div>
    </motion.div>
  );
};

const CarModal = ({ car, onClose, onContact }: { car: Vehiculo; onClose: () => void; onContact: (c: Vehiculo) => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageZoom, setShowImageZoom] = useState(false);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % car.imagenes.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + car.imagenes.length) % car.imagenes.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white w-full max-w-6xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-red-500 hover:text-white text-gray-800 p-2 rounded-full transition-all backdrop-blur-md border border-gray-200 shadow-lg"
        >
          <X size={20} />
        </button>

        <div className="md:w-5/12 relative flex flex-col bg-black">
          <div className="h-72 md:h-2/3 w-full relative group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={car.imagenes[currentImageIndex]}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                alt={car.modelo}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={(e) => { e.stopPropagation(); setShowImageZoom(true); }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800";
                }}
              />
            </AnimatePresence>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-red-600 hover:text-white text-gray-800 p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 border border-gray-200 shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-red-600 hover:text-white text-gray-800 p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 border border-gray-200 shadow-lg"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 shadow-lg">
              {currentImageIndex + 1} / {car.imagenes.length}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">{car.marca}</span>
                  <span className="bg-white/90 text-gray-800 text-xs px-2 py-0.5 rounded backdrop-blur-md border border-white/20">{car.ano}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-1 leading-none">{car.modelo}</h2>
                <p className="text-gray-300 text-lg mb-4">{car.version}</p>
                <div className="inline-block border border-red-600/30 bg-red-900/10 px-4 py-2 rounded-lg">
                  <p className="text-red-500 font-bold text-3xl tracking-tight">{formatPrice(car.precio)}</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="relative p-4 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800/50">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-900">
              {car.imagenes.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentImageIndex(idx)}
                  onDoubleClick={() => { setCurrentImageIndex(idx); setShowImageZoom(true); }}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all group ${currentImageIndex === idx
                    ? 'border-red-600 shadow-lg shadow-red-500/30'
                    : 'border-gray-700 hover:border-gray-500'
                    }`}
                >
                  <img
                    src={img}
                    className={`w-full h-full object-cover transition-all ${currentImageIndex === idx ? 'scale-100' : 'scale-95 grayscale group-hover:grayscale-0 group-hover:scale-100'
                      }`}
                    alt={`Vista ${idx + 1}`}
                  />
                  {currentImageIndex === idx && (
                    <motion.div
                      layoutId="activeThumb"
                      className="absolute inset-0 border-2 border-red-600 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity ${currentImageIndex === idx ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none" />
          </div>

          <div className="flex-grow p-8 bg-gray-900 border-t border-gray-800 flex flex-col justify-center">
            <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700/50 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {car.vendedor.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Ejecutivo de Ventas</p>
                  <p className="text-white font-bold text-lg">{car.vendedor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 py-1.5 px-3 rounded-full w-fit border border-green-900/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Disponible en Línea
              </div>
            </div>

            <button
              onClick={() => onContact(car)}
              className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-green-900/30 group"
            >
              <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
              <span>Contactar por WhatsApp</span>
            </button>

            <button className="mt-3 w-full border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
              <Share2 size={16} /> Compartir ficha
            </button>
          </div>
        </div>

        <div className="md:w-7/12 p-6 md:p-10 overflow-y-auto bg-white">  
          <div className="mb-8 flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Info className="text-red-600" size={24} />
              Ficha Técnica
            </h3>
            <span className="text-xs text-gray-500">ID: #{car.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <DetailItem icon={Calendar} label="Año" value={car.ano} />
            <DetailItem icon={Gauge} label="Kilometraje" value={`${car.km.toLocaleString()} km`} />
            <DetailItem icon={Car} label="Cilindrada" value={car.cilindrada} />
            <DetailItem icon={Fuel} label="Combustible" value={car.combustible} />
            <DetailItem icon={Settings2} label="Transmisión" value={car.transmision} />
            <DetailItem icon={Settings2} label="Tracción" value={car.traccion} />
            <DetailItem icon={Users} label="Dueños" value={car.duenos} />
            <DetailItem icon={Key} label="Llaves" value={car.llaves} />
            <DetailItem icon={ThermometerSnowflake} label="Aire Acond." value={car.aire ? "Sí, Climatizador" : "No"} highlight={car.aire} />
            <DetailItem icon={Disc} label="Neumáticos" value={car.neumaticos} />
          </div>

          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" /> Información Comercial
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/50">
                <span className="text-gray-600">Tipo de Venta:</span>
                <span className={`${car.tipoVenta === 'Propio' ? 'text-red-600' : 'text-gray-800'} font-bold`}>{car.tipoVenta}</span>
              </div>
              {car.financiable && (
                <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/50 border-t border-gray-200 pt-3">
                  <span className="text-gray-600">Financiamiento:</span>
                  <div className="text-right">
                    <span className="text-green-600 font-bold block">Disponible</span>
                    <span className="text-gray-500 text-xs">Pie desde {formatPrice(car.valorPie)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <CheckCircle2 size={14} /> Observaciones del Inspector
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed italic border-l-2 border-red-600 pl-4 py-1">
              "{car.obs}"
            </p>
          </div>
        </div>
        <AnimatePresence>
          {showImageZoom && (
            <ImageZoomModal
              image={car.imagenes[currentImageIndex]}
              currentIndex={currentImageIndex}
              totalImages={car.imagenes.length}
              onClose={() => setShowImageZoom(false)}
              onNext={() => setCurrentImageIndex((prev) => (prev + 1) % car.imagenes.length)}
              onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + car.imagenes.length) % car.imagenes.length)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, highlight = false }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  highlight?: boolean
}) => (
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

function App() {
  const [stock, setStock] = useState<Vehiculo[]>(() => loadStockFromLocalStorage());
  const [selectedSeller, setSelectedSeller] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCar, setSelectedCar] = useState<Vehiculo | null>(null);
  const [notification, setNotification] = useState<{ message: string; sub: string } | null>(null);
  // Eliminada lógica de edición/eliminación de autos
  const [currentView, setCurrentView] = useState<'catalog' | 'seller'>('catalog');

  const [filters, setFilters] = useState({
    marca: 'Todas',
    yearMin: '',
    yearMax: '',
    priceMin: '',
    priceMax: '',
    kmMin: '',
    kmMax: '',
    combustible: 'Todos',
    transmision: 'Todas',
    traccion: 'Todas',
    tipoVenta: 'Todos',
    financiable: 'Todos',
    duenosMax: '',
    aire: 'Todos',
    neumaticos: 'Todos'
  });

  // Actualizar stock al agregar auto desde SellerPortal
  const handleAddCar = (car: Vehiculo) => {
    console.log('🚗 Nuevo auto recibido:', car);
    console.log('📸 Imágenes recibidas:', car.imagenes);
    console.log('📸 Cantidad de imágenes:', car.imagenes?.length || 0);

    if (!car.imagenes || car.imagenes.length === 0) {
      console.warn('⚠️ No se recibieron imágenes, usando placeholder');
      car.imagenes = ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"];
    }

    setStock((prev) => {
      const updated = [car, ...prev];
      console.log('💾 Guardando en localStorage:', updated[0].imagenes);
      saveStockToLocalStorage(updated);
      return updated;
    });

    setTimeout(() => {
      const reloaded = loadStockFromLocalStorage();
      const encontrado = reloaded.find(c => c.id === car.id);
      console.log('✅ Verificación post-guardado:', encontrado?.imagenes);
    }, 100);
  };

  // Escuchar cambios en localStorage hechos desde otras pestañas/ventanas
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'autos_catalogo_stock') {
        setStock(loadStockFromLocalStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync stock to localStorage on change
  useEffect(() => {
    saveStockToLocalStorage(stock);
  }, [stock]);

  const sellers = useMemo(() => ['Todos', ...Array.from(new Set(stock.map(c => c.vendedor)))], [stock]);
  const marcas = useMemo(() => ['Todas', ...Array.from(new Set(stock.map(c => c.marca))).sort()], [stock]);


  const filteredStock = useMemo(() => {
    return stock.filter(car => {
      const matchSeller = selectedSeller === 'Todos' || car.vendedor === selectedSeller;

      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        car.marca.toLowerCase().includes(searchLower) ||
        car.modelo.toLowerCase().includes(searchLower) ||
        car.ano.toString().includes(searchLower) ||
        car.version.toLowerCase().includes(searchLower);

      const matchMarca = filters.marca === 'Todas' || car.marca === filters.marca;
      const matchYearMin = !filters.yearMin || car.ano >= parseInt(filters.yearMin);
      const matchYearMax = !filters.yearMax || car.ano <= parseInt(filters.yearMax);
      const matchPriceMin = !filters.priceMin || car.precio >= parseInt(filters.priceMin);
      const matchPriceMax = !filters.priceMax || car.precio <= parseInt(filters.priceMax);
      const matchKmMin = !filters.kmMin || car.km >= parseInt(filters.kmMin);
      const matchKmMax = !filters.kmMax || car.km <= parseInt(filters.kmMax);
      const matchCombustible = filters.combustible === 'Todos' || car.combustible === filters.combustible;
      const matchTransmision = filters.transmision === 'Todas' || car.transmision.includes(filters.transmision);
      const matchTraccion = filters.traccion === 'Todas' || car.traccion === filters.traccion;
      const matchTipoVenta = filters.tipoVenta === 'Todos' || car.tipoVenta === filters.tipoVenta;
      const matchFinanciable = filters.financiable === 'Todos' ||
        (filters.financiable === 'Si' ? car.financiable : !car.financiable);
      const matchDuenos = !filters.duenosMax || car.duenos <= parseInt(filters.duenosMax);
      const matchAire = filters.aire === 'Todos' || (filters.aire === 'Si' ? car.aire : !car.aire);
      const matchNeumaticos = filters.neumaticos === 'Todos' || car.neumaticos === filters.neumaticos;

      return matchSeller && matchSearch && matchMarca && matchYearMin && matchYearMax &&
        matchPriceMin && matchPriceMax && matchKmMin && matchKmMax && matchCombustible &&
        matchTransmision && matchTraccion && matchTipoVenta && matchFinanciable &&
        matchDuenos && matchAire && matchNeumaticos;
    });
  }, [stock, selectedSeller, searchTerm, filters]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleContact = (car: Vehiculo) => {
    const phone = "56912345678";
    const text = `Hola ${car.vendedor}, estoy interesado en el ${car.marca} ${car.modelo} (${car.ano}) que vi en Autoefec.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    setNotification({
      message: `¡Redirigiendo a WhatsApp!`,
      sub: `Contactando a ${car.vendedor}...`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const clearAllFilters = () => {
    setFilters({
      marca: 'Todas',
      yearMin: '',
      yearMax: '',
      priceMin: '',
      priceMax: '',
      kmMin: '',
      kmMax: '',
      combustible: 'Todos',
      transmision: 'Todas',
      traccion: 'Todas',
      tipoVenta: 'Todos',
      financiable: 'Todos',
      duenosMax: '',
      aire: 'Todos',
      neumaticos: 'Todos'
    });
    setSearchTerm('');
    setSelectedSeller('Todos');
  };



  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-red-600/30">
      <div className="relative">
        {/* Header Superior */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 bg-black/95 backdrop-blur-2xl border-b border-gray-800/50"
        >
          {/* Barra superior con contactos */}
          <div className="w-full bg-gray-900/50 border-b border-gray-800/30">
            <div className="w-full px-6 py-2">
              <div className="flex items-center justify-between text-xs">
                {/* Dirección */}
                <div className="hidden lg:flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Av. Principal #123, Concepción, Chile</span>
                </div>

                {/* WhatsApp en 2 filas */}
                <div className="flex items-center gap-3 ml-auto">
                  <div className="flex flex-col gap-1">
                    <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors">
                      <MessageCircle size={14} />
                      <span className="font-medium">+56 9 1234 5678</span>
                    </a>
                    <a href="https://wa.me/56987654321" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors">
                      <MessageCircle size={14} />
                      <span className="font-medium">+56 9 8765 4321</span>
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a href="https://wa.me/56911223344" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors">
                      <MessageCircle size={14} />
                      <span className="font-medium">+56 9 1122 3344</span>
                    </a>
                    <a href="https://wa.me/56955667788" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors">
                      <MessageCircle size={14} />
                      <span className="font-medium">+56 9 5566 7788</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra principal */}
          <div className="w-full px-6 h-20 flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentView('catalog')}
            >
              <img
                src="/logos/autoefec.png"
                alt="Autoefec Logo"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Ctext x='0' y='30' font-size='24' fill='%23dc2626' font-weight='bold' font-style='italic'%3EAUTOEFEC%3C/text%3E%3C/svg%3E";
                }}
              />
            </motion.div>

            <div className="flex items-center gap-4">
              {currentView === 'catalog' && (
                <button className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">
                  Favoritos <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{favorites.length}</span>
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(currentView === 'catalog' ? 'seller' : 'catalog')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg ${currentView === 'catalog'
                    ? 'bg-white text-black hover:bg-red-600 hover:text-white'
                    : 'bg-gray-800 text-red-400 border border-red-900/50'
                  }`}
              >
                {currentView === 'catalog' ? (
                  <>
                    <LayoutDashboard size={18} />
                    <span>Portal Vendedor</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft size={18} />
                    <span>Volver al Catálogo</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Hero Section - Reducido para dar paso al catálogo rápido */}
        {/* Hero Section - Con slogan */}
{currentView === 'catalog' && (
  <div className="relative h-[350px] w-full overflow-hidden flex items-center justify-center">
    <motion.div 
      className="absolute inset-0 z-0"
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}
    >
      <img src="/DSC06884.JPG" className="w-full h-full object-cover opacity-40" alt="Background" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
    </motion.div>
    
    <div className="relative z-10 text-center px-4 max-w-4xl">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-black italic text-white tracking-tighter mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
          AUTO<span className="text-red-600 text-glow">EFEC</span>
        </h1>
        <div className="h-1 w-32 bg-red-600 mx-auto mb-6 rounded-full"></div>
        
        <motion.p 
          className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Tu Auto Ideal Te Está Esperando
        </motion.p>
        
        <motion.p 
          className="text-gray-300 text-base md:text-lg font-medium drop-shadow-md max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Vehículos seleccionados con garantía y financiamiento disponible. 
          <span className="text-red-500 font-bold"> Más de 15 años</span> conectando familias con su auto perfecto.
        </motion.p>

        <motion.div 
          className="flex items-center justify-center gap-4 mt-6 flex-wrap"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
            <p className="text-xs font-bold text-white">✓ Garantía Incluida</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
            <p className="text-xs font-bold text-white">✓ Financiamiento Fácil</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
            <p className="text-xs font-bold text-white">✓ Revisión Técnica</p>
          </div>
        </motion.div>
      </motion.div>
    </div>

    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-900/20 blur-[120px] pointer-events-none"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
)}
      </div>

      {/* CUERPO PRINCIPAL CON SIDEBAR */}
      <main className="w-full px-6 pb-20">
        <AnimatePresence mode="wait">
          {currentView === 'catalog' ? (
            <div className="flex flex-col md:flex-row gap-8">

              {/* COLUMNA IZQUIERDA: FILTROS FIJOS */}
              <aside className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0">
                <div className="sticky top-24">
                  <div className="bg-gray-900/50 p-5 rounded-3xl border border-gray-800 shadow-xl">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <Filter size={18} className="text-red-600" /> Filtros
                    </h3>

                    {/* Buscador dentro del Sidebar */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-black border border-gray-800 rounded-xl py-2 pl-10 pr-3 text-sm focus:border-red-600 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Filtros Compactos */}
                    <div className="space-y-3">
                      {/* Vendedor y Marca en una fila */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Vendedor</label>
                          <select
                            value={selectedSeller}
                            onChange={(e) => setSelectedSeller(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs text-white focus:border-red-600"
                          >
                            {sellers.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Marca</label>
                          <select
                            value={filters.marca}
                            onChange={(e) => setFilters({ ...filters, marca: e.target.value })}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs text-white focus:border-red-600"
                          >
                            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Año */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Año</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Desde"
                            value={filters.yearMin}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs focus:border-red-600 outline-none"
                            onChange={(e) => setFilters({ ...filters, yearMin: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="Hasta"
                            value={filters.yearMax}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs focus:border-red-600 outline-none"
                            onChange={(e) => setFilters({ ...filters, yearMax: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Precio */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Precio (M)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceMin}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs focus:border-red-600 outline-none"
                            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceMax}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs focus:border-red-600 outline-none"
                            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Kilometraje */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Km</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.kmMin}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs focus:border-red-600 outline-none"
                            onChange={(e) => setFilters({ ...filters, kmMin: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.kmMax}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs focus:border-red-600 outline-none"
                            onChange={(e) => setFilters({ ...filters, kmMax: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Combustible y Transmisión */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Combustible</label>
                          <select
                            value={filters.combustible}
                            onChange={(e) => setFilters({ ...filters, combustible: e.target.value })}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs text-white focus:border-red-600"
                          >
                            <option value="Todos">Todos</option>
                            <option value="Gasolina">Gasolina</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Eléctrico">Eléctrico</option>
                            <option value="Híbrido">Híbrido</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Transmisión</label>
                          <select
                            value={filters.transmision}
                            onChange={(e) => setFilters({ ...filters, transmision: e.target.value })}
                            className="w-full bg-black border border-gray-800 rounded-lg py-1.5 px-2 text-xs text-white focus:border-red-600"
                          >
                            <option value="Todas">Todas</option>
                            <option value="Automática">Auto</option>
                            <option value="Mecánica">Manual</option>
                          </select>
                        </div>
                      </div>

                      {/* Checkboxes compactos */}
                      <div className="pt-2 border-t border-gray-800">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Características</label>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Tracción 4x4 */}
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.traccion === '4x4'}
                              onChange={(e) => setFilters({ ...filters, traccion: e.target.checked ? '4x4' : 'Todas' })}
                              className="w-4 h-4 rounded border-gray-700 bg-black text-red-600 focus:ring-red-600 focus:ring-offset-0"
                            />
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">4x4</span>
                          </label>

                          {/* Aire */}
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.aire === 'Si'}
                              onChange={(e) => setFilters({ ...filters, aire: e.target.checked ? 'Si' : 'Todos' })}
                              className="w-4 h-4 rounded border-gray-700 bg-black text-red-600 focus:ring-red-600 focus:ring-offset-0"
                            />
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">A/C</span>
                          </label>

                          {/* Financiable */}
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.financiable === 'Si'}
                              onChange={(e) => setFilters({ ...filters, financiable: e.target.checked ? 'Si' : 'Todos' })}
                              className="w-4 h-4 rounded border-gray-700 bg-black text-red-600 focus:ring-red-600 focus:ring-offset-0"
                            />
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Financ.</span>
                          </label>

                          {/* Propio */}
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.tipoVenta === 'Propio'}
                              onChange={(e) => setFilters({ ...filters, tipoVenta: e.target.checked ? 'Propio' : 'Todos' })}
                              className="w-4 h-4 rounded border-gray-700 bg-black text-red-600 focus:ring-red-600 focus:ring-offset-0"
                            />
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Propio</span>
                          </label>
                        </div>
                      </div>

                      {/* Botón Limpiar */}
                      <button
                        onClick={clearAllFilters}
                        className="w-full mt-3 bg-red-600/10 hover:bg-red-600/20 border border-red-900/30 text-red-400 font-bold py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2"
                      >
                        <X size={14} />
                        Limpiar Filtros
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* COLUMNA DERECHA: GRILLA DE AUTOS */}
              <motion.div
                key="catalog-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-grow"
              >
                <div className="mb-6 flex justify-between items-end">
                  <p className="text-gray-400 text-sm font-medium">
                    Mostrando <span className="text-white font-bold">{filteredStock.length}</span> vehículos
                  </p>
                </div>

                {filteredStock.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {filteredStock.map((car, i) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <CarCard
                          car={car}
                          onClick={setSelectedCar}
                          isFavorite={favorites.includes(car.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-900/30 rounded-[3rem] border border-dashed border-gray-800">
                    <Search size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-xl font-bold text-gray-400">No encontramos lo que buscas</p>
                    <button onClick={clearAllFilters} className="mt-4 text-red-500 font-bold hover:underline">Ver todo el stock</button>
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            /* VISTA PORTAL VENDEDOR (Ancho completo) */
            <motion.div
              key="seller"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pt-10"
            >
              <SellerPortal
                stock={stock}
                onBack={() => setCurrentView('catalog')}
                onAdd={(car) => { handleAddCar(car); setCurrentView('catalog'); }}
                onUpdate={(updated) => {
                  setStock(prev => prev.map(s => s.id === updated.id ? { ...updated, precioHistorial: updated.precio !== s.precio ? [...(s.precioHistorial || []), { date: new Date().toISOString().split('T')[0], price: updated.precio }] : s.precioHistorial } : s));
                }}
                onDelete={(id) => setStock(prev => prev.filter(s => s.id !== id))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modales y Notificaciones */}
      <AnimatePresence>
        {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} onContact={handleContact} />}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 right-10 z-[100] bg-[#25D366] text-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20"
          >
            <MessageCircle size={28} />
            <div>
              <p className="font-black leading-none">{notification.message}</p>
              <p className="text-xs opacity-80 mt-1">{notification.sub}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
      .text-glow { text-shadow: 0 0 40px rgba(220, 38, 38, 0.6); }
      select { 
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); 
        background-position: right 1rem center; 
        background-repeat: no-repeat; 
        background-size: 1.25rem; 
        appearance: none; 
      }
      /* Custom scrollbar para el sidebar si es muy largo */
     .sticky {
  max-height: none;
  overflow-y: visible;
}
    `}</style>
    </div>
  );
}

export default App;