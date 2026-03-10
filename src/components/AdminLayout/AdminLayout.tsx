import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Package, ShoppingCart, Users, Activity } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  
  if (user?.rol !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para ver esta página.</p>
        <Link to="/admin-login" className="btn-primary">Ir al Login</Link>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="logo-icon">💄</span>
          <h2>GoAdmin</h2>
        </div>
        
        <nav className="admin-sidebar-nav">
          <Link to="/admin/productos" className={`nav-item ${isActive('/admin/productos') ? 'active' : ''}`}>
            <Package size={20} /> Productos
          </Link>
          <Link to="/admin/pedidos" className={`nav-item ${isActive('/admin/pedidos') ? 'active' : ''}`}>
            <ShoppingCart size={20} /> Pedidos
          </Link>
          <Link to="/admin/usuarios" className={`nav-item ${isActive('/admin/usuarios') ? 'active' : ''}`}>
            <Users size={20} /> Usuarios
          </Link>
          <Link to="/admin/interacciones" className={`nav-item ${isActive('/admin/interacciones') ? 'active' : ''}`}>
            <Activity size={20} /> Analítica
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.nombre}</span>
            <span className="admin-user-role">Administrator</span>
          </div>
          <button onClick={logout} className="btn-logout">
            <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <div className="admin-topbar">
          <div className="topbar-search">
            <input type="text" placeholder="Buscar en el panel..." />
          </div>
        </div>
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
