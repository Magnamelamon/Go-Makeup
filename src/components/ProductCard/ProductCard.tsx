import { Link } from 'react-router-dom';
import './ProductCard.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  marca: string;
}

interface ProductCardProps {
  producto: Product;
}

const ProductCard = ({ producto }: ProductCardProps) => {
  return (
    <div className="product-card">
      <Link to={`/producto/${producto.id}`} className="product-card-image">
        <img src={producto.imagen} alt={producto.nombre} />
        <div className="product-card-overlay">
          <span>Ver producto</span>
        </div>
      </Link>
      <div className="product-card-content">
        <span className="product-card-marca">{producto.marca}</span>
        <h3 className="product-card-nombre">{producto.nombre}</h3>
        <div className="product-card-footer">
          <span className="product-card-precio">${producto.precio.toFixed(2)}</span>
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
