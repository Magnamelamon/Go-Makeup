import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isHome && !scrolled ? 'transparent' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💄</span>
          <span className="logo-text">Go Makeup</span>
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalogo">Catálogo</Link></li>
          <li><Link to="/catalogo/labiales">Labios</Link></li>
          <li><Link to="/catalogo/ojos">Ojos</Link></li>
          <li><Link to="/catalogo/rostro">Rostro</Link></li>
          <li><Link to="/catalogo/uñas">Uñas</Link></li>
          <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
