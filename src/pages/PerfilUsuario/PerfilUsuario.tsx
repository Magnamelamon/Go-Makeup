import './PerfilUsuario.css';

const PerfilUsuario = () => {
  return (
    <div className="perfil">
      <div className="container">
        <h1 className="perfil-titulo">Mi Perfil</h1>
        
        <div className="perfil-content">
          <aside className="perfil-menu">
            <div className="perfil-avatar">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" alt="Avatar" />
              <h3>María González</h3>
              <span>maria@email.com</span>
            </div>
            <ul>
              <li className="active">Mis Datos</li>
              <li>Mis Pedidos</li>
              <li>Direcciones</li>
              <li>Métodos de Pago</li>
              <li>Wishlist</li>
              <li>Configuración</li>
            </ul>
          </aside>

          <main className="perfil-main">
            <div className="perfil-seccion">
              <h2>Información Personal</h2>
              <form className="perfil-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" defaultValue="María" />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input type="text" defaultValue="González" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="maria@email.com" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" defaultValue="+1 234 567 890" />
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" defaultValue="1990-05-15" />
                </div>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </form>
            </div>

            <div className="perfil-seccion">
              <h2>Cambiar Contraseña</h2>
              <form className="perfil-form">
                <div className="form-group">
                  <label>Contraseña Actual</label>
                  <input type="password" />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña</label>
                  <input type="password" />
                </div>
                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <input type="password" />
                </div>
                <button type="submit" className="btn-secondary">Actualizar Contraseña</button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
