import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllUsers, saveUser, deleteUser, type User } from '../../data/users';
import '../AdminProductos/AdminProductos.css';

// Mock data para usuarios - Crecimiento se mantiene estático por el momento
const crecimientoUsuarios = [
  { mes: 'Oct', nuevos: 45, activos: 320 },
  { mes: 'Nov', nuevos: 60, activos: 370 },
  { mes: 'Dic', nuevos: 120, activos: 480 },
  { mes: 'Ene', nuevos: 80, activos: 540 },
  { mes: 'Feb', nuevos: 95, activos: 610 },
  { mes: 'Mar', nuevos: 110, activos: 690 },
];

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modo, setModo] = useState<'lista' | 'editar'>('lista');
  const [usuarioEdit, setUsuarioEdit] = useState<Partial<User>>({});

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    setUsuarios(getAllUsers());
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.id.toString().includes(busqueda)
  );

  const handleEdit = (user: User) => {
    setUsuarioEdit(JSON.parse(JSON.stringify(user)));
    setModo('editar');
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de inhabilitar/eliminar a este usuario?')) {
      deleteUser(id);
      cargarUsuarios();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuarioEdit.id) {
      saveUser(usuarioEdit as User);
    }
    setModo('lista');
    cargarUsuarios();
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Gestión de Usuarios</h1>
        {modo === 'lista' ? (
          <button className="btn-primary" onClick={() => alert('Para invitar un usuario, por favor vaya a la página de login e inicie el proceso de registro.')}>+ Invitar Usuario</button>
        ) : (
          <button className="btn-secondary" onClick={() => setModo('lista')}>Volver a la Lista</button>
        )}
      </div>

      {modo === 'lista' && (
        <>
          <div className="chart-container">
            <h3>Crecimiento de Usuarios Activos (6 meses)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={crecimientoUsuarios}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="activos" fill="#1f2937" radius={[4, 4, 0, 0]} name="Usuarios Activos" />
                  <Bar dataKey="nuevos" fill="#FF2B73" radius={[4, 4, 0, 0]} name="Nuevos Registros" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="table-container">
            <div className="p-4 border-b border-gray-100">
              <input 
                type="text" 
                placeholder="Buscar por ID, nombre o correo..." 
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id}>
                    <td className="font-mono font-bold text-gray-800">#{usuario.id}</td>
                    <td className="font-medium">{usuario.nombre}</td>
                    <td className="text-gray-500">{usuario.email}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${usuario.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {usuario.rol.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`estado-badge ${usuario.estado}`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">{usuario.fechaRegistro}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon" title="Editar" onClick={() => handleEdit(usuario)}>✏️</button>
                        {usuario.rol !== 'admin' && (
                          <button className="btn-icon delete" title="Eliminar" onClick={() => handleDelete(usuario.id)}>🗑️</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {usuariosFiltrados.length === 0 && (
                  <tr><td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>No se encontraron usuarios.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modo === 'editar' && (
        <form className="admin-form-container" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group span-full">
              <label>ID del Usuario</label>
              <input type="text" value={usuarioEdit.id || ''} disabled />
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" required value={usuarioEdit.nombre || ''} onChange={e => setUsuarioEdit({...usuarioEdit, nombre: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" required value={usuarioEdit.email || ''} onChange={e => setUsuarioEdit({...usuarioEdit, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select value={usuarioEdit.rol} onChange={e => setUsuarioEdit({...usuarioEdit, rol: e.target.value as 'admin'|'usuario'})}>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select value={usuarioEdit.estado} onChange={e => setUsuarioEdit({...usuarioEdit, estado: e.target.value as 'activo'|'inactivo'})}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="form-group span-full">
              <label>Restablecer Contraseña (Dejar en blanco para no modificar)</label>
              <input 
                type="password" 
                placeholder="Nueva contraseña temporal..." 
                onChange={e => e.target.value ? setUsuarioEdit({...usuarioEdit, password: e.target.value}) : null} 
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminUsuarios;
