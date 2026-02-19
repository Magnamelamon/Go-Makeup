import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import './ProductoDetalle.css';

const productos = [
  { id: 1, nombre: 'Labial Mate Intenso', precio: 24.99, imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', categoria: 'labiales', marca: 'Glamour', descripcion: 'Labial de acabado mate con fórmula de larga duración. Textura cremosa que se seca suavemente ofreciendo un color vibrante que dura todo el día.', colores: ['#C41E3A', '#FF69B4', '#8B4513', '#FF0000'] },
  { id: 2, nombre: 'Paleta Sombras 12 Tonos', precio: 49.99, imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', categoria: 'sombras', marca: 'Beauty', descripcion: 'Paleta profesional con 12 tonos perfectamente coordinados. Desde neutros hasta colores vibrantes para crear looks increíbles.', colores: ['#FFD700', '#FF69B4', '#8B4513', '#4169E1'] },
  { id: 3, nombre: 'Delineador Líquido', precio: 18.99, imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', categoria: 'delineadores', marca: 'Luxe', descripcion: 'Delineador líquido de alta precisión con punta ultrafina. Resistente al agua y de secado rápido para un acabado perfecto.', colores: ['#000000', '#4B0082', '#000080'] },
  { id: 4, nombre: 'Esmalte Gel Brillante', precio: 14.99, imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', categoria: 'esmaltes', marca: 'Nails', descripcion: 'Esmalte efecto gel de larga duración. Brillo intenso que dura hasta 14 días sin astillarse.', colores: ['#FF69B4', '#DC143C', '#FFD700', '#8B4513'] },
];

const ProductoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const producto = productos.find(p => p.id === Number(id));

  if (!producto) {
    return (
      <div className="producto-no-encontrado">
        <h2>Producto no encontrado</h2>
        <Link to="/catalogo" className="btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="producto-detalle">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo">Catálogo</Link>
          <span>/</span>
          <Link to={`/catalogo/${producto.categoria}`}>{producto.categoria}</Link>
          <span>/</span>
          <span>{producto.nombre}</span>
        </div>

        <div className="producto-content">
          <div className="producto-imagen">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>

          <div className="producto-info">
            <span className="producto-marca">{producto.marca}</span>
            <h1 className="producto-nombre">{producto.nombre}</h1>
            <p className="producto-precio">${producto.precio.toFixed(2)}</p>
            <p className="producto-descripcion">{producto.descripcion}</p>

            <div className="producto-colores">
              <h4>Color</h4>
              <div className="colores-opciones">
                {producto.colores.map((color, index) => (
                  <button 
                    key={index} 
                    className="color-swatch" 
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="producto-cantidad">
              <h4>Cantidad</h4>
              <div className="cantidad-selector">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                <span>{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)}>+</button>
              </div>
            </div>

            <div className="producto-acciones">
              <button 
                className="btn-primary btn-agregar" 
                onClick={() => agregarProducto({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen }, cantidad)}
              >
                Agregar al Carrito
              </button>
              <button 
                className="btn-comprar btn-primary"
                onClick={() => {
                  agregarProducto({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen }, cantidad);
                  navigate('/checkout');
                }}
              >
                Comprar Ahora
              </button>
              <button className="btn-favorito">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
