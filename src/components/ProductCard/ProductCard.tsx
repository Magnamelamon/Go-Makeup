import { Link } from 'react-router-dom';
import type { Producto } from '../../data/products';
import './ProductCard.css';

interface ProductCardProps {
  producto: Producto;
}

const ProductCard = ({ producto }: ProductCardProps) => {
  const primeraVariante = producto.variantes[0];
  const precio = primeraVariante?.precio || 0;
  const precioDescuento = primeraVariante?.precio_descuento;
  const imagen = primeraVariante?.imagenes?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400';

  return (
    <div className="product-card">
      <Link to={`/producto/${producto.id}`} className="product-card-image">
        <img src={imagen} alt={producto.nombre} />
        <div className="product-card-overlay">
          <span>Ver producto</span>
        </div>
      </Link>
      <div className="product-card-content">
        <span className="product-card-marca">{producto.categoria}</span>
        <h3 className="product-card-nombre">{producto.nombre}</h3>
        <div className="product-card-footer">
          <div className="product-card-precio">
            {precioDescuento ? (
              <>
                <span className="precio-original">${precio.toFixed(2)}</span>
                <span className="precio-descuento">${precioDescuento.toFixed(2)}</span>
              </>
            ) : (
              <span>${precio.toFixed(2)}</span>
            )}
          </div>
          <button className="product-card-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
