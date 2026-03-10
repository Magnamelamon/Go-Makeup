import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './PerfilUsuario.css';

const PerfilUsuario = () => {
  const { user, updateCurrentUser } = useAuth();
  const navigate = useNavigate();

  // State for user info
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  // State for passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setNombre(user.nombre);
      setEmail(user.email);
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ nombre, email });
    alert('Información actualizada correctamente');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Ideally we would verify currentPassword against the DB here, 
    // but without backend or exposing password to context state safely this is tricky.
    // For simulation, we will assume it's correct if they match.
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    updateCurrentUser({ password: newPassword });
    setPasswordSuccess('Contraseña actualizada correctamente');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="perfil">
      <div className="container">
        <h1 className="perfil-titulo">Mi Perfil</h1>
        
        <div className="perfil-content">
          <aside className="perfil-menu">
            <div className="perfil-avatar">
              <div className="avatar-placeholder" style={{width: 80, height: 80, borderRadius: '50%', background: '#FF2B73', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 10px'}}>
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <h3>{user.nombre}</h3>
              <span>{user.email}</span>
            </div>
            <ul>
              <li className="active">Mis Datos</li>
              <li>Mis Pedidos (Próximamente)</li>
              <li>Direcciones (Próximamente)</li>
              <li>Métodos de Pago (Próximamente)</li>
            </ul>
          </aside>

          <main className="perfil-main">
            <div className="perfil-seccion">
              <h2>Información Personal</h2>
              <form className="perfil-form" onSubmit={handleUpdateInfo}>
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Fecha de Registro</label>
                  <input type="text" value={user.fechaRegistro} disabled style={{ backgroundColor: '#f3f4f6' }} />
                </div>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </form>
            </div>

            <div className="perfil-seccion">
              <h2>Cambiar Contraseña</h2>
              <form className="perfil-form" onSubmit={handleUpdatePassword}>
                {passwordError && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>{passwordError}</p>}
                {passwordSuccess && <p style={{ color: 'green', fontSize: '0.9rem', marginBottom: '1rem' }}>{passwordSuccess}</p>}
                
                <div className="form-group">
                  <label>Contraseña Actual</label>
                  <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
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
