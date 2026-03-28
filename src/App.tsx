import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Catalogo from './pages/Catalogo/Catalogo';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';
import QuienesSomos from './pages/QuienesSomos/QuienesSomos';
import PerfilUsuario from './pages/PerfilUsuario/PerfilUsuario';

import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminLayout from './components/AdminLayout/AdminLayout';
import AdminProductos from './pages/AdminProductos/AdminProductos';
import AdminUsuarios from './pages/AdminUsuarios/AdminUsuarios';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/catalogo" element={<><Navbar /><Catalogo /><Footer /></>} />
          <Route path="/catalogo/:categoria" element={<><Navbar /><Catalogo /><Footer /></>} />
          <Route path="/producto/:id" element={<><Navbar /><ProductoDetalle /><Footer /></>} />
          <Route path="/perfil" element={<><Navbar /><PerfilUsuario /><Footer /></>} />
          <Route path="/quienes-somos" element={<><Navbar /><QuienesSomos /><Footer /></>} />
          
          {/* Admin Login Route without public Navbar */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Dashboard Routes wrapped in AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/productos" replace />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
