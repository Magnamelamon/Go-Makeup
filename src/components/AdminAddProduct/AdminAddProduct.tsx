import { useState } from 'react';
import './AdminAddProduct.css';

interface Variante {
  id_variante: string;
  color: string;
  color_nombre: string;
  precio: number;
  precio_descuento: number | null;
  stock: number;
  imagenes: string[];
}

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  variantes: Variante[];
}

const categorias = [
  'Labios',
  'Ojos',
  'Rostro',
  'Uñas',
  'Skincare',
  'Accesorios'
];

const generateId = () => `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const generateProductId = () => `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function AdminAddProduct() {
  const [producto, setProducto] = useState<Producto>({
    id: generateProductId(),
    nombre: '',
    descripcion: '',
    categoria: '',
    variantes: []
  });

  const agregarVariante = () => {
    const nuevaVariante: Variante = {
      id_variante: generateId(),
      color: '#000000',
      color_nombre: '',
      precio: 0,
      precio_descuento: null,
      stock: 0,
      imagenes: []
    };
    setProducto({
      ...producto,
      variantes: [...producto.variantes, nuevaVariante]
    });
  };

  const eliminarVariante = (id_variante: string) => {
    setProducto({
      ...producto,
      variantes: producto.variantes.filter(v => v.id_variante !== id_variante)
    });
  };

  const actualizarVariante = (id_variante: string, campo: keyof Variante, valor: string | number | string[] | null) => {
    setProducto({
      ...producto,
      variantes: producto.variantes.map(v =>
        v.id_variante === id_variante ? { ...v, [campo]: valor } : v
      )
    });
  };

  const manejarImagenesVariante = (id_variante: string, archivos: FileList | null) => {
    if (!archivos) return;
    const URLs: string[] = [];
    for (let i = 0; i < Math.min(archivos.length, 5); i++) {
      URLs.push(URL.createObjectURL(archivos[i]));
    }
    actualizarVariante(id_variante, 'imagenes', URLs);
  };

  const guardarProducto = () => {
    const productoFinal = {
      ...producto,
      precio_descuento: null
    };
    console.log('=== PRODUCTO JSON (copia y pega en products.json) ===');
    console.log(JSON.stringify(productoFinal, null, 2));
    alert('Producto guardado en consola (F12 para ver el JSON)');
  };

  const limpiarFormulario = () => {
    setProducto({
      id: generateProductId(),
      nombre: '',
      descripcion: '',
      categoria: '',
      variantes: []
    });
  };

  return (
    <div className="admin-add-product">
      <div className="admin-add-container">
        <h1 className="admin-add-title">
          Agregar Nuevo Producto
        </h1>

        <div className="admin-add-section">
          <h2 className="admin-add-section-title">
            Datos Generales
          </h2>
          
          <div className="admin-add-grid">
            <div className="admin-add-full">
              <label className="admin-add-label">
                Nombre del Producto
              </label>
              <input
                type="text"
                value={producto.nombre}
                onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                className="admin-add-input"
                placeholder="Ej: Pintura Labial Velvet"
              />
            </div>

            <div className="admin-add-full">
              <label className="admin-add-label">
                Descripción
              </label>
              <textarea
                value={producto.descripcion}
                onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
                rows={4}
                className="admin-add-textarea"
                placeholder="Describe las características del producto..."
              />
            </div>

            <div className="admin-add-full">
              <label className="admin-add-label">
                Categoría
              </label>
              <select
                value={producto.categoria}
                onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
                className="admin-add-select"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="admin-add-section">
          <div className="admin-add-header">
            <h2>
              Variantes de Color
            </h2>
            <button
              onClick={agregarVariante}
              className="admin-add-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Variante
            </button>
          </div>

          {producto.variantes.length === 0 ? (
            <div className="admin-add-vacio">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <p className="admin-add-vacio-text">No hay variantes agregadas</p>
              <span>Agrega al menos una variante para continuar</span>
            </div>
          ) : (
            <div className="admin-add-variantes">
              {producto.variantes.map((variante, index) => (
                <div key={variante.id_variante} className="admin-add-variante">
                  <div className="admin-add-variante-header">
                    <h3>
                      <span className="admin-add-variante-numero">
                        {index + 1}
                      </span>
                      <span className="admin-add-variante-id">
                        Variante #{variante.id_variante.slice(-8)}
                      </span>
                    </h3>
                    <button
                      onClick={() => eliminarVariante(variante.id_variante)}
                      className="admin-add-delete-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="admin-add-colores-grid">
                    <div>
                      <label className="admin-add-label">
                        Nombre Color
                      </label>
                      <input
                        type="text"
                        value={variante.color_nombre}
                        onChange={(e) => actualizarVariante(variante.id_variante, 'color_nombre', e.target.value)}
                        className="admin-add-input"
                        placeholder="Ej: Rose Nude"
                      />
                    </div>

                    <div>
                      <label className="admin-add-label">
                        Color Hex
                      </label>
                      <div className="admin-add-color-input">
                        <input
                          type="color"
                          value={variante.color}
                          onChange={(e) => actualizarVariante(variante.id_variante, 'color', e.target.value)}
                          className="admin-add-color-picker"
                        />
                        <input
                          type="text"
                          value={variante.color}
                          onChange={(e) => actualizarVariante(variante.id_variante, 'color', e.target.value)}
                          className="admin-add-input"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="admin-add-label">
                        Precio ($)
                      </label>
                      <input
                        type="number"
                        value={variante.precio || ''}
                        onChange={(e) => actualizarVariante(variante.id_variante, 'precio', parseFloat(e.target.value) || 0)}
                        className="admin-add-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="admin-add-label">
                        Precio Descuento ($)
                      </label>
                      <input
                        type="number"
                        value={variante.precio_descuento || ''}
                        onChange={(e) => actualizarVariante(variante.id_variante, 'precio_descuento', e.target.value ? parseFloat(e.target.value) : null)}
                        className="admin-add-input"
                        placeholder="Opcional"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="admin-add-label">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={variante.stock || ''}
                        onChange={(e) => actualizarVariante(variante.id_variante, 'stock', parseInt(e.target.value) || 0)}
                        className="admin-add-input"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="admin-add-imagenes">
                    <label className="admin-add-imagenes-label">
                      Imágenes (máximo 5)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => manejarImagenesVariante(variante.id_variante, e.target.files)}
                      className="admin-add-file-input"
                    />
                    {variante.imagenes.length > 0 && (
                      <div className="admin-add-imagenes-preview">
                        {variante.imagenes.map((img, idx) => (
                          <div key={idx} className="admin-add-imagen-preview">
                            <img
                              src={img}
                              alt={`Imagen ${idx + 1}`}
                            />
                            <span className="admin-add-imagen-numero">
                              {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="admin-add-imagenes-count">
                      {variante.imagenes.length}/5 imágenes seleccionadas
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-add-actions">
          <button
            onClick={limpiarFormulario}
            className="admin-add-limpiar"
          >
            Limpiar Formulario
          </button>
          <button
            onClick={guardarProducto}
            className="admin-add-guardar"
          >
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}
