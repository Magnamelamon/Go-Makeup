import initialProductsData from './products.json';

export interface Variante {
  id_variante: string;
  color: string;
  color_nombre: string;
  precio: number;
  precio_descuento: number | null;
  stock: number;
  imagenes: string[];
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  variantes: Variante[];
  urlShein?: string;
  urlTiktok?: string;
}

const STORAGE_KEY = 'gomakeup_products';

export const initializeProductsDB = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProductsData));
  }
};

export const getAllProducts = (): Producto[] => {
  initializeProductsDB();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialProductsData;
};

export const getProductoById = (id: string): Producto | undefined => {
  const products = getAllProducts();
  return products.find((p: Producto) => p.id === id);
};

export const saveProducto = (producto: Producto): void => {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === producto.id);
  
  if (index >= 0) {
    products[index] = producto; // Update existing
  } else {
    products.push(producto); // Add new
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const deleteProducto = (id: string): void => {
  const products = getAllProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const bulkSaveProducts = (newProducts: Producto[]): void => {
  const currentProducts = getAllProducts();
  const productsMap = new Map(currentProducts.map(p => [p.id, p]));
  
  newProducts.forEach(np => {
    productsMap.set(np.id, np);
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(productsMap.values())));
};
