import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (register(nombre, email, password)) {
        navigate('/');
      } else {
        setError('El correo ya está registrado.');
      }
    } else {
      if (login(email, password)) {
        navigate('/');
      } else {
        setError('Email o contraseña incorrectos');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="logo-icon">💄</span>
          <h1>Go Makeup</h1>
          <p>{isRegistering ? 'Crea tu cuenta' : 'Inicia sesión en tu cuenta'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
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

          <button type="submit" className="btn-login">
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-toggle">
          <p>
            {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
            <button 
              type="button" 
              className="btn-link" 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#FF2B73', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
            >
              {isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}
            </button>
          </p>
        </div>

        <div className="login-demo">
          <p>Cuentas de prueba:</p>
          <div className="demo-accounts">
            <div><strong>Usuario:</strong> usuario@gomakeup.com / user123</div>
          </div>
        </div>

        <Link to="/" className="back-home">Volver al inicio</Link>
      </div>
    </div>
  );
};

export default Login;
