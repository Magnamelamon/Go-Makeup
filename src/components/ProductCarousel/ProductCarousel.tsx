import { useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductCarousel.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  marca: string;
}

interface ProductCarouselProps {
  productos: Product[];
  titulo: string;
}

const ProductCarousel = ({ productos, titulo }: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="product-carousel">
      <div className="product-carousel-header">
        <h2 className="titulo-seccion">{titulo}</h2>
        <div className="product-carousel-controls">
          <button className="control-btn" onClick={() => scroll('left')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="control-btn" onClick={() => scroll('right')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      <div className="product-carousel-track" ref={scrollRef}>
        {productos.map((producto) => (
          <div key={producto.id} className="product-carousel-item">
            <ProductCard producto={producto} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
