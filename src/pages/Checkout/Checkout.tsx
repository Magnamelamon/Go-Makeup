import { Link } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  return (
    <div className="checkout">
      <div className="container">
        <h1 className="checkout-titulo">Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form">
            <div className="form-seccion">
              <h2>Información de Contacto</h2>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="tu@email.com" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" placeholder="+1 234 567 890" />
              </div>
            </div>

            <div className="form-seccion">
              <h2>Dirección de Envío</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" placeholder="Juan" />
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <input type="text" placeholder="Pérez" />
                </div>
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input type="text" placeholder="Calle Principal 123" />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input type="text" placeholder="Ciudad de México" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <input type="text" placeholder="CDMX" />
                </div>
                <div className="form-group">
                  <label>Código Postal</label>
                  <input type="text" placeholder="01000" />
                </div>
              </div>
            </div>

            <div className="form-seccion">
              <h2>Método de Pago</h2>
              <div className="metodos-pago">
                <label className="metodo-pago">
                  <input type="radio" name="pago" defaultChecked />
                  <span className="metodo-info">
                    <span className="metodo-nombre">Tarjeta de Crédito/Débito</span>
                    <span className="metodo-iconos">
                      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="4" fill="#1A1F71"/>
                        <text x="8" y="15" fill="white" fontSize="8">VISA</text>
                      </svg>
                      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="4" fill="#EB001B"/>
                        <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                        <circle cx="25" cy="12" r="7" fill="#F79E1B"/>
                        <path d="M20 6.5a7 7 0 0 0 0 11" fill="#FF5F00"/>
                      </svg>
                    </span>
                  </span>
                </label>
              </div>
              <div className="form-group">
                <label>Número de Tarjeta</label>
                <input type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Vencimiento</label>
                  <input type="text" placeholder="MM/AA" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-resumen">
            <h2>Resumen del Pedido</h2>
            <div className="resumen-items">
              <div className="resumen-item">
                <img src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100" alt="Labial" />
                <div>
                  <p className="item-nombre">Labial Mate Intenso</p>
                  <p className="item-cantidad">x2</p>
                </div>
                <span className="item-precio">$49.98</span>
              </div>
              <div className="resumen-item">
                <img src="https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=100" alt="Delineador" />
                <div>
                  <p className="item-nombre">Delineador Líquido</p>
                  <p className="item-cantidad">x1</p>
                </div>
                <span className="item-precio">$18.99</span>
              </div>
            </div>
            <div className="resumen-totales">
              <div className="resumen-row">
                <span>Subtotal</span>
                <span>$68.97</span>
              </div>
              <div className="resumen-row">
                <span>Envío</span>
                <span>$5.99</span>
              </div>
              <div className="resumen-row total">
                <span>Total</span>
                <span>$74.96</span>
              </div>
            </div>
            <button className="btn-primary btn-ordenar">Realizar Pedido</button>
            <Link to="/carrito" className="volver-carrito">← Volver al carrito</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
