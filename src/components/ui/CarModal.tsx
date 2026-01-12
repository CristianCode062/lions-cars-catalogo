import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Info, Calendar, Gauge, Fuel, Settings2, 
  Users, Key, ThermometerSnowflake, Disc, 
  DollarSign, MessageCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';

// Corregido: Importación de tipos explícita y rutas relativas correctas
import type { Vehiculo } from '../../types/Vehiculo';
import { formatPrice } from '../../utils/format';
import { DetailItem } from './DetailItem';
import { ImageZoomModal } from './ImageZoomModal';

interface CarModalProps {
  car: Vehiculo;
  onClose: () => void;
  onContact: (car: Vehiculo) => void;
}

export const CarModal = ({ car, onClose, onContact }: CarModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageZoom, setShowImageZoom] = useState(false);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % car.imagenes.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + car.imagenes.length) % car.imagenes.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo con desenfoque */}
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
        className="bg-white w-full max-w-6xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-red-500 hover:text-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
        >
          <X size={20} />
        </button>

        {/* Sección Izquierda: Galería */}
        <div className="md:w-5/12 relative flex flex-col bg-black">
          <div className="h-72 md:h-2/3 w-full relative group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex} 
                src={car.imagenes[currentImageIndex]}
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setShowImageZoom(true)}
              />
            </AnimatePresence>
            
            {car.imagenes.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
               <h2 className="text-3xl font-bold text-white mb-1 leading-tight">{car.modelo}</h2>
               <p className="text-red-500 font-bold text-3xl tracking-tight">{formatPrice(car.precio)}</p>
            </div>
          </div>

          <div className="p-8 bg-gray-900 flex-grow flex items-center">
            <button 
              onClick={() => onContact(car)} 
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg"
            >
              <MessageCircle size={22} /> Contactar por WhatsApp
            </button>
          </div>
        </div>

        {/* Sección Derecha: Información */}
        <div className="md:w-7/12 p-6 md:p-10 overflow-y-auto bg-white">
          <div className="mb-8 flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Info className="text-red-600" size={24} /> Ficha Técnica
            </h3>
            <span className="text-xs font-mono text-gray-400">ID: #{car.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <DetailItem icon={Calendar} label="Año" value={car.ano} />
            <DetailItem icon={Gauge} label="Kilometraje" value={`${car.km.toLocaleString()} km`} />
            <DetailItem icon={Fuel} label="Combustible" value={car.combustible} />
            <DetailItem icon={Settings2} label="Transmisión" value={car.transmision} />
            <DetailItem icon={Users} label="Dueños" value={car.duenos} />
            <DetailItem icon={Key} label="Llaves" value={car.llaves} />
            <DetailItem icon={ThermometerSnowflake} label="Aire Acond." value={car.aire ? "Sí" : "No"} highlight={car.aire} />
            <DetailItem icon={Disc} label="Neumáticos" value={car.neumaticos} />
          </div>

          <div className="mb-8 p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" /> Información Comercial
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex justify-between">
                <span>Vendedor:</span> <span className="font-bold text-gray-900">{car.vendedor}</span>
              </p>
              <p className="text-sm text-gray-600 flex justify-between">
                <span>Tipo de Venta:</span> <span className="font-bold text-gray-900">{car.tipoVenta}</span>
              </p>
              {car.financiable && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-green-700 font-bold">
                    Pie desde: {formatPrice(car.valorPie)} (Sujeto a evaluación)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-600">
            <p className="text-gray-700 text-sm italic leading-relaxed">
              "{car.obs}"
            </p>
          </div>
        </div>

        {/* Modal de Zoom */}
        <AnimatePresence>
          {showImageZoom && (
            <ImageZoomModal 
              image={car.imagenes[currentImageIndex]} 
              currentIndex={currentImageIndex} 
              totalImages={car.imagenes.length} 
              onClose={() => setShowImageZoom(false)}
              onNext={nextImage} 
              onPrev={prevImage}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};