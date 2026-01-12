import { motion } from 'framer-motion';
import { Calendar, Gauge, ChevronRight } from 'lucide-react';
// 1. Corregido: Importación de tipo explícita para 'verbatimModuleSyntax'
import type { Vehiculo } from '../types/Vehiculo';
import { formatPrice } from '../utils/format';
import { AutoCarousel } from './ui/AutoCarousel';

// 2. Corregido: Definición de la interfaz de Props para evitar el uso de 'any'
interface CarCardProps {
  car: Vehiculo;
  onClick: (car: Vehiculo) => void;
}

export const CarCard = ({ car, onClick }: CarCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => onClick(car)}
      className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer border hover:border-red-500 transition-all"
    >
      <div className="h-48 overflow-hidden bg-gray-100">
        <AutoCarousel images={car.imagenes} />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider">
            {car.marca}
          </p>
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {car.modelo}
          </h3>
          <p className="text-gray-500 text-xs">{car.version}</p>
        </div>

        <p className="text-xl font-black text-gray-900 mb-4">
          {formatPrice(car.precio)}
        </p>

        <div className="flex justify-between items-center text-[11px] text-gray-500 border-t pt-4">
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-red-500" /> {car.ano}
            </span>
            <span className="flex items-center gap-1">
              <Gauge size={14} className="text-red-500" /> {car.km.toLocaleString()} km
            </span>
          </div>
          <span className="text-red-600 font-bold flex items-center gap-0.5">
            Ver más <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};