import './PerfilAdmin.css';

const productosAdmin = [
  { id: 1, nombre: 'Labial Mate Intenso', precio: 24.99, stock: 45, categoria: 'labiales', estado: 'activo' },
  { id: 2, nombre: 'Paleta Sombras 12 Tonos', precio: 49.99, stock: 12, categoria: 'sombras', estado: 'activo' },
  { id: 3, nombre: 'Delineador Líquido', precio: 18.99, stock: 0, categoria: 'delineadores', estado: 'inactivo' },
  { id: 4, nombre: 'Esmalte Gel Brillante', precio: 14.99, stock: 78, categoria: 'esmaltes', estado: 'activo' },
];

const pedidosRecientes = [
  { id: 'ORD-001', cliente: 'Juan Pérez', total: 74.96, estado: 'pendiente', fecha: '18/02/2026' },
  { id: 'ORD-002', cliente: 'Ana López', total: 49.99, estado: 'enviado', fecha: '17/02/2026' },
  { id: 'ORD-003', cliente: 'Carlos García', total: 124.97, estado: 'entregado', fecha: '16/02/2026' },
];

const PerfilAdmin = () => {
  return (
    <div className="container admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-titulo">Panel de Administración</h1>
        <button className="btn-primary">+ Nuevo Producto</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-info">
            <span className="stat-valor">156</span>
            <span className="stat-label">Productos</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🛒</span>
          <div className="stat-info">
            <span className="stat-valor">23</span>
            <span className="stat-label">Pedidos</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <span className="stat-valor">89</span>
            <span className="stat-label">Clientes</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-valor">$2,450</span>
            <span className="stat-label">Ventas</span>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <section className="admin-section">
          <div className="section-header">
            <h2>Productos</h2>
            <div className="section-actions">
              <input type="text" placeholder="Buscar producto..." className="busqueda-input" />
              <select className="filtro-select">
                <option>Todas las categorías</option>
                <option>Labiales</option>
                <option>Sombras</option>
                <option>Delineadores</option>
                <option>Esmaltes</option>
              </select>
            </div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosAdmin.map(producto => (
                <tr key={producto.id}>
                  <td>#{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio.toFixed(2)}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.categoria}</td>
                  <td>
                    <span className={`estado-badge ${producto.estado}`}>
                      {producto.estado}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-editar">✏️</button>
                      <button className="btn-eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-section">
          <div className="section-header">
            <h2>Pedidos Recientes</h2>
            <button className="btn-secondary">Ver Todos</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosRecientes.map(pedido => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>${pedido.total.toFixed(2)}</td>
                  <td>
                    <span className={`estado-badge ${pedido.estado}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>{pedido.fecha}</td>
                  <td>
                    <button className="btn-ver">Ver Detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default PerfilAdmin;
