import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import '../AdminProductos/AdminProductos.css'; // Reutiliza layout global de panel
import './AdminInteracciones.css';

const dataCTR = [
  { day: 'Lun', visitas: 120, clicsComprar: 40 },
  { day: 'Mar', visitas: 150, clicsComprar: 60 },
  { day: 'Mié', visitas: 180, clicsComprar: 90 },
  { day: 'Jue', visitas: 220, clicsComprar: 110 },
  { day: 'Vie', visitas: 280, clicsComprar: 160 },
  { day: 'Sáb', visitas: 350, clicsComprar: 210 },
  { day: 'Dom', visitas: 300, clicsComprar: 180 },
];

const dataFunnel = [
  { name: 'Visitas Generales', value: 3400 },
  { name: 'Vistas de Producto', value: 2100 },
  { name: 'Clics en Comprar (Shein/TikTok)', value: 850 },
  { name: 'Clics a Compra Externa', value: 400 }
];
const COLORS = ['#FF2B73', '#FF7BAC', '#FFB6C1', '#FFE4EC'];

const AdminInteracciones = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Analítica e Interacciones</h1>
        <div className="date-filter">
          <select className="form-select border rounded p-2 text-sm shadow-sm">
            <option>Últimos 7 días</option>
            <option>Último mes</option>
            <option>Histórico</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Click-Through Rate (Global)</div>
          <div className="kpi-value highlight-value">11.7%</div>
          <div className="kpi-trend positive">↑ +2.4% vs semana pasada</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Clics de Compra Outbound</div>
          <div className="kpi-value">850</div>
          <div className="kpi-trend positive">↑ +140 vs semana pasada</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Visitas Totales a Catálogo</div>
          <div className="kpi-value">5,240</div>
          <div className="kpi-trend negative">↓ -5% vs semana pasada</div>
        </div>
      </div>

      <div className="charts-grid-analytics">
        <div className="chart-container span-full">
          <h3>Visitas vs Clics de Compra (Últimos 7 días)</h3>
          <p className="chart-subtitle">Se mide el interés generado que redirige a la pasarela de compra externa.</p>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={dataCTR} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF2B73" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF2B73" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="visitas" name="Visitas" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisitas)" />
                <Area type="monotone" dataKey="clicsComprar" name="Clics (Compra)" stroke="#FF2B73" fillOpacity={1} fill="url(#colorClics)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Embudo de Interacción (Funnel)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dataFunnel}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                >
                  {dataFunnel.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInteracciones;
