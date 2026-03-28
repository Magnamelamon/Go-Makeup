import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

interface CarritoContextType {
  items: Producto[];
  agregarProducto: (producto: Omit<Producto, 'cantidad'>, cantidad?: number) => void;
  eliminarProducto: (id: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Producto[]>([]);

  const agregarProducto = (producto: Omit<Producto, 'cantidad'>, cantidad: number = 1) => {
    setItems(prev => {
      const existente = prev.find(item => item.id === producto.id);
      if (existente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const eliminarProducto = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ items, agregarProducto, eliminarProducto, vaciarCarrito, totalItems }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito must be used within a CarritoProvider');
  }
  return context;
};
