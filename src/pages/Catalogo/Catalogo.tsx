import { useParams, Link } from 'react-router-dom';
import { getAllProducts } from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Catalogo.css';

const Catalogo = () => {
  const { categoria } = useParams<{ categoria?: string }>();
  
  const todosLosProductos = getAllProducts();
  
  const productosFiltrados = categoria
    ? todosLosProductos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase())
    : todosLosProductos;

  const categoriasDisponibles = [
    { id: 'labios', nombre: 'Labios', imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400' },
    { id: 'ojos', nombre: 'Ojos', imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
    { id: 'rostro', nombre: 'Rostro', imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400' },
    { id: 'uñas', nombre: 'Uñas', imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
    { id: 'skincare', nombre: 'Skincare', imagen: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400' },
    { id: 'accesorios', nombre: 'Accesorios', imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
  ];

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
            <li><Link to="/catalogo">Todos</Link></li>
            {categoriasDisponibles.map(cat => (
              <li key={cat.id}>
                <Link to={`/catalogo/${cat.id}`}>{cat.nombre}</Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="catalogo-productos">
          {/* Categorías repetitivas removidas según el rediseño del layout */}
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
