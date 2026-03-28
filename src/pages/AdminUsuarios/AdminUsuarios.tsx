import { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';
import './AdminUsuarios.css';

interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  permisos: { puede_gestionar_catalogo: boolean; puede_gestionar_usuarios: boolean };
  ultimo_acceso: string | null;
  createdAt: string;
}

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [modo, setModo] = useState<'lista' | 'crear'>('lista');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, [modo]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admins`);
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.email) {
      alert('Nombre y email son obligatorios.');
      return;
    }

    if (!editId && !form.password) {
      alert('La contraseña es obligatoria al crear un usuario nuevo.');
      return;
    }

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_BASE}/admins/${editId}` : `${API_BASE}/admins`;
    const payload: any = { nombre: form.nombre, email: form.email };
    if (form.password) payload.password = form.password;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setForm({ nombre: '', email: '', password: '' });
        setEditId(null);
        setModo('lista');
      } else {
        const err = await res.json();
        alert(err.message || 'Error al guardar');
      }
    } catch (error) {
      alert('Error de conexión al guardar usuario.');
    }
  };

  const handleEdit = (user: AdminUser) => {
    setForm({ nombre: user.nombre, email: user.email, password: '' });
    setEditId(user.id);
    setModo('crear');
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar al administrador "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`${API_BASE}/admins/${id}`, { method: 'DELETE' });
      if (res.ok) {
        cargarUsuarios();
      } else {
        alert('Error al eliminar usuario');
      }
    } catch (error) {
      alert('Error de conexión al eliminar.');
    }
  };

  const handleCreateNew = () => {
    setForm({ nombre: '', email: '', password: '' });
    setEditId(null);
    setModo('crear');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Nunca';
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Gestión de Usuarios</h1>
        {modo === 'lista' ? (
          <button className="btn-primary" onClick={handleCreateNew}>
            + Nuevo Administrador
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => { setModo('lista'); setEditId(null); }}>
            Volver a la Lista
          </button>
        )}
      </div>

      {modo === 'lista' && (
        <>
          <div className="usuarios-stats">
            <div className="stat-card">
              <span className="stat-number">{usuarios.length}</span>
              <span className="stat-label">Administradores</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {usuarios.filter(u => u.ultimo_acceso).length}
              </span>
              <span className="stat-label">Han iniciado sesión</span>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando usuarios...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Último Acceso</th>
                    <th>Registrado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(user => (
                    <tr key={user.id}>
                      <td className="font-medium">
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.nombre.charAt(0).toUpperCase()}
                          </div>
                          {user.nombre}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`access-badge ${user.ultimo_acceso ? 'has-access' : 'no-access'}`}>
                          {formatDate(user.ultimo_acceso)}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon" title="Editar" onClick={() => handleEdit(user)}>✏️</button>
                          <button className="btn-icon delete" title="Eliminar" onClick={() => handleDelete(user.id, user.nombre)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No hay administradores registrados.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {modo === 'crear' && (
        <form className="admin-form-container" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group span-full">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                required 
                value={form.nombre} 
                onChange={e => setForm({ ...form, nombre: e.target.value })} 
                placeholder="Ej. María García" 
              />
            </div>
            <div className="form-group span-full">
              <label>Email</label>
              <input 
                type="email" 
                required 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                placeholder="admin@gomakeup.com" 
              />
            </div>
            <div className="form-group span-full">
              <label>{editId ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
              <input 
                type="password" 
                required={!editId}
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                placeholder={editId ? '••••••••' : 'Mínimo 6 caracteres'}
                minLength={6}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editId ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminUsuarios;
