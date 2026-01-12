import type { Vehiculo } from '../types/Vehiculo';

const LOCAL_STORAGE_KEY = 'autos_catalogo_stock';

export const saveStockToLocalStorage = (stock: Vehiculo[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stock));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadStockFromLocalStorage = (initialData: Vehiculo[]): Vehiculo[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      return parsedData.map((car: Vehiculo) => ({
        ...car,
        imagenes: car.imagenes?.length ? car.imagenes : []
      }));
    }
  } catch {
    console.error('Error loading from localStorage');
  }
  return initialData;
};