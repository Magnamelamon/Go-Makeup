import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
import { getAllProducts } from '../../data/products';
import './Home.css';

const slidesHome = [
  {
    imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    titulo: 'Nueva Colección de Labiales',
    subtitulo: 'Nueva Temporada',
    botonTexto: 'Ver Colección',
    link: '/catalogo/labios'
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
  { nombre: 'Labios', imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', link: '/catalogo/labios' },
  { nombre: 'Ojos', imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', link: '/catalogo/ojos' },
  { nombre: 'Rostro', imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', link: '/catalogo/rostro' },
  { nombre: 'Uñas', imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', link: '/catalogo/uñas' },
];

const Home = () => {
  const todosLosProductos = getAllProducts();
  
  const productosDestacados = todosLosProductos.slice(0, 6);
  const productosNuevos = todosLosProductos.slice(-6);

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
          <Link to="/catalogo/labios" className="btn-primary">Ver Oferta</Link>
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
