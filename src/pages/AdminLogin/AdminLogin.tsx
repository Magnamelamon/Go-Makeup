import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/admin');
    } else {
      setError('Credenciales de administrador incorrectas');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="lock-icon">🔒</div>
          <h1>Acceso Restringido</h1>
          <p>Portal de Administración Go Makeup</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Administrativo</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gomakeup.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-admin-login">Acceder al Panel</button>
        </form>

        <div className="login-demo">
          <p>Solo personal autorizado:</p>
          <div className="demo-accounts">
            <div><strong>Admin:</strong> admin@gomakeup.com / admin123</div>
          </div>
        </div>

        <Link to="/" className="back-home">Volver al sitio público</Link>
      </div>
    </div>
  );
};

export default AdminLogin;
