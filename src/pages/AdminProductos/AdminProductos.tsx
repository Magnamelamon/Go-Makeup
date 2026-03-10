import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { getAllProducts, saveProducto, deleteProducto, bulkSaveProducts, type Producto, type Variante } from '../../data/products';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import './AdminProductos.css';

const AdminProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modo, setModo] = useState<'lista' | 'crear'>('lista');
  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto>>({
    id: '', nombre: '', descripcion: '', categoria: 'labiales', urlShein: '', urlTiktok: '', variantes: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setProductos(getAllProducts());
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProducto(id);
      cargarProductos();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoProducto.id) {
      nuevoProducto.id = `prod-${Date.now()}`;
    }
    saveProducto(nuevoProducto as Producto);
    setModo('lista');
    cargarProductos();
  };

  const handleEdit = (prod: Producto) => {
    // Clona el producto para no mutar el estado original accidentalmente
    setNuevoProducto(JSON.parse(JSON.stringify(prod)));
    setModo('crear');
  };

  const handleCreateNew = () => {
    setNuevoProducto({
      id: '', nombre: '', descripcion: '', categoria: 'labiales', urlShein: '', urlTiktok: '', variantes: []
    });
    setModo('crear');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedProducts = new Map<string, Producto>();
          
          results.data.forEach((row: any) => {
            if (!row.id || !row.nombre) return;
            
            if (!parsedProducts.has(row.id)) {
              parsedProducts.set(row.id, {
                id: row.id,
                nombre: row.nombre,
                descripcion: row.descripcion || '',
                categoria: row.categoria || 'labiales',
                urlShein: row.urlShein || '',
                urlTiktok: row.urlTiktok || '',
                variantes: []
              });
            }
            
            const pr = parsedProducts.get(row.id)!;
            
            if (row.id_variante) {
              const imagenes = [row.imagen_1, row.imagen_2, row.imagen_3, row.imagen_4, row.imagen_5].filter(Boolean);
              pr.variantes.push({
                id_variante: row.id_variante,
                color: row.color || '#000000',
                color_nombre: row.color_nombre || 'Muestra',
                precio: parseFloat(row.precio) || 0,
                precio_descuento: row.precio_descuento ? parseFloat(row.precio_descuento) : null,
                stock: parseInt(row.stock) || 0,
                imagenes: imagenes
              });
            }
          });
          
          bulkSaveProducts(Array.from(parsedProducts.values()));
          cargarProductos();
          alert('¡Feed CSV cargado y sincronizado exitosamente!');
        },
        error: (error: Error) => {
          alert('Error parseando CSV: ' + error.message);
        }
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonContent = JSON.parse(event.target?.result as string);
          if (Array.isArray(jsonContent)) {
            bulkSaveProducts(jsonContent);
            cargarProductos();
            alert('¡Feed JSON cargado y sincronizado exitosamente!');
          } else {
            alert('El archivo JSON debe contener un arreglo de productos.');
          }
        } catch (error) {
          alert('Error al leer el archivo JSON. Verifica su formato.');
        }
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      alert('Formato de archivo no soportado. Sube un .json o .csv');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Datos para gráfica
  const categoriasStock = productos.reduce((acc: {name: string, stock: number}[], current: Producto) => {
    const totalStock = current.variantes.reduce((sum: number, v: Variante) => sum + v.stock, 0);
    const existing = acc.find((c: {name: string, stock: number}) => c.name === current.categoria);
    if (existing) {
      existing.stock += totalStock;
    } else {
      acc.push({ name: current.categoria, stock: totalStock });
    }
    return acc;
  }, [] as {name: string, stock: number}[]);

  const COLORS = ['#FF2B73', '#D4AF37', '#1F2937', '#E31C60', '#6B7280'];

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Gestión de Productos</h1>
        {modo === 'lista' ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="file" 
              accept=".json,.csv" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
            <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
              📤 Cargar Feed (JSON/CSV)
            </button>
            <button className="btn-primary" onClick={handleCreateNew}>
              + Agregar Producto
            </button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={() => setModo('lista')}>
            Volver a la Lista
          </button>
        )}
      </div>

      {modo === 'lista' && (
        <>
          <div className="chart-container">
            <h3>Distribución de Stock por Categoría</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoriasStock}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                    {categoriasStock.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Variantes</th>
                  <th>Stock Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod: Producto) => {
                  const stockTotal = prod.variantes.reduce((sum: number, v: Variante) => sum + v.stock, 0);
                  return (
                    <tr key={prod.id}>
                      <td className="font-mono text-sm text-gray-500">#{prod.id}</td>
                      <td className="font-medium">{prod.nombre}</td>
                      <td><span className="categoria-badge">{prod.categoria}</span></td>
                      <td>{prod.variantes.length} colores</td>
                      <td>
                        <span className={`stock-badge ${stockTotal === 0 ? 'stock-out' : 'stock-in'}`}>
                          {stockTotal}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon" title="Editar" onClick={() => handleEdit(prod)}>✏️</button>
                          <button className="btn-icon delete" onClick={() => handleDelete(prod.id)} title="Eliminar">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {productos.length === 0 && (
                  <tr><td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>No hay productos. Agrega uno nuevo.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modo === 'crear' && (
        <form className="admin-form-container" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group span-full">
              <label>Nombre del Producto</label>
              <input type="text" required value={nuevoProducto.nombre} onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} placeholder="Ej. Labial Matte Premium" />
            </div>
            <div className="form-group span-full">
              <label>Descripción</label>
              <textarea required rows={4} value={nuevoProducto.descripcion} onChange={e => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})} placeholder="Describe los beneficios del producto..."></textarea>
            </div>
            <div className="form-group span-full">
              <label>URL de Shein (Opcional)</label>
              <input type="url" value={nuevoProducto.urlShein || ''} onChange={e => setNuevoProducto({...nuevoProducto, urlShein: e.target.value})} placeholder="https://shein.com/..." />
            </div>
            <div className="form-group span-full">
              <label>URL de TikTok Shop (Opcional)</label>
              <input type="url" value={nuevoProducto.urlTiktok || ''} onChange={e => setNuevoProducto({...nuevoProducto, urlTiktok: e.target.value})} placeholder="https://tiktok.com/..." />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select value={nuevoProducto.categoria} onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}>
                <option value="labios">Labios</option>
                <option value="ojos">Ojos</option>
                <option value="rostro">Rostro</option>
                <option value="uñas">Uñas</option>
              </select>
            </div>
            <div className="form-group">
              <label>ID del Producto</label>
              <input 
                type="text" 
                value={nuevoProducto.id} 
                onChange={e => setNuevoProducto({...nuevoProducto, id: e.target.value})} 
                placeholder="Autogenerado si está vacío" 
                disabled={!!nuevoProducto.id && modo === 'crear'} // Si ya tiene ID al entrar a modo crear (edición), se deshabilita
              />
            </div>
            <div className="form-group span-full variant-builder">
              <h4>Generador de Variantes (Simulado)</h4>
              <p className="helper-text">Agrega la información de una variante básica para completar la carga inicial.</p>
              
              <div className="variant-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                <input type="text" placeholder="Nombre Color (Ej. Rojo Rubí)" />
                <input type="color" defaultValue="#ff0000" />
                <input type="number" placeholder="Precio ($)" />
                <input type="number" placeholder="Stock" />
              </div>
              <p className="helper-text" style={{marginTop: '12px'}}>Imágenes de la variante (Hasta 5):</p>
              <div className="variant-images" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
                <input type="text" placeholder="URL Foto 1 (Principal)" />
                <input type="text" placeholder="URL Foto 2" />
                <input type="text" placeholder="URL Foto 3" />
                <input type="text" placeholder="URL Foto 4" />
                <input type="text" placeholder="URL Foto 5" />
              </div>
              <button type="button" className="btn-add-variant">+ Agregar Otra Variante</button>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Guardar Producto</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminProductos;
