import type { Vehiculo } from '../types';

export const LOCAL_STORAGE_KEY = 'autos_catalogo_stock';

export const createImageArray = (folder: string, count: number) => {
  const normFolder = folder.toLowerCase().replace(/[^a-z0-9-_]/g, '').replace(/\s+/g, '-');
  return Array.from({ length: count }, (_, i) => `/autoefec/${normFolder}/${i + 1}.jpg`);
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

export const stockInicial: Vehiculo[] = [
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
  }
];

export function loadStockFromLocalStorage(): Vehiculo[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const loaded = JSON.parse(data);
      return loaded.map((car: any) => ({
        ...car,
        imagenes: car.imagenes?.length ? car.imagenes : (car.imagen ? [car.imagen] : ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"])
      }));
    }
  } catch (e) { console.error(e); }
  return stockInicial;
}

export function saveStockToLocalStorage(stock: Vehiculo[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stock));
  } catch (e) { console.error(e); }
}