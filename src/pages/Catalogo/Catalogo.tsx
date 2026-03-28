import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Producto } from '../../data/products';
import { API_BASE } from '../../config/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Catalogo.css';

const Catalogo = () => {
  const { categoria } = useParams<{ categoria?: string }>();
  
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Error al cargar productos');
        const data = await res.json();
        setTodosLosProductos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoria]); // Re-fetch or re-evaluate when category changes
  
  const productosFiltrados = categoria
    ? todosLosProductos.filter(p => 
        p.categoria && p.categoria.trim().toLowerCase() === categoria.trim().toLowerCase()
      )
    : todosLosProductos;

  const categoriasDisponibles = [
    { id: 'labiales', nombre: 'Labios', imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400' },
    { id: 'ojos', nombre: 'Ojos', imagen: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
    { id: 'rostro', nombre: 'Rostro', imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400' },
    { id: 'uñas', nombre: 'Uñas', imagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' }
  ];

  const tituloPagina = categoria
    ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
    : 'Todos los Productos';

  if (loading) return <div className="catalogo" style={{ textAlign: 'center', padding: '5rem' }}><h2>Cargando catálogo...</h2></div>;
  if (error) return <div className="catalogo" style={{ textAlign: 'center', padding: '5rem', color: 'red' }}><h2>Error: {error}</h2></div>;

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
