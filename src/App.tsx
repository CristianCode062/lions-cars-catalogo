import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Car, Calendar, Gauge, Fuel, Settings2, 
   Search, X, MessageCircle, ChevronRight,
   Filter, Heart, Share2, LayoutDashboard, ArrowLeft, 
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// --- IMPORTACIÓN DEL COMPONENTE VENDEDOR ---
import SellerPortal from './components/SellerPortal';

// --- UTILIDADES Y TIPOS ---

const createImageArray = (folder: string, count: number) => {
  const normFolder = folder.toLowerCase().replace(/[^a-z0-9-_]/g, '').replace(/\s+/g, '-');
  return Array.from({ length: count }, (_, i) => `/autoefec/${normFolder}/${i + 1}.jpg`);
};

// NUEVA INTERFAZ PARA LOS PUNTOS DE INTERÉS
export interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  detail: string;
}

export interface Vehiculo {
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
  imagen?: string;
  hotspots?: Hotspot[]; // Campo nuevo para guardar los puntos
}

interface CarCardProps {
  car: Vehiculo;
  onClick: (c: Vehiculo) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: number) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price || 0);

// --- DATOS INICIALES COMPLETOS ---

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

// --- LOGICA DE PERSISTENCIA ---
const LOCAL_STORAGE_KEY = 'autos_catalogo_stock';

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
        return {
          ...car,
          imagenes: imagenesArray,
          hotspots: car.hotspots || []
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

// --- ANIMATION VARIANTS ---

const containerStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, 
      delayChildren: 0.1,
    }
  },
  exit: { opacity: 0 }
};

const fadeInUpSpring: Variants = {
  hidden: { y: 30, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: { y: -20, opacity: 0 }
};

const pageTransitionVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: "easeIn" } }
};


// --- COMPONENTES AUXILIARES ---

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
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
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
              backgroundColor: currentIndex === idx ? '#dc2626' : 'rgba(255,255,255,0.5)',
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            className="h-1.5 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

const CarCard = ({ car, onClick, isFavorite, onToggleFavorite }: CarCardProps) => {
  if (!car) return null;

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(220, 38, 38, 0.25)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => onClick(car)}
      className="group bg-[#121212] border border-white/5 rounded-[24px] overflow-hidden cursor-pointer flex flex-col h-full relative transition-colors duration-300"
    >
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

      <motion.button
        whileTap={{ scale: 0.8, rotate: -15 }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation(); 
          onToggleFavorite(e, car.id);
        }}
        className="absolute top-3 right-3 z-30 p-2.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all border border-white/10 shadow-lg"
      >
        <Heart 
          size={18} 
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-300"} 
        />
      </motion.button>

      <div className="relative h-60 overflow-hidden bg-zinc-900">
        <AutoCarousel
          images={Array.isArray(car.imagenes) && car.imagenes.length > 0
            ? car.imagenes
            : ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"]}
        />
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

      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
        <div className="mb-5">
          <h3 className="text-zinc-100 font-bold text-xl leading-tight group-hover:text-red-500 transition-colors">
            {car.modelo}
          </h3>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1 opacity-70">
            {car.version}
          </p>
        </div>

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
           
          <motion.span 
            className="text-red-500 text-[11px] font-black uppercase flex items-center gap-1.5 bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20"
            whileHover={{ x: 3, backgroundColor: "rgba(220, 38, 38, 0.15)" }}
          >
            Ficha <ChevronRight size={14} />
          </motion.span>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[24px] border-2 border-white/0 group-hover:border-red-600/30 transition-all duration-500" />
    </motion.div>
  );
};

// --- NUEVO COMPONENTE CAR MODAL BIOMÉTRICO (REEMPLAZO) ---

const DecryptText = ({ text, className, speed = 50 }: { text: string, className?: string, speed?: number }) => {
  const [display, setDisplay] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplay(text.split('').map((char, index) => {
        if (index < i) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
       
      if (i >= text.length) clearInterval(timer);
      i += 1 / 3;
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className={className}>{display}</span>;
};

const CarModal = ({ car, onClose, onContact }: { car: Vehiculo; onClose: () => void; onContact: (c: Vehiculo) => void }) => {
  const [bootSequence, setBootSequence] = useState(true);
  const [techOpen, setTechOpen] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  // Mapear datos del auto a formato "Specs" del modal tecnológico
  const carSpecs = useMemo(() => [
    { title: "MOTORIZACIÓN", value: car.cilindrada || "N/A", progress: 85 },
    { title: "TRANSMISIÓN", value: car.transmision, meta: "RESPUESTA: 0.002s" },
    { title: "TRACCIÓN", value: car.traccion || "Delantera", meta: "STATUS: NOMINAL" },
    { title: "KILOMETRAJE", value: `${car.km.toLocaleString()} KM`, progress: Math.max(0, 100 - (car.km / 2000)) },
    { title: "COMBUSTIBLE", value: car.combustible, meta: "EFICIENCIA: ALTA" },
  ], [car]);

  useEffect(() => {
    const timer = setTimeout(() => setBootSequence(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
      setCoords({ x: Math.round(x), y: Math.round(y) });
    }

    if (zoomActive && lensRef.current) {
      const lens = lensRef.current;
      const ratio = 2.5;
       
      requestAnimationFrame(() => {
        lens.style.transform = `translate(${e.clientX - 75}px, ${e.clientY - 75}px)`;
        lens.style.backgroundImage = `url(${car.imagenes[currentImgIdx]})`;
        lens.style.backgroundSize = `${rect.width * ratio}px ${rect.height * ratio}px`;
        lens.style.backgroundPosition = `-${x * ratio - 75}px -${y * ratio - 75}px`;
      });
    }
  }, [zoomActive, currentImgIdx, car.imagenes]);

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 font-mono overflow-hidden"
    >
      <style>{`
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes glitch { 0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
         
        .grid-bg {
          background-image: linear-gradient(rgba(255, 0, 60, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 0, 60, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .scanner-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff003c, transparent);
          box-shadow: 0 0 20px #ff003c;
          animation: scan 3s linear infinite;
        }
        .glitch-effect:hover { animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite; }
         
        .tech-scroll::-webkit-scrollbar { width: 4px; }
        .tech-scroll::-webkit-scrollbar-track { background: #0a0a0c; }
        .tech-scroll::-webkit-scrollbar-thumb { background: #333; }
        .tech-scroll::-webkit-scrollbar-thumb:hover { background: #ff003c; }
      `}</style>

      {/* Grid de Fondo */}
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      <div className="scanner-line fixed top-0 left-0 w-full pointer-events-none z-40" />

      {/* SECUENCIA DE ARRANQUE */}
      <AnimatePresence>
      {bootSequence ? (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-black z-[60]"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-t-red-600 border-r-transparent border-b-red-600 border-l-transparent rounded-full animate-spin mx-auto"/>
            <div className="text-red-500 text-xs tracking-[0.5em] animate-pulse">INITIALIZING SECURE PROTOCOL...</div>
            <div className="text-gray-600 text-[10px] font-mono">
              LOADING ASSETS... 98%<br/>
              VERIFYING BIOMETRICS... OK
            </div>
          </div>
        </motion.div>
      ) : null}
      </AnimatePresence>

      {/* CONTENEDOR PRINCIPAL DEL MODAL */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        className="relative w-full max-w-[1400px] h-[90vh] bg-[#0a0a0c] border border-white/10 rounded-sm shadow-[0_0_100px_rgba(255,0,60,0.1)] flex flex-col overflow-hidden z-10"
      >
        
        {/* HEADER TÉCNICO */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/80 backdrop-blur-sm select-none">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
               <div className="w-1 h-4 bg-red-600 animate-pulse" />
               <div className="w-1 h-4 bg-red-600/50" />
            </div>
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
              System: <span className="text-white font-bold">ONLINE</span> // Mode: <span className="text-red-500">ACQUISITION</span>
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="group flex items-center gap-2 px-4 py-1 border border-red-900/30 hover:border-red-600 hover:bg-red-600/10 transition-all"
          >
            <span className="text-[10px] text-red-500 group-hover:text-white">TERMINATE SESSION</span>
            <span className="text-red-500 group-hover:text-white">✕</span>
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          
          {/* SIDEBAR TÉCNICO (Colapsable) - Usamos motion.div para la transición */}
          <motion.div 
            initial={false}
            animate={{ x: techOpen ? 0 : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-y-0 left-0 w-80 z-30 bg-[#08080a]/95 border-r border-red-900/30 backdrop-blur-xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-red-500 font-bold text-xs tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"/> DATOS TÉCNICOS
              </h3>
              <button onClick={() => setTechOpen(false)} className="text-gray-500 hover:text-white transition">←</button>
            </div>
             
            {/* Usamos staggerContainer para que los items aparezcan uno por uno */}
            <motion.div 
                variants={containerStagger}
                initial="hidden"
                animate={techOpen ? "show" : "hidden"}
                className="flex-1 overflow-y-auto p-6 space-y-6 tech-scroll"
            >
              {carSpecs.map((spec, i) => (
                <motion.div key={i} variants={fadeInUpSpring} className="p-4 border border-white/5 bg-white/5 hover:border-red-500/30 transition-colors rounded-sm">
                  <p className="text-[9px] text-red-400 mb-1 uppercase tracking-widest font-bold">{spec.title}</p>
                  <p className="text-white text-sm font-bold tracking-tighter">{spec.value}</p>
                  {spec.progress && (
                    <div className="w-full bg-black h-1 mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${spec.progress}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="bg-red-600 h-full shadow-[0_0_10px_#ff003c]" 
                       />
                    </div>
                  )}
                  {spec.meta && <p className="text-[8px] text-gray-500 mt-2 font-mono border-t border-white/5 pt-1">{spec.meta}</p>}
                </motion.div>
              ))}
              
              <motion.div variants={fadeInUpSpring} className="p-4 border border-white/5 bg-white/5">
                 <p className="text-[9px] text-red-400 mb-1 uppercase tracking-widest font-bold">OBSERVACIONES</p>
                 <p className="text-[10px] text-gray-400 italic">"{car.obs}"</p>
              </motion.div>
            </motion.div>

            <div className="p-6 border-t border-white/5">
              <div className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white p-1">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${car.id}`} alt="QR" className="w-full h-full" />
                </div>
                <div className="text-[8px] text-gray-400 leading-tight font-mono">
                  CERTIFICADO DIGITAL<br/>
                  BLOCKCHAIN ID:<br/>
                  <span className="text-white">0x{car.id.toString(16).padEnd(8,'0')}...</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* VISOR CENTRAL */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={`flex-1 relative flex items-center justify-center bg-[#050505] overflow-hidden ${zoomActive ? 'cursor-none' : 'cursor-crosshair'}`}
          >
            {/* Lente de Zoom Optimizada */}
            <div 
              ref={lensRef}
              className={`fixed w-[180px] h-[180px] border-2 border-red-500 rounded-full pointer-events-none z-50 shadow-[0_0_30px_rgba(255,0,60,0.3)] overflow-hidden bg-black ${zoomActive ? 'block' : 'hidden'}`}
              style={{ backgroundRepeat: 'no-repeat', top: 0, left: 0 }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-full h-[1px] bg-red-500"/>
                <div className="h-full w-[1px] bg-red-500 absolute"/>
              </div>
            </div>

            <div className="relative group perspective-1000">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImgIdx}
                  ref={imageRef}
                  src={car.imagenes[currentImgIdx] || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200"}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  alt="Vehicle Analysis" 
                  className="max-w-full max-h-[70vh] object-contain rounded-sm border border-white/5 shadow-2xl"
                />
              </AnimatePresence>
              
              {/* Hotspots Inteligentes REALES (Solo se muestran si no hay zoom activo) */}
              {!zoomActive && car.hotspots && car.hotspots.length > 0 && car.hotspots.map((spot, idx) => (
                <div
                  key={spot.id}
                  className="absolute cursor-pointer z-30" // Aseguramos z-index
                  // Usamos porcentajes para la posición
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + (idx * 0.2), type: "spring" }}
                    className="relative group/hot"
                    // Centramos el punto exacto en la coordenada
                    style={{ transform: 'translate(-50%, -50%)' }}
                  >
                    {/* El punto rojo pulsante */}
                    <div className="w-6 h-6 bg-red-600/30 border-2 border-red-500 rounded-full flex items-center justify-center animate-pulse hover:bg-red-600/50 transition-colors">
                      <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </div>

                    {/* Tooltip Conector */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 w-64 hidden group-hover/hot:block z-40 pointer-events-none">
                      <div className="flex items-center">
                        <motion.div initial={{ width: 0 }} animate={{ width: 40 }} className="h-[2px] bg-gradient-to-r from-red-500 to-red-500/10"></motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-black/90 border-l-[3px] border-red-500 p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex-1 rounded-r-sm relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-4 bg-red-500/10 blur-xl rounded-full"></div>
                          <p className="text-[10px] text-red-500 font-black mb-1 tracking-[0.2em] uppercase relative z-10">{spot.label}</p>
                          <p className="text-sm text-white font-bold leading-tight relative z-10">{spot.detail}</p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* HUD Central Inferior */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setTechOpen(!techOpen)}
                className={`px-8 py-3 bg-black/50 border border-white/20 text-white text-[10px] font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all uppercase ${techOpen ? 'bg-white text-black' : ''}`}
              >
                Ficha Técnica
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setZoomActive(!zoomActive)}
                className={`px-8 py-3 border text-[10px] font-bold tracking-[0.2em] transition-all uppercase flex items-center gap-2 ${zoomActive ? 'bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-black/50 border-white/20 text-gray-400 hover:border-red-500 hover:text-white'}`}
              >
                <span className={`w-2 h-2 rounded-full ${zoomActive ? 'bg-white animate-pulse' : 'bg-gray-500'}`} />
                Zoom Precisión
              </motion.button>
            </div>

            {/* Navegación de Galería Simple */}
            {car.imagenes.length > 1 && (
               <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                  {car.imagenes.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentImgIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all ${currentImgIdx === i ? 'bg-red-600 scale-150' : 'bg-white/20 hover:bg-white'}`}
                      />
                  ))}
               </div>
            )}
          </div>

          {/* PANEL DERECHO: DATOS Y FINANZAS */}
          {/* Stagger para los elementos del panel derecho */}
          <motion.aside 
            variants={containerStagger}
            initial="hidden"
            animate="show"
            className="w-[400px] bg-black border-l border-white/10 p-8 flex flex-col justify-between overflow-y-auto z-20"
          >
            <div>
              <motion.div variants={fadeInUpSpring}>
                <DecryptText 
                    text={car.marca} 
                    className="text-4xl font-black italic tracking-tighter text-white mb-1 block glitch-effect" 
                />
              </motion.div>
              <motion.p variants={fadeInUpSpring} className="text-[10px] text-red-600 tracking-[0.4em] font-bold mb-10 uppercase border-b border-red-900/30 pb-4">
                {car.modelo} {car.version}
              </motion.p>
              
              {/* Banner de Finanzas Animado */}
              <motion.div variants={fadeInUpSpring} className="relative p-8 mb-10 text-center border border-white/10 bg-[#050505] overflow-hidden group hover:border-red-600/50 transition-colors">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="relative z-10 text-[9px] text-red-500 tracking-[0.3em] mb-4 font-bold uppercase">Plan High-Impact</p>
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  <span className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,0,60,0.5)]">
                    24
                  </span>
                  <div className="text-left leading-none">
                    <p className="text-xl font-bold text-white uppercase italic">Cuotas</p>
                    <p className="text-[9px] text-gray-500 uppercase mt-1">Sin Interés*</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
              </motion.div>

              <motion.div variants={containerStagger} className="space-y-6">
                <motion.div variants={fadeInUpSpring} className="flex justify-between items-end border-b border-white/5 pb-6">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Valor Unidad</p>
                    <p className="text-3xl font-bold text-white tracking-tight">{formatPrice(car.precio)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="text-lg font-bold text-white uppercase">{car.estado || 'Disponible'}</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div variants={containerStagger} className="space-y-3 mt-4">
              <motion.button 
                variants={fadeInUpSpring}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onContact(car)}
                className="relative w-full py-5 bg-red-600 overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative text-white font-black italic tracking-widest text-xs uppercase flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Iniciar Protocolo Reserva
                </span>
              </motion.button>
              
              <motion.button 
                variants={fadeInUpSpring}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(34, 197, 94, 0.1)" }} whileTap={{ scale: 0.98 }}
                onClick={() => onContact(car)}
                className="w-full py-4 flex items-center justify-center gap-3 border border-green-500/30 text-green-500 font-bold tracking-widest text-[10px] uppercase transition-all hover:border-green-500"
              >
                <span>◆</span> Contacto Quántico
              </motion.button>
            </motion.div>
          </motion.aside>
        </div>

        {/* FOOTER BARRA DE ESTADO */}
        <footer className="px-6 py-2 bg-[#050505] border-t border-white/10 flex justify-between items-center text-[9px] text-gray-600 uppercase tracking-widest select-none">
          <div className="flex space-x-8">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
              NET: 12ms
            </span>
            <span className="text-red-900/80">SECURE_TUNNEL_V2</span>
            <span className="font-mono text-gray-500">
              X:{coords.x.toString().padStart(4, '0')} Y:{coords.y.toString().padStart(4, '0')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>INTEGRIDAD DE DATOS</span>
            <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "98%" }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-red-600 shadow-[0_0_10px_red]" 
               />
            </div>
            <span className="text-white">98%</span>
          </div>
        </footer>
      </motion.div>
    </motion.div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Branding */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
                <Car className="text-white" size={24} />
              </div>
              <span className="text-white font-black text-2xl tracking-tighter uppercase">
                Auto<span className="text-red-600">Efec</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Tu destino premium para la compra y venta de vehículos. Calidad garantizada y financiamiento a tu medida.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navegación</h4>
            <ul className="space-y-4">
              {['Catálogo', 'Vender mi Auto', 'Financiamiento', 'Seguros'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-zinc-500 hover:text-red-500 text-sm transition-colors flex items-center gap-2 group">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-red-500" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto Directo */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-zinc-500 text-sm">
                <MessageCircle size={18} className="text-red-600" />
                +56 9 1234 5678
              </li>
              <li className="flex items-center gap-3 text-zinc-500 text-sm">
                <Search size={18} className="text-red-600" />
                contacto@autoefec.cl
              </li>
            </ul>
          </div>

          {/* Columna 4: Horario (Importante para ventas) */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Horarios</h4>
            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Lun - Vie:</span>
                <span className="text-zinc-200">09:00 - 19:00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Sábados:</span>
                <span className="text-zinc-200">10:00 - 14:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
            © 2026 AUTOEFEC - CATÁLOGO PROFESIONAL
          </p>
          <div className="flex gap-6">
            <motion.div whileHover={{ scale: 1.2, color: "#dc2626" }} className="text-zinc-600 cursor-pointer">
                <Share2 size={16} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.2, color: "#dc2626" }} className="text-zinc-600 cursor-pointer">
                <Heart size={16} />
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  const [stock, setStock] = useState<Vehiculo[]>(() => loadStockFromLocalStorage());
  const [selectedSeller, setSelectedSeller] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCar, setSelectedCar] = useState<Vehiculo | null>(null);
  const [notification, setNotification] = useState<{ message: string; sub: string } | null>(null);
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

  // --- LÓGICA DE ACTUALIZACIÓN DEL STOCK ---

  // Agregar Auto
  const handleAddCar = (car: Vehiculo) => {
    console.log('🚗 Nuevo auto recibido:', car);
    if (!car.imagenes || car.imagenes.length === 0) {
      console.warn('⚠️ No se recibieron imágenes, usando placeholder');
      car.imagenes = ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"];
    }

    setStock((prev) => {
      const updated = [car, ...prev];
      saveStockToLocalStorage(updated);
      return updated;
    });
  };

  // Actualizar Auto (NUEVO - REQUERIDO POR SellerPortal)
  const handleUpdateCar = (updatedCar: Vehiculo) => {
    setStock((prev) => {
      const updated = prev.map(car => car.id === updatedCar.id ? updatedCar : car);
      saveStockToLocalStorage(updated);
      return updated;
    });
    console.log('✅ Auto actualizado:', updatedCar.id);
  };

  // Eliminar Auto (NUEVO - REQUERIDO POR SellerPortal)
  const handleDeleteCar = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este vehículo?')) {
        setStock((prev) => {
            const updated = prev.filter(car => car.id !== id);
            saveStockToLocalStorage(updated);
            return updated;
        });
        console.log('🗑️ Auto eliminado:', id);
    }
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
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-red-600/30 overflow-x-hidden">
      <div className="relative">
        {/* Header Superior */}
        <motion.header
          // Animación Premium: Entrada del header con spring
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                <motion.button 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Favoritos <motion.span key={favorites.length} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{favorites.length}</motion.span>
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: currentView === 'catalog' ? "#dc2626" : "rgba(31, 41, 55, 0.8)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(currentView === 'catalog' ? 'seller' : 'catalog')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg ${currentView === 'catalog'
                    ? 'bg-white text-black hover:text-white'
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

        {/* Hero Section - Con slogan */}
{currentView === 'catalog' && (
  <div className="relative h-[350px] w-full overflow-hidden flex items-center justify-center">
    {/* Fondo Parallax sutil */}
    <motion.div 
      className="absolute inset-0 z-0"
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      transition={{ duration: 10, ease: "easeOut" }} // Movimiento muy lento y suave
    >
      <img src="/DSC06884.JPG" className="w-full h-full object-cover opacity-40" alt="Background" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
    </motion.div>
    
    {/* Contenido del Héroe con Stagger */}
    <motion.div 
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-4 max-w-4xl"
    >
      <motion.h1 variants={fadeInUpSpring} className="text-6xl md:text-8xl font-black italic text-white tracking-tighter mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
        AUTO<span className="text-red-600 text-glow">EFEC</span>
      </motion.h1>
      <motion.div variants={fadeInUpSpring} className="h-1 w-32 bg-red-600 mx-auto mb-6 rounded-full" />
      
      <motion.p variants={fadeInUpSpring} className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
        Tu Auto Ideal Te Está Esperando
      </motion.p>
      
      <motion.p variants={fadeInUpSpring} className="text-gray-300 text-base md:text-lg font-medium drop-shadow-md max-w-2xl mx-auto">
        Vehículos seleccionados con garantía y financiamiento disponible. 
        <span className="text-red-500 font-bold"> Más de 15 años</span> conectando familias con su auto perfecto.
      </motion.p>

      <motion.div variants={containerStagger} className="flex items-center justify-center gap-4 mt-6 flex-wrap">
         {["Garantía Incluida", "Financiamiento Fácil", "Revisión Técnica"].map((text, i) => (
             <motion.div key={i} variants={fadeInUpSpring} className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                <p className="text-xs font-bold text-white">✓ {text}</p>
             </motion.div>
         ))}
      </motion.div>
    </motion.div>

    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-900/20 blur-[120px] pointer-events-none"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.4, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
)}
      </div>

      {/* CUERPO PRINCIPAL CON TRANSICIONES ENTRE VISTAS */}
      <main className="w-full px-6 pb-20 min-h-[600px]">
        <AnimatePresence mode="wait">
          {currentView === 'catalog' ? (
            // Animación Premium: Transición de página (Slide In/Out)
            <motion.div
                key="catalog-view"
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col md:flex-row gap-8"
            >

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

                      {/* Botón Limpiar con micro-interacción */}
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(220, 38, 38, 0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearAllFilters}
                        className="w-full mt-3 bg-red-600/10 border border-red-900/30 text-red-400 font-bold py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2"
                      >
                        <X size={14} />
                        Limpiar Filtros
                      </motion.button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* COLUMNA DERECHA: GRILLA DE AUTOS */}
              <div className="flex-grow">
                <div className="mb-6 flex justify-between items-end">
                  <p className="text-gray-400 text-sm font-medium">
                    Mostrando <span className="text-white font-bold">{filteredStock.length}</span> vehículos
                  </p>
                </div>

                {filteredStock.length > 0 ? (
                  // Animación Premium: Staggered Grid (Aparición en cascada)
                  <motion.div 
                    variants={containerStagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6"
                  >
                    {filteredStock.map((car) => (
                      <motion.div key={car.id} variants={fadeInUpSpring}>
                        <CarCard
                          car={car}
                          onClick={setSelectedCar}
                          isFavorite={favorites.includes(car.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-gray-900/30 rounded-[3rem] border border-dashed border-gray-800">
                    <Search size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-xl font-bold text-gray-400">No encontramos lo que buscas</p>
                    <button onClick={clearAllFilters} className="mt-4 text-red-500 font-bold hover:underline">Ver todo el stock</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
             // VISTA DE VENDEDOR REAL (INTEGRADA)
             <motion.div
                key="seller-view"
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
             >
                <SellerPortal 
                  stock={stock} 
                  onAdd={handleAddCar} 
                  onUpdate={handleUpdateCar} 
                  onDelete={handleDeleteCar} 
                  onBack={() => setCurrentView('catalog')}
                />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/* --- INICIO DEL FOOTER --- */}
      <Footer />
      {/* --- FIN DEL FOOTER --- */}

      {/* Modales y Notificaciones con AnimatePresence */}
      <AnimatePresence>
        {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} onContact={handleContact} />}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          // Animación Premium: Notificación con entrada tipo resorte
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
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