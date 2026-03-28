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
