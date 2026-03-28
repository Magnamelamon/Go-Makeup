import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
import { Producto } from '../../data/products';
import './Home.css';

const slidesHome = [
  {
    imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    titulo: 'Nueva Colección de Labiales',
    subtitulo: 'Nueva Temporada',
    botonTexto: 'Ver Colección',
    link: '/catalogo/labiales'
  },
  {
    imagen: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
    titulo: 'Sombras que Brillan',
    subtitulo: 'Colección Exclusiva',
    botonTexto: 'Descubrir',
    link: '/catalogo/ojos'
  },
  {
    imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800',
    titulo: 'Delineadores Perfectos',
    subtitulo: 'Precisión y Estilo',
    botonTexto: 'Explorar',
    link: '/catalogo/ojos'
  }
];

const categorias = [
  { nombre: 'Labios', imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', link: '/catalogo/labiales' },
  { nombre: 'Ojos', imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', link: '/catalogo/ojos' },
  { nombre: 'Rostro', imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', link: '/catalogo/rostro' },
  { nombre: 'Uñas', imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', link: '/catalogo/uñas' },
];

const Home = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('Error al cargar productos');
        const data = await res.json();
        setProductos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productosDestacados = productos.slice(0, 6);
  const productosNuevos = productos.slice(-6);

  if (loading) return <div className="home" style={{ textAlign: 'center', padding: '5rem' }}><h2>Cargando productos desde el servidor...</h2></div>;
  if (error) return <div className="home" style={{ textAlign: 'center', padding: '5rem', color: 'red' }}><h2>Error: {error}</h2></div>;

  return (
    <div className="home">
      <Carousel slides={slidesHome} />

      <section className="categorias-section">
        <div className="container">
          <h2 className="titulo-seccion">Categorías</h2>
          <div className="categorias-grid">
            {categorias.map((cat, index) => (
              <Link key={index} to={cat.link} className="categoria-card">
                <img src={cat.imagen} alt={cat.nombre} />
                <div className="categoria-overlay">
                  <h3>{cat.nombre}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="productos-section">
        <ProductCarousel productos={productosDestacados} titulo="Productos Destacados" />
      </section>

      <section className="banner-promo">
        <div className="banner-content">
          <span className="banner-subtitulo">Oferta Especial</span>
          <h2 className="banner-titulo">20% de Descuento</h2>
          <p className="banner-descripcion">En toda la colección de labiales seleccionada</p>
          <Link to="/catalogo/labiales" className="btn-primary">Ver Oferta</Link>
        </div>
        <div className="banner-imagen">
          <img src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600" alt="Promoción" />
        </div>
      </section>

      <section className="productos-section">
        <ProductCarousel productos={productosNuevos} titulo="Recién Llegados" />
      </section>
    </div>
  );
};

export default Home;
