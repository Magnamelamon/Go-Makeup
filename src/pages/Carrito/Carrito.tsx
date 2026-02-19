import { Link } from 'react-router-dom';
import './Carrito.css';

const productosCarrito = [
  { id: 1, nombre: 'Labial Mate Intenso', precio: 24.99, cantidad: 2, imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200', marca: 'Glamour' },
  { id: 3, nombre: 'Delineador Líquido', precio: 18.99, cantidad: 1, imagen: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=200', marca: 'Luxe' },
];

const Carrito = () => {
  const subtotal = productosCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  const envio = 5.99;
  const total = subtotal + envio;

  return (
    <div className="carrito">
      <div className="container">
        <h1 className="carrito-titulo">Mi Carrito</h1>
        
        {productosCarrito.length === 0 ? (
          <div className="carrito-vacio">
            <p>Tu carrito está vacío</p>
            <Link to="/catalogo" className="btn-primary">Ver Catálogo</Link>
          </div>
        ) : (
          <div className="carrito-content">
            <div className="carrito-items">
              {productosCarrito.map(producto => (
                <div key={producto.id} className="carrito-item">
                  <div className="item-imagen">
                    <img src={producto.imagen} alt={producto.nombre} />
                  </div>
                  <div className="item-info">
                    <span className="item-marca">{producto.marca}</span>
                    <h3 className="item-nombre">{producto.nombre}</h3>
                    <p className="item-precio">${producto.precio.toFixed(2)}</p>
                  </div>
                  <div className="item-cantidad">
                    <button>-</button>
                    <span>{producto.cantidad}</span>
                    <button>+</button>
                  </div>
                  <div className="item-total">
                    ${(producto.precio * producto.cantidad).toFixed(2)}
                  </div>
                  <button className="item-eliminar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="carrito-resumen">
              <h2>Resumen del Pedido</h2>
              <div className="resumen-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="resumen-row">
                <span>Envío</span>
                <span>${envio.toFixed(2)}</span>
              </div>
              <div className="resumen-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn-primary btn-checkout">
                Proceder al Pago
              </Link>
              <Link to="/catalogo" className="btn-secondary btn-seguir">
                Seguir Comprando
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
