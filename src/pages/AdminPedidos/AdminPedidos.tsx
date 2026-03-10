import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../AdminProductos/AdminProductos.css'; // Global admin styles

// Mock data para Pedidos
const historicoPedidos = [
  { fecha: '01/Mar', pedidos: 5, ingresos: 350 },
  { fecha: '02/Mar', pedidos: 8, ingresos: 520 },
  { fecha: '03/Mar', pedidos: 12, ingresos: 890 },
  { fecha: '04/Mar', pedidos: 7, ingresos: 480 },
  { fecha: '05/Mar', pedidos: 15, ingresos: 1250 },
  { fecha: '06/Mar', pedidos: 11, ingresos: 780 },
  { fecha: '07/Mar', pedidos: 18, ingresos: 1420 },
];

const pedidosRecientes = [
  { id: 'ORD-1045', cliente: 'Juan Pérez', total: 74.96, estado: 'pendiente', fecha: '07/Mar/2026' },
  { id: 'ORD-1044', cliente: 'Ana López', total: 49.99, estado: 'enviado', fecha: '07/Mar/2026' },
  { id: 'ORD-1043', cliente: 'Carlos García', total: 124.97, estado: 'entregado', fecha: '06/Mar/2026' },
  { id: 'ORD-1042', cliente: 'María Rodríguez', total: 89.50, estado: 'entregado', fecha: '05/Mar/2026' },
  { id: 'ORD-1041', cliente: 'Luis Fernández', total: 34.00, estado: 'cancelado', fecha: '04/Mar/2026' },
];

const AdminPedidos = () => {
  const [filtro, setFiltro] = useState('todos');

  const pedidosFiltrados = pedidosRecientes.filter(p => 
    filtro === 'todos' ? true : p.estado === filtro
  );

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Gestión de Pedidos</h1>
        <div className="section-actions">
          <select 
            className="filtro-select p-2 border rounded text-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="enviado">Enviados</option>
            <option value="entregado">Entregados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      <div className="chart-container">
        <h3>Histórico de Pedidos (Últimos 7 días)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={historicoPedidos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="fecha" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#D4AF37" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <Tooltip />
              <Area yAxisId="left" type="monotone" dataKey="pedidos" name="Nro. Pedidos" stroke="#1f2937" fillOpacity={0.1} />
              <Area yAxisId="right" type="monotone" dataKey="ingresos" name="Ingresos ($)" stroke="#D4AF37" fillOpacity={1} fill="url(#colorIngresos)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map(pedido => (
              <tr key={pedido.id}>
                <td className="font-mono font-medium">#{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td className="text-gray-500">{pedido.fecha}</td>
                <td className="font-medium">${pedido.total.toFixed(2)}</td>
                <td>
                  <span className={`estado-badge ${pedido.estado}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td>
                  <div className="table-actions" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    {pedido.estado === 'pendiente' && (
                      <button className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Actualizar a Enviado</button>
                    )}
                    {pedido.estado === 'enviado' && (
                      <button className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100">Actualizar a Entregado</button>
                    )}
                    {pedido.estado === 'pendiente' && (
                      <button className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Cancelar</button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900 text-sm font-medium ml-2">Detalles</button>
                  </div>
                </td>
              </tr>
            ))}
            {pedidosFiltrados.length === 0 && (
              <tr><td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>No hay pedidos en este estado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPedidos;
