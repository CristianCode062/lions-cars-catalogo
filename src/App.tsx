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
    id: 8, marca: "BMW", modelo: "Serie 3", version: "Progressive",
    ano: 2014, precio: 24900000, km: 38000, duenos: 1, traccion: "Delantera",
    transmision: "Automática 7G-DCT", cilindrada: "1.3L Turbo", combustible: "Gasolina",
    tipoVenta: "Propio", vendedor: "Alex Hernandez", financiable: true, valorPie: 8000000,
    aire: true, neumaticos: "Originales", llaves: 2,
    obs: "Elegancia y tecnología. Sistema MBUX con comando de voz. Estado inmaculado.",
    imagenes: createImageArray("BMW", 8)
  },
  {
    id: 9, marca: "TOYOTA-HILUX- 4X4", modelo: "Frontier", version: "GT AWD",
    ano: 2022, precio: 9490000, km: 25000, duenos: 1, traccion: "AWD",
    transmision: "Automática 6V", cilindrada: "2.5L Skyactiv", combustible: "Gasolina",
    tipoVenta: "Consignado", vendedor: "Roberto Diaz", financiable: true, valorPie: 9000000,
    aire: true, neumaticos: "Buen estado", llaves: 2,
    obs: "SUV familiar seguro y confiable. Audio Bose, Head-up display y cuero nappa.",
    imagenes: createImageArray("TOYOTA-HILUX- 4X4", 7)
  },
  {
    id: 10, marca: "VOLKSWAGEN-SAVEIRO", modelo: "Discovery", version: "Limited EyeSight",
    ano: 2023, precio: 13990000, km: 12000, duenos: 1, traccion: "Symmetrical AWD",
    transmision: "CVT Lineartronic", cilindrada: "2.5L Boxer", combustible: "Gasolina",
    tipoVenta: "Propio", vendedor: "Alex Hernandez", financiable: true, valorPie: 9500000,
    aire: true, neumaticos: "Nuevos", llaves: 2,
    obs: "Prácticamente nuevo. El mejor sistema de seguridad del mercado. Techo panorámico.",
    imagenes: createImageArray("VOLKSWAGEN-SAVEIRO", 8)
  },
  {
    id: 11, marca: "Audi", modelo: "Q3", version: "Limited",
    ano: 2023, precio: 11990000, km: 12000, duenos: 1, traccion: "AWD",
    transmision: "CVT", cilindrada: "2.5L", combustible: "Gasolina",
    tipoVenta: "Propio", vendedor: "Alex Hernandez", financiable: true, valorPie: 9500000,
    aire: true, neumaticos: "Nuevos", llaves: 2,
    obs: "Prácticamente nuevo. Sistema de seguridad avanzado. Techo panorámico.",
    imagenes: createImageArray("2013-Audi-q3", 7)
  },
  {
    id: 12, marca: "Ford", modelo: "Ranger", version: "Limited",
    ano: 2023, precio: 28990000, km: 12000, duenos: 1, traccion: "4x4",
    transmision: "Automática", cilindrada: "2.5L", combustible: "Gasolina",
    tipoVenta: "Propio", vendedor: "Alex Hernandez", financiable: true, valorPie: 9500000,
    aire: true, neumaticos: "Nuevos", llaves: 2,
    obs: "Prácticamente nuevo. El mejor sistema de seguridad. Techo panorámico gigante.",
    imagenes: createImageArray("2024-Ford-ranger", 8)
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

const CarCard = ({ car, onClick, isFavorite, onToggleFavorite }: {
  car: Vehiculo;
  onClick: (c: Vehiculo) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: number) => void;
}) => {
  console.log(`🎴 Card ${car.marca} ${car.modelo} - Imágenes:`, car.imagenes?.length || 0, car.imagenes);
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => onClick(car)}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-900/10 flex flex-col h-full relative"
    >
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${car.tipoVenta === 'Propio'
            ? 'bg-red-600 text-white border border-red-500'
            : 'bg-gray-800 text-white border border-gray-700'
          }`}>
          {car.tipoVenta}
        </span>
      </div>

      <button
        onClick={(e) => onToggleFavorite(e, car.id)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-gray-800 transition-colors shadow-lg"
      >
        <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} />
      </button>

      <div className="relative h-56 overflow-hidden bg-gray-100">
        <AutoCarousel
          images={(() => {
            const imgs = Array.isArray(car.imagenes) && car.imagenes.length > 0
              ? car.imagenes
              : ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"];
            console.log(`🎠 AutoCarousel de ${car.marca} ${car.modelo} recibe:`, imgs.length, 'imágenes');
            return imgs;
          })()}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

        <div className="absolute bottom-4 left-4">
          <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-0.5">{car.marca}</p>
          <p className="text-white font-bold text-2xl drop-shadow-lg tracking-tight">{formatPrice(car.precio)}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow bg-white">
        <div className="mb-4">
          <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-red-600 transition-colors">{car.modelo}</h3>
          <p className="text-gray-600 text-sm font-medium">{car.version}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 text-xs text-gray-600 mb-5">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-red-600" />
            <span>{car.ano}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={14} className="text-red-600" />
            <span>{car.km.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel size={14} className="text-red-600" />
            <span>{car.combustible}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings2 size={14} className="text-red-600" />
            <span>{car.transmision}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-red-600 font-bold border border-gray-200">
              {car.vendedor.charAt(0)}
            </div>
            {car.vendedor.split(' ')[0]}
          </div>
          <span className="text-red-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-red-50 px-2 py-1 rounded">
            Ver Ficha <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const CarModal = ({ car, onClose, onContact }: { car: Vehiculo; onClose: () => void; onContact: (c: Vehiculo) => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                className="w-full h-full object-cover"
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


// HERO VISUAL: Banner animado con imágenes destacadas

function App() {
  const [stock, setStock] = useState<Vehiculo[]>(() => loadStockFromLocalStorage());
  const [selectedSeller, setSelectedSeller] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCar, setSelectedCar] = useState<Vehiculo | null>(null);
  const [notification, setNotification] = useState<{ message: string; sub: string } | null>(null);
  // Eliminada lógica de edición/eliminación de autos
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState<'catalog' | 'seller'>('catalog');

  const [filters, setFilters] = useState({
    marca: 'Todas',
    yearMin: '',
    yearMax: '',
    priceMin: '',
    priceMax: '',
    kmMax: '',
    combustible: 'Todos',
    transmision: 'Todas',
    traccion: 'Todas',
    tipoVenta: 'Todos',
    financiable: 'Todos'
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
  const combustibles = useMemo(() => ['Todos', ...Array.from(new Set(stock.map(c => c.combustible)))], [stock]);
  const tracciones = useMemo(() => ['Todas', ...Array.from(new Set(stock.map(c => c.traccion)))], [stock]);

  const filteredStock = useMemo(() => {
    return stock.filter(car => {
      const matchSeller = selectedSeller === 'Todos' || car.vendedor === selectedSeller;

      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        car.marca.toLowerCase().includes(searchLower) ||
        car.modelo.toLowerCase().includes(searchLower) ||
        car.ano.toString().includes(searchLower);

      const matchMarca = filters.marca === 'Todas' || car.marca === filters.marca;
      const matchYearMin = !filters.yearMin || car.ano >= parseInt(filters.yearMin);
      const matchYearMax = !filters.yearMax || car.ano <= parseInt(filters.yearMax);
      const matchPriceMin = !filters.priceMin || car.precio >= parseInt(filters.priceMin);
      const matchPriceMax = !filters.priceMax || car.precio <= parseInt(filters.priceMax);
      const matchKm = !filters.kmMax || car.km <= parseInt(filters.kmMax);
      const matchCombustible = filters.combustible === 'Todos' || car.combustible === filters.combustible;
      const matchTransmision = filters.transmision === 'Todas' || car.transmision.includes(filters.transmision);
      const matchTraccion = filters.traccion === 'Todas' || car.traccion === filters.traccion;
      const matchTipoVenta = filters.tipoVenta === 'Todos' || car.tipoVenta === filters.tipoVenta;
      const matchFinanciable = filters.financiable === 'Todos' ||
        (filters.financiable === 'Si' ? car.financiable : !car.financiable);

      return matchSeller && matchSearch && matchMarca && matchYearMin && matchYearMax &&
        matchPriceMin && matchPriceMax && matchKm && matchCombustible &&
        matchTransmision && matchTraccion && matchTipoVenta && matchFinanciable;
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
      kmMax: '',
      combustible: 'Todos',
      transmision: 'Todas',
      traccion: 'Todas',
      tipoVenta: 'Todos',
      financiable: 'Todos'
    });
    setSearchTerm('');
    setSelectedSeller('Todos');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.marca !== 'Todas') count++;
    if (filters.yearMin || filters.yearMax) count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.kmMax) count++;
    if (filters.combustible !== 'Todos') count++;
    if (filters.transmision !== 'Todas') count++;
    if (filters.traccion !== 'Todas') count++;
    if (filters.tipoVenta !== 'Todos') count++;
    if (filters.financiable !== 'Todos') count++;
    if (searchTerm) count++;
    if (selectedSeller !== 'Todos') count++;
    return count;
  }, [filters, searchTerm, selectedSeller]);



  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      <div className="relative">
        <div className="absolute inset-0 h-[500px] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/60 via-black to-black"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-gray-800 shadow-lg shadow-black/30"
        >
          <div className="max-w-xl mx-auto px-4 h-20 flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentView('catalog')}
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative"
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-800/20 blur-xl group-hover:blur-2xl transition-all rounded-full" />
                <img
                  src="/logos/autoefec.png"
                  alt="Autoefec Logo"
                  className="h-20 w-auto relative z-10 drop-shadow-2xl group-hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='56' viewBox='0 0 120 56'%3E%3Ctext x='10' y='40' font-size='32' fill='%23dc2626' font-weight='bold' font-style='italic'%3EAutoefec%3C/text%3E%3C/svg%3E";
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="hidden sm:block"
              >
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold leading-none group-hover:text-red-400 transition-colors">
                  Tu Auto Ideal
                </p>
              </motion.div>
            </motion.div>

            <div className="flex items-center gap-3">
              {currentView === 'catalog' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2"
                >
                  Favoritos
                  {favorites.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full"
                    >
                      {favorites.length}
                    </motion.span>
                  )}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(currentView === 'catalog' ? 'seller' : 'catalog')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${currentView === 'catalog'
                    ? 'bg-gray-900 text-white hover:bg-red-600'
                    : 'bg-gray-800 text-red-400 border border-red-700 hover:bg-gray-700'
                  }`}
              >
                {currentView === 'catalog' ? (
                  <>
                    <LayoutDashboard size={18} />
                    <span className="hidden sm:inline">Portal Vendedor</span>
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

        {currentView === 'catalog' && (
          <div className="relative z-10 max-w-3xl mx-auto px-4 pt-10 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <motion.div
                className="mb-12 relative flex justify-center items-center overflow-hidden rounded-2xl bg-black"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Video de fondo */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover  "
                >
                  <source src="/logos/autoefec.mp4" type="video/mp4" />
                </video>



                {/* Sombras múltiples animadas */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-600/40 to-red-800/40 blur-[100px]"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-red-500/30 to-orange-600/30 blur-[120px]"
                  animate={{
                    scale: [1.1, 1, 1.1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />

                {/* Logo con animación de flotación - AUMENTADO DE TAMAÑO */}
                <motion.img
                  src="/logos/autoefec.png"
                  alt="Autoefec"
                  className="h-64 md:h-80 lg:h-96 w-auto relative z-10"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(220, 38, 38, 0.3)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))'
                  }}
                  animate={{
                    y: [0, -10, 0],
                    filter: [
                      'drop-shadow(0 25px 50px rgba(220, 38, 38, 0.3)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))',
                      'drop-shadow(0 30px 60px rgba(220, 38, 38, 0.4)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.2))',
                      'drop-shadow(0 25px 50px rgba(220, 38, 38, 0.3)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='200' viewBox='0 0 500 200'%3E%3Ctext x='30' y='140' font-size='110' fill='%23dc2626' font-weight='bold' font-style='italic'%3EAutoefec%3C/text%3E%3C/svg%3E";
                  }}
                />

                {/* Anillos de luz animados */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500/20"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-600/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0, 0.4]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
                  }}
                />
              </motion.div>

            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-3"
            >
              <div className="bg-gray-900 border border-gray-800 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-xl max-w-4xl">
                <div className="flex-grow flex items-center bg-gray-800 rounded-xl px-4 border border-gray-700 hover:border-gray-500 transition-colors focus-within:border-red-600/50">
                  <Search size={20} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar por marca, modelo o año..."
                    className="w-full bg-transparent border-none text-gray-100 px-3 py-4 focus:ring-0 placeholder-gray-400 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="text-gray-500 hover:text-gray-900">
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="h-[1px] md:h-auto md:w-[1px] bg-gray-700 mx-1"></div>

                <div className="relative min-w-[240px]">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none">
                    <Filter size={18} />
                  </div>
                  <select
                    value={selectedSeller}
                    onChange={(e) => setSelectedSeller(e.target.value)}
                    className="w-full bg-gray-800 text-gray-100 pl-11 pr-10 py-4 rounded-xl border border-gray-700 appearance-none cursor-pointer hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-red-600/20 focus:border-red-600/50 outline-none"
                  >
                    {sellers.map(s => <option key={s} value={s}>{s === 'Todos' ? 'Todos los Vendedores' : s}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${showFilters
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'bg-gray-800 text-gray-100 border border-gray-700 hover:border-red-600/50'
                    }`}
                >
                  <Filter size={18} />
                  <span>Filtros Avanzados</span>
                  {activeFiltersCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </motion.span>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl overflow-hidden max-w-4xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <Filter className="text-red-600" size={20} />
                        Filtros Avanzados
                      </h3>
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
                      >
                        <X size={16} /> Limpiar Todo
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Marca</label>
                        <select
                          value={filters.marca}
                          onChange={(e) => setFilters({ ...filters, marca: e.target.value })}
                          className="filter-select dark"
                        >
                          {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Año Desde</label>
                        <input
                          type="number"
                          placeholder="Ej: 2015"
                          value={filters.yearMin}
                          onChange={(e) => setFilters({ ...filters, yearMin: e.target.value })}
                          className="filter-input dark"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Año Hasta</label>
                        <input
                          type="number"
                          placeholder="Ej: 2024"
                          value={filters.yearMax}
                          onChange={(e) => setFilters({ ...filters, yearMax: e.target.value })}
                          className="filter-input dark"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Precio Desde (CLP)</label>
                        <input
                          type="number"
                          placeholder="Ej: 5000000"
                          value={filters.priceMin}
                          onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                          className="filter-input dark"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Precio Hasta (CLP)</label>
                        <input
                          type="number"
                          placeholder="Ej: 50000000"
                          value={filters.priceMax}
                          onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                          className="filter-input dark"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Km Máximo</label>
                        <input
                          type="number"
                          placeholder="Ej: 100000"
                          value={filters.kmMax}
                          onChange={(e) => setFilters({ ...filters, kmMax: e.target.value })}
                          className="filter-input dark"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Combustible</label>
                        <select
                          value={filters.combustible}
                          onChange={(e) => setFilters({ ...filters, combustible: e.target.value })}
                          className="filter-select dark"
                        >
                          {combustibles.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Transmisión</label>
                        <select
                          value={filters.transmision}
                          onChange={(e) => setFilters({ ...filters, transmision: e.target.value })}
                          className="filter-select dark"
                        >
                          <option value="Todas">Todas</option>
                          <option value="Automática">Automática</option>
                          <option value="Mecánica">Mecánica</option>
                          <option value="CVT">CVT</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Tracción</label>
                        <select
                          value={filters.traccion}
                          onChange={(e) => setFilters({ ...filters, traccion: e.target.value })}
                          className="filter-select dark"
                        >
                          {tracciones.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Tipo de Venta</label>
                        <select
                          value={filters.tipoVenta}
                          onChange={(e) => setFilters({ ...filters, tipoVenta: e.target.value })}
                          className="filter-select dark"
                        >
                          <option value="Todos">Todos</option>
                          <option value="Propio">Propio</option>
                          <option value="Consignado">Consignado</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-300 uppercase mb-2 block">Financiable</label>
                        <select
                          value={filters.financiable}
                          onChange={(e) => setFilters({ ...filters, financiable: e.target.value })}
                          className="filter-select dark"
                        >
                          <option value="Todos">Todos</option>
                          <option value="Si">Sí</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
                      <p className="text-sm text-gray-300">
                        Mostrando <span className="text-red-600 font-bold">{filteredStock.length}</span> vehículos
                      </p>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition-all"
                      >
                        Aplicar Filtros
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>

      <main className=" mx-auto px-2 pb-2 relative z-10">
        {/* Botón para agregar auto removido, solo SellerPortal puede agregar autos */}
        {/* Modal para agregar auto removido, solo SellerPortal puede agregar autos */}
        <AnimatePresence mode="wait">
          {currentView === 'catalog' ? (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6 flex items-center justify-between text-sm text-gray-300 flex-wrap gap-3">
                <p>Mostrando <span className="text-gray-100 font-bold">{filteredStock.length}</span> de {stock.length} vehículos</p>
                {activeFiltersCount > 0 && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={clearAllFilters}
                    className="text-red-400 hover:text-red-300 font-medium flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-red-700 transition-all hover:bg-gray-700"
                  >
                    <X size={16} /> Limpiar {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''}
                  </motion.button>
                )}
              </div>

              {filteredStock.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredStock.map((car, i) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="relative">
                        <CarCard
                          car={car}
                          onClick={setSelectedCar}
                          isFavorite={favorites.includes(car.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                        {/* Editar/Eliminar solo en SellerPortal, no en catálogo público */}
                      </div>
                    </motion.div>
                  ))}
                  {/* Eliminada lógica de edición/eliminación de autos */}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-gray-500 border border-dashed border-gray-700 rounded-3xl bg-gray-900">
                  <div className="bg-gray-100 p-4 rounded-full mb-4"><Search size={32} className="text-gray-400" /></div>
                  <p className="text-lg font-medium text-gray-900">No encontramos vehículos</p>
                  <p className="text-sm">Intenta con otros términos o filtros.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="seller"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SellerPortal
                stock={stock}
                onBack={() => setCurrentView('catalog')}
                onAdd={(car) => {
                  handleAddCar(car);
                  setCurrentView('catalog');
                }}
                onUpdate={(updated) => {
                  setStock(prev => prev.map(s => {
                    if (s.id !== updated.id) return s;
                    const historial = s.precioHistorial ?? [];
                    const today = new Date().toISOString().split('T')[0];
                    const newHistorial = updated.precio !== s.precio
                      ? [...historial, { date: today, price: updated.precio }]
                      : historial;
                    return {
                      ...updated,
                      precioHistorial: newHistorial,
                    };
                  }));
                }}
                onDelete={(id) => {
                  setStock(prev => prev.filter(s => s.id !== id));
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} onContact={handleContact} />}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 pr-6 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[90vw] backdrop-blur-md border border-white/20"
          >
            <div className="bg-black/40 p-2 rounded-full flex-shrink-0"><MessageCircle size={24} /></div>
            <div>
              <h4 className="font-bold">{notification.message}</h4>
              <p className="text-white/90 text-xs font-medium">{notification.sub}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .filter-select, .filter-input {
          width: 100%;
          background: rgba(17, 24, 39, 1);
          border: 1px solid rgba(55, 65, 81, 1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: rgba(243, 244, 246, 1);
          outline: none;
          transition: all 0.2s;
          font-size: 0.875rem;
        }
        .filter-select.dark, .filter-input.dark {
          background: rgba(17, 24, 39, 1);
          border: 1px solid rgba(55, 65, 81, 1);
          color: rgba(243, 244, 246, 1);
        }
        .filter-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.25rem;
          padding-right: 2.5rem;
          cursor: pointer;
        }
        .filter-select:hover, .filter-input:hover {
          border-color: rgba(220, 38, 38, 0.5);
          background: rgba(31, 41, 55, 1);
        }
        .filter-select:focus, .filter-input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        .filter-input::placeholder {
          color: #6b7280;
        }
        .scrollbar-thin::-webkit-scrollbar { 
          height: 6px; 
        }
        .scrollbar-thumb-red-600::-webkit-scrollbar-thumb { 
          background: #dc2626; 
          border-radius: 3px; 
        }
        .scrollbar-track-gray-900::-webkit-scrollbar-track { 
          background: #1a1a1a; 
        }
        .custom-scrollbar::-webkit-scrollbar { 
          width: 8px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: #f3f4f6; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #d1d5db; 
          border-radius: 4px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: #9ca3af; 
        }
      `}</style>
    </div>
  );
}

export default App;