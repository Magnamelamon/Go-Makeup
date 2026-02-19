import Carousel from '../../components/Carousel/Carousel';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
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
    link: '/catalogo/sombras'
  },
  {
    imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800',
    titulo: 'Delineadores Perfectos',
    subtitulo: 'Precisión y Estilo',
    botonTexto: 'Explorar',
    link: '/catalogo/delineadores'
  }
];

const productosDestacados = [
  { id: 1, nombre: 'Labial Mate Intenso', precio: 24.99, imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', categoria: 'labiales', marca: 'Glamour' },
  { id: 2, nombre: 'Paleta Sombras 12 Tonos', precio: 49.99, imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', categoria: 'sombras', marca: 'Beauty' },
  { id: 3, nombre: 'Delineador Líquido', precio: 18.99, imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', categoria: 'delineadores', marca: 'Luxe' },
  { id: 4, nombre: 'Esmalte Gel Brillante', precio: 14.99, imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', categoria: 'esmaltes', marca: 'Nails' },
  { id: 5, nombre: 'Labial Gloss Volumen', precio: 22.99, imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', categoria: 'labiales', marca: 'Glamour' },
];

const productosNuevos = [
  { id: 6, nombre: 'Kit Maquillaje Completo', precio: 89.99, imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', categoria: 'kits', marca: 'Pro' },
  { id: 7, nombre: 'Corrector de Ojeras', precio: 19.99, imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', categoria: 'correctores', marca: 'Cover' },
  { id: 8, nombre: 'Base Liquida Natural', precio: 34.99, imagen: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', categoria: 'bases', marca: 'Face' },
  { id: 9, nombre: 'Rubor en Crema', precio: 21.99, imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', categoria: 'rubores', marca: 'Blush' },
  { id: 10, nombre: 'Spray Fijador Maquillaje', precio: 16.99, imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', categoria: 'fijadores', marca: 'Hold' },
];

const categorias = [
  { nombre: 'Labiales', imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', link: '/catalogo/labiales' },
  { nombre: 'Sombras', imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', link: '/catalogo/sombras' },
  { nombre: 'Delineadores', imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', link: '/catalogo/delineadores' },
  { nombre: 'Esmaltes', imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', link: '/catalogo/esmaltes' },
];

const Home = () => {
  return (
    <div className="home">
      <Carousel slides={slidesHome} />

      <section className="categorias-section">
        <div className="container">
          <h2 className="titulo-seccion">Categorías</h2>
          <div className="categorias-grid">
            {categorias.map((cat, index) => (
              <a key={index} href={cat.link} className="categoria-card">
                <img src={cat.imagen} alt={cat.nombre} />
                <div className="categoria-overlay">
                  <h3>{cat.nombre}</h3>
                </div>
              </a>
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
          <a href="/catalogo/labiales" className="btn-primary">Ver Oferta</a>
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
