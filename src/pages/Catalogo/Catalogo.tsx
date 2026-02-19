import { useParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Catalogo.css';

const todosLosProductos = [
  { id: 1, nombre: 'Labial Mate Intenso', precio: 24.99, imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', categoria: 'labiales', marca: 'Glamour' },
  { id: 2, nombre: 'Paleta Sombras 12 Tonos', precio: 49.99, imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', categoria: 'sombras', marca: 'Beauty' },
  { id: 3, nombre: 'Delineador Líquido', precio: 18.99, imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', categoria: 'delineadores', marca: 'Luxe' },
  { id: 4, nombre: 'Esmalte Gel Brillante', precio: 14.99, imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', categoria: 'esmaltes', marca: 'Nails' },
  { id: 5, nombre: 'Labial Gloss Volumen', precio: 22.99, imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', categoria: 'labiales', marca: 'Glamour' },
  { id: 6, nombre: 'Kit Maquillaje Completo', precio: 89.99, imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', categoria: 'kits', marca: 'Pro' },
  { id: 7, nombre: 'Corrector de Ojeras', precio: 19.99, imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', categoria: 'correctores', marca: 'Cover' },
  { id: 8, nombre: 'Base Liquida Natural', precio: 34.99, imagen: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', categoria: 'bases', marca: 'Face' },
  { id: 9, nombre: 'Rubor en Crema', precio: 21.99, imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', categoria: 'rubores', marca: 'Blush' },
  { id: 10, nombre: 'Spray Fijador Maquillaje', precio: 16.99, imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', categoria: 'fijadores', marca: 'Hold' },
  { id: 11, nombre: 'Labial Rojo Pasión', precio: 26.99, imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', categoria: 'labiales', marca: 'Ruby' },
  { id: 12, nombre: 'Delineador Gel', precio: 20.99, imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400', categoria: 'delineadores', marca: 'Precision' },
];

const categoriasDisponibles = [
  { id: 'labiales', nombre: 'Labiales', imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400' },
  { id: 'sombras', nombre: 'Sombras', imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
  { id: 'delineadores', nombre: 'Delineadores', imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400' },
  { id: 'esmaltes', nombre: 'Esmaltes', imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
];

const Catalogo = () => {
  const { categoria } = useParams<{ categoria?: string }>();

  const productosFiltrados = categoria
    ? todosLosProductos.filter(p => p.categoria === categoria)
    : todosLosProductos;

  const tituloPagina = categoria
    ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
    : 'Todos los Productos';

  return (
    <div className="catalogo">
      <div className="catalogo-header">
        <div className="container">
          <h1>{tituloPagina}</h1>
          <p>{productosFiltrados.length} productos</p>
        </div>
      </div>

      <div className="catalogo-container container">
        <aside className="catalogo-filtros">
          <h3>Categorías</h3>
          <ul>
            <li><a href="/catalogo">Todos</a></li>
            {categoriasDisponibles.map(cat => (
              <li key={cat.id}>
                <a href={`/catalogo/${cat.id}`}>{cat.nombre}</a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="catalogo-productos">
          {!categoria && (
            <div className="catalogo-categorias">
              {categoriasDisponibles.map(cat => (
                <a key={cat.id} href={`/catalogo/${cat.id}`} className="categoria-tarjeta">
                  <img src={cat.imagen} alt={cat.nombre} />
                  <span>{cat.nombre}</span>
                </a>
              ))}
            </div>
          )}

          <div className="productos-grid">
            {productosFiltrados.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Catalogo;
