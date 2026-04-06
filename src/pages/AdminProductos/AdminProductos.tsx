import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { type Producto, type Variante } from '../../data/products';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { API_BASE } from '../../config/api';
import { authFetch } from '../../config/auth';
import './AdminProductos.css';

const AdminProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modo, setModo] = useState<'lista' | 'crear'>('lista');
  const [esEdicion, setEsEdicion] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto>>({
    id: '', nombre: '', descripcion: '', categoria: 'labiales', marca: '', urlShein: '', urlTiktok: '', variantes: []
  });
  
  // Nuevo Estado para el creador de variantes
  const [nuevaVariante, setNuevaVariante] = useState<Variante>({
    id_variante: `var-${Date.now()}`, color: '#ff0000', color_nombre: '', precio: 0, precio_descuento: null, stock: 0, imagenes: []
  });
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    cargarProductos();
  }, [modo]); // Recargar al volver a la lista

  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error cargando los productos desde la base de datos.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto de PostgreSQL? Esta acción no se puede deshacer.')) {
      try {
        const res = await authFetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          cargarProductos();
        } else {
          alert('Error al eliminar');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // We can rely on esEdicion flag to know if we are doing PUT or POST
    const method = esEdicion ? 'PUT' : 'POST';
    const finalProductId = nuevoProducto.id || `prod-${Date.now()}`;
    const url = esEdicion 
      ? `${API_BASE}/products/${finalProductId}` 
      : `${API_BASE}/products`;

    const payload = { ...nuevoProducto, id: finalProductId };

    try {
      const res = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModo('lista');
      } else {
        const errorData = await res.json();
        alert(`Error al guardar: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error de conexión al servidor al guardar.');
    }
  };

  const handleEdit = (prod: Producto) => {
    // Clona el producto para no mutar el estado original accidentalmente
    setNuevoProducto(JSON.parse(JSON.stringify(prod)));
    setEsEdicion(true);
    setModo('crear');
  };

  const handleCreateNew = () => {
    setNuevoProducto({
      id: '', nombre: '', descripcion: '', categoria: 'labiales', marca: '', urlShein: '', urlTiktok: '', variantes: []
    });
    setEsEdicion(false);
    setModo('crear');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const subirLista = async (lista: Producto[]) => {
      try {
        for (const prod of lista) {
          await authFetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prod)
          });
        }
        cargarProductos();
        alert('¡Feed cargado y sincronizado exitosamente con la base de datos!');
      } catch (err) {
        alert('Error conectando a la base de datos al subir el feed.');
      }
    };

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
                categoria: (row.categoria || 'labiales').trim().toLowerCase(),
                marca: row.marca || row.brand || '',
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
          
          subirLista(Array.from(parsedProducts.values()));
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
            subirLista(jsonContent);
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

  const procesarSubida = async (fileOrUrl: File | string) => {
    setSubiendoImagen(true);
    
    try {
      let imageUrl = '';
      
      if (typeof fileOrUrl === 'string') {
        const response = await authFetch(`${API_BASE}/upload-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: fileOrUrl }),
        });
        if (!response.ok) throw new Error('Error al descargar la imagen remota');
        imageUrl = await response.json();
      } else {
        const formData = new FormData();
        formData.append('image', fileOrUrl);
        const response = await authFetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Error al subir la imagen local');
        imageUrl = await response.json();
      }

      const fullImageUrl = `${API_BASE.replace('/api', '')}${imageUrl}`;
      setNuevaVariante(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, fullImageUrl]
      }));
      
    } catch (error: any) {
      alert(error.message || 'Hubo un error procesando la imagen.');
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleVariantFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarSubida(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (subiendoImagen) return;
    
    // Check for a dropped URL (Pinterest, Drive, Google Images)
    const urlStr = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (urlStr && urlStr.startsWith('http')) {
      const cleanUrl = urlStr.split('\n')[0].trim();
      return procesarSubida(cleanUrl);
    }

    // Otherwise standard local file drops
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      procesarSubida(e.dataTransfer.files[0]);
    }
  };

  const handleUrlPaste = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const url = e.currentTarget.value.trim();
      if (url.startsWith('http')) {
        procesarSubida(url);
        e.currentTarget.value = '';
      }
    }
  };

  const agregarVariante = () => {
    if (!nuevaVariante.color_nombre || nuevaVariante.precio <= 0) {
      alert('Debes ingresar al menos el nombre del color y un precio válido.');
      return;
    }
    setNuevoProducto(prev => ({
      ...prev,
      variantes: [...(prev.variantes || []), { ...nuevaVariante, id_variante: `var-${Date.now()}` }]
    }));
    // Resetear form de variante
    setNuevaVariante({
      id_variante: `var-${Date.now()}`, color: '#ff0000', color_nombre: '', precio: 0, precio_descuento: null, stock: 0, imagenes: []
    });
  };

  const eliminarVariante = (id_variante: string) => {
    setNuevoProducto(prev => ({
      ...prev,
      variantes: (prev.variantes || []).filter(v => v.id_variante !== id_variante)
    }));
  };

  // Datos para gráfica (normalizado para evitar duplicados como "labiales" vs "Labiales")
  const categoriasStock = productos.reduce((acc: {name: string, stock: number}[], current: Producto) => {
    const totalStock = current.variantes.reduce((sum: number, v: Variante) => sum + v.stock, 0);
    const normalized = (current.categoria || 'sin categoría').trim().toLowerCase();
    const displayName = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    const existing = acc.find((c: {name: string, stock: number}) => c.name === displayName);
    if (existing) {
      existing.stock += totalStock;
    } else {
      acc.push({ name: displayName, stock: totalStock });
    }
    return acc;
  }, [] as {name: string, stock: number}[]);

  // Categorías dinámicas extraídas de los productos existentes
  const categoriasExistentes = [...new Set(productos.map(p => (p.categoria || '').trim().toLowerCase()).filter(Boolean))];

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
                      <td className="font-medium">
                        {prod.nombre}
                        {prod.marca && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Marca: {prod.marca}</div>}
                      </td>
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
            <div className="form-group span-full">
              <label>Marca (Opcional)</label>
              <input type="text" value={nuevoProducto.marca || ''} onChange={e => setNuevoProducto({...nuevoProducto, marca: e.target.value})} placeholder="Ej. Maybelline, L'Oréal..." />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <input 
                list="categorias-list"
                type="text" 
                value={nuevoProducto.categoria} 
                onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value.toLowerCase()})}
                placeholder="Escribe o selecciona una categoría"
                required
              />
              <datalist id="categorias-list">
                {categoriasExistentes.map(cat => (
                  <option key={cat} value={cat} />
                ))}
                {!categoriasExistentes.includes('labiales') && <option value="labiales" />}
                {!categoriasExistentes.includes('ojos') && <option value="ojos" />}
                {!categoriasExistentes.includes('rostro') && <option value="rostro" />}
                {!categoriasExistentes.includes('uñas') && <option value="uñas" />}
              </datalist>
            </div>
            <div className="form-group">
              <label>ID del Producto</label>
              <input 
                type="text" 
                value={nuevoProducto.id} 
                onChange={e => setNuevoProducto({...nuevoProducto, id: e.target.value})} 
                placeholder="Autogenerado si está vacío" 
                disabled={esEdicion} 
              />
            </div>
            <div className="form-group span-full variant-builder">
              <h4>Variantes del Producto</h4>
              
              {/* Lista de variantes agregadas */}
              {nuevoProducto.variantes && nuevoProducto.variantes.length > 0 && (
                <div className="variants-list" style={{ marginBottom: '24px' }}>
                  {nuevoProducto.variantes.map(v => (
                    <div key={v.id_variante} className="variants-list-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: v.color, border: '2px solid white', boxShadow: '0 0 0 1px #e5e7eb' }}></div>
                        <strong style={{ fontSize: '1.1rem' }}>{v.color_nombre}</strong>
                        <span style={{ color: '#6b7280' }}>|</span>
                        <span style={{ fontWeight: '500' }}>${v.precio}</span>
                        <span style={{ color: '#6b7280' }}>|</span>
                        <span style={{ color: v.stock > 0 ? '#10b981' : '#ef4444', fontWeight: '500' }}>{v.stock} uds.</span>
                        <span style={{ color: '#6b7280' }}>|</span>
                        <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>📸 {v.imagenes.length} foto(s)</span>
                      </div>
                      <button type="button" onClick={() => eliminarVariante(v.id_variante)} className="btn-icon delete" title="Eliminar Variante">🗑️</button>
                    </div>
                  ))}
                </div>
              )}

              <p className="helper-text" style={{ fontWeight: '500', marginBottom: '8px' }}>Paso 1: Información de la variante</p>
              
              <div className="variant-row">
                <input type="text" placeholder="Nombre Color (Ej. Rojo Rubí)" value={nuevaVariante.color_nombre} onChange={e => setNuevaVariante({...nuevaVariante, color_nombre: e.target.value})} />
                <input type="color" value={nuevaVariante.color} onChange={e => setNuevaVariante({...nuevaVariante, color: e.target.value})} />
                <input type="number" placeholder="Precio ($)" value={nuevaVariante.precio || ''} onChange={e => setNuevaVariante({...nuevaVariante, precio: parseFloat(e.target.value) || 0})} />
                <input type="number" placeholder="Stock" value={nuevaVariante.stock || ''} onChange={e => setNuevaVariante({...nuevaVariante, stock: parseInt(e.target.value) || 0})} />
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <p className="helper-text" style={{ fontWeight: '500', marginBottom: '12px' }}>Paso 2: Imágenes (Máximo 5)</p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  
                  {nuevaVariante.imagenes.length < 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div 
                        className="file-upload-wrapper"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        title="Arrastra una foto local o solta un link web aquí"
                      >
                        <span className="file-upload-icon">📸</span>
                        <span className="file-upload-text">
                          {subiendoImagen ? 'Procesando...' : 'Arrastra / Clic aquí'}
                        </span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleVariantFileUpload}
                          disabled={subiendoImagen}
                        />
                      </div>
                      <input 
                         type="url" 
                         placeholder="O pega link y pulsa Enter..." 
                         style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', width: '100%', fontSize: '0.8rem', background: '#f9fafb' }}
                         onKeyDown={handleUrlPaste}
                         disabled={subiendoImagen}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {nuevaVariante.imagenes.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <img src={img} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button"
                          onClick={() => setNuevaVariante(prev => ({...prev, imagenes: prev.imagenes.filter((_, i) => i !== idx)}))}
                          style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Eliminar foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              <button type="button" className="btn-add-variant" onClick={agregarVariante}>
                <span>✨</span> Confirmar y Añadir Variante al Producto
              </button>
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
