import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Producto, Variante } from '../../data/products';
import { API_BASE } from '../../config/api';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [cargando, setCargando] = useState(true);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [varianteActiva, setVarianteActiva] = useState<Variante | null>(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(0);
  const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setCargando(true);
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        const prod = await res.json();
        
        setProducto(prod);
        if (prod.variantes && prod.variantes.length > 0) {
          setVarianteActiva(prod.variantes[0]);
          setImagenPrincipal(0);
        }
        
        // Fetch related products (we fetch all and filter for now, later we can add a specific API route)
        const resAll = await fetch(`${API_BASE}/products`);
        const todos = await resAll.json();
        const relacionados = todos.filter((p: Producto) => p.categoria && p.categoria.trim().toLowerCase() === prod.categoria.trim().toLowerCase() && p.id !== prod.id).slice(0, 10);
        setProductosRelacionados(relacionados);

      } catch (error) {
        console.error("Error cargando producto:", error);
        setProducto(null);
        setVarianteActiva(null);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (cargando) {
    return (
      <div className="producto-loading">
        <div className="producto-loading-content">
          <div className="producto-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!producto || !varianteActiva) {
    return (
      <div className="producto-not-found">
        <div className="producto-not-found-content">
          <h2>Producto no encontrado</h2>
          <p>ID: {id}</p>
          <Link to="/catalogo" className="btn-primary">Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  const manejarCambioVariante = (variante: Variante) => {
    setVarianteActiva(variante);
    setImagenPrincipal(0);
  };

  const precioFinal = varianteActiva.precio_descuento != null 
    ? Number(varianteActiva.precio_descuento) 
    : Number(varianteActiva.precio);
  const precioOriginal = Number(varianteActiva.precio);
  const tieneDescuento = varianteActiva.precio_descuento != null;

  return (
    <div className="producto-detalle">
      <div className="producto-detalle-container">
        <nav className="producto-breadcrumbs">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo">Catálogo</Link>
          <span>/</span>
          <Link to={`/catalogo/${producto.categoria}`}>{producto.categoria}</Link>
          <span>/</span>
          <span>{producto.nombre}</span>
        </nav>

        <div className="producto-card">
          <div className="producto-grid">
            <div className="producto-imagenes">
              <div className="producto-imagen-principal">
                <img
                  src={varianteActiva.imagenes[imagenPrincipal]}
                  alt={`${producto.nombre} - ${varianteActiva.color_nombre}`}
                />
                {tieneDescuento && (
                  <span className="producto-oferta-badge">OFERTA</span>
                )}
              </div>

              <div className="producto-miniaturas">
                {varianteActiva.imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImagenPrincipal(idx)}
                    className={`producto-miniatura ${imagenPrincipal === idx ? 'active' : ''}`}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="producto-detalles">
              <div className="producto-categoria">
                <span className="producto-categoria-badge">
                  {producto.categoria}
                </span>
              </div>

              <h1 className="producto-titulo">
                {producto.nombre}
              </h1>

              <div className="producto-precio">
                <span className="producto-precio-final">
                  ${precioFinal.toFixed(2)}
                </span>
                {tieneDescuento && (
                  <>
                    <span className="producto-precio-original">
                      ${precioOriginal.toFixed(2)}
                    </span>
                    <span className="producto-descuento">
                      -{Math.round((1 - Number(varianteActiva.precio_descuento) / precioOriginal) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="producto-descripcion">
                {producto.descripcion}
              </p>

              <div className="producto-color">
                <h3>Color: <span className="producto-color-seleccionado">{varianteActiva.color_nombre}</span></h3>
                <div className="producto-colores">
                  {producto.variantes.map((variante) => {
                    const isActive = varianteActiva.id_variante === variante.id_variante;
                    return (
                    <button
                      key={variante.id_variante}
                      onClick={() => manejarCambioVariante(variante)}
                      className={`producto-color-btn ${isActive ? 'active' : ''}`}
                      title={variante.color_nombre}
                    >
                      <div 
                        className="producto-color-circulo"
                        style={{ backgroundColor: variante.color }}
                      />
                      {variante.stock === 0 && (
                        <div className="producto-color-agotado">
                          <span>AGOTADO</span>
                        </div>
                      )}
                    </button>
                    );
                  })}
                </div>
                <p className="producto-stock">
                  {varianteActiva.stock > 0 
                    ? `${varianteActiva.stock} unidades disponibles` 
                    : 'Producto agotado'}
                </p>
              </div>

              <div className="producto-acciones">
                {producto.urlShein && (
                  <a
                    href={producto.urlShein}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="producto-btn-comprar"
                    style={{ backgroundColor: '#222', marginBottom: '10px', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    🚀 Comprar en Shein
                  </a>
                )}
                
                {producto.urlTiktok && (
                  <a
                    href={producto.urlTiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="producto-btn-comprar"
                    style={{ backgroundColor: '#00f2fe', color: '#000', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    🎵 Comprar en TikTok Shop
                  </a>
                )}
                
                {(!producto.urlShein && !producto.urlTiktok) && (
                   <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
                     Producto disponible próximamente en nuestras tiendas oficiales.
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        {productosRelacionados.length > 0 && (
          <div className="productos-relacionados" style={{ marginTop: '4rem' }}>
            <ProductCarousel 
              productos={productosRelacionados} 
              titulo="También te podría gustar" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoDetalle;
