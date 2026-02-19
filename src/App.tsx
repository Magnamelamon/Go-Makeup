import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Catalogo from './pages/Catalogo/Catalogo';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';
import Carrito from './pages/Carrito/Carrito';
import Checkout from './pages/Checkout/Checkout';
import PerfilUsuario from './pages/PerfilUsuario/PerfilUsuario';
import PerfilAdmin from './pages/PerfilAdmin/PerfilAdmin';
import Login from './pages/Login/Login';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:categoria" element={<Catalogo />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/admin" element={<PerfilAdmin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
