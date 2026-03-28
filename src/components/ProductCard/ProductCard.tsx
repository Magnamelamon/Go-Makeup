import { Link } from 'react-router-dom';
import type { Producto } from '../../data/products';
import './ProductCard.css';

interface ProductCardProps {
  producto: Producto;
}

const ProductCard = ({ producto }: ProductCardProps) => {
  const primeraVariante = producto.variantes && producto.variantes.length > 0 ? producto.variantes[0] : null;
  const precio = primeraVariante?.precio ? Number(primeraVariante.precio) : 0;
  const precioDescuento = primeraVariante?.precio_descuento ? Number(primeraVariante.precio_descuento) : null;
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
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
