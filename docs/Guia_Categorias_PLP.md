# 🗂️ Guía: Cómo Crear una Nueva Categoría de Productos (Nuevo PLP)

En la arquitectura dinámica de **Go Makeup**, crear una nueva categoría (ejemplo: *"Cejas"*, *"Skincare"*, *"Accesorios"*) no requiere programación compleja en la base de datos PostgreSQL, ya que esta guarda simplemente el "nombre" de la categoría (como un texto). 

Todo el proceso consiste en informarle a React que esa categoría existe para que los menús y filtros comiencen a atraparla y generen la página lista para el cliente (PLP: Product Listing Page).

Sigue estos **4 sencillos pasos** (en ese orden) para agregar una nueva categoría exitosamente de punta a punta:

---

## Paso 1: Habilitarla en el Creador de Productos (El Administrador)
Para que tú (o tu equipo) puedan guardar maquillajes bajo esta nueva categoría, debes agregar la opción en el formulario de creación en el panel `GoAdmin`.

**Archivo a modificar:** `src/pages/AdminProductos/AdminProductos.tsx`

Busca el código de `<select>` donde dice "Categoría" y agrega tu nueva etiqueta `<option>`. Asegúrate de que el **value** esté siempre en **minúsculas y sin acentos ni espacios** (esta será la verdadera llave en la Base de Datos).

```tsx
<select value={nuevoProducto.categoria} onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}>
  <option value="labiales">Labios</option>
  <option value="ojos">Ojos</option>
  <option value="rostro">Rostro</option>
  <option value="uñas">Uñas</option>
  {/* NUEVA CATEGORÍA AQUÍ ABAJO */}
  <option value="cejas">Cejas Perfiladas</option>
</select>
```
> 🎉 **¡Listo!** Desde este momento, cualquier producto guardado con esa opción aterrizará en PostgreSQL registrado firmemente bajo la clave de seguridad `"cejas"`.

---

## Paso 2: Agregar el enlace en el Menú Principal (Navbar)
Ahora que los productos ya existen en la base de datos, tienes que darle a tus clientes un botón para llegar a ellos en la barra de navegación superior.

**Archivo a modificar:** `src/components/Navbar/Navbar.tsx`

Agrega un nuevo `<li>` apuntando hacia el link genético `/catalogo/nombre-de-tu-value`. Debe coincidir exactamente con el **value** del Paso 1.

```tsx
<ul className="navbar-menu">
  <li><Link to="/">Inicio</Link></li>
  <li><Link to="/catalogo">Catálogo</Link></li>
  <li><Link to="/catalogo/labiales">Labios</Link></li>
  <li><Link to="/catalogo/ojos">Ojos</Link></li>
  <li><Link to="/catalogo/rostro">Rostro</Link></li>
  <li><Link to="/catalogo/uñas">Uñas</Link></li>
  {/* NUEVO ENLACE AQUÍ ABAJO */}
  <li><Link to="/catalogo/cejas">Cejas</Link></li>
  <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
</ul>
```

---

## Paso 3: Agregarla a la Barra Lateral del Catálogo (Filtros)
Cuando el usuario ya está viendo maquillajes, hay un panel izquierdo que le sirve para brincar entre categorías.

**Archivo a modificar:** `src/pages/Catalogo/Catalogo.tsx`

Ve al arreglo llamado `categoriasDisponibles`. Agrega una nueva línea. El `id` debe volver a ser tu palabra mágica secreta (ej. *"cejas"*). La `imagen` es opcional, pero pon una de muestra si en el futuro decides inyectar fotos a ese panel.

```tsx
const categoriasDisponibles = [
  { id: 'labiales', nombre: 'Labios', imagen: 'https://imagen...' },
  { id: 'ojos', nombre: 'Ojos', imagen: 'https://imagen...' },
  { id: 'rostro', nombre: 'Rostro', imagen: 'https://imagen...' },
  { id: 'uñas', nombre: 'Uñas', imagen: 'https://imagen...' },
  // NUEVA OPCIÓN AQUÍ ABAJO
  { id: 'cejas', nombre: 'Cejas', imagen: 'https://imagen-cejas.jpg' }
];
```

---

## Paso 4: (Opcional) Agregarlo a las burbujas de la Página Principal (Home)
Si quieres que tu nueva categoría se luzca con una foto redonda bonita en el inicio de la tienda web.

**Archivo a modificar:** `src/pages/Home/Home.tsx`

De igual modo, busca el arreglo llamado `categorias`:
```tsx
const categorias = [
  { nombre: 'Labios', imagen: 'https://...', link: '/catalogo/labiales' },
  { nombre: 'Ojos', imagen: 'https://...', link: '/catalogo/ojos' },
  { nombre: 'Rostro', imagen: 'https://...', link: '/catalogo/rostro' },
  { nombre: 'Uñas', imagen: 'https://...', link: '/catalogo/uñas' },
  // NUEVA BURBUJA AQUÍ ABAJO
  { nombre: 'Cejas', imagen: 'https://foto-de-burbuja.jpg', link: '/catalogo/cejas' }
];
```

---

### Misión Cumplida 🚀
Al hacer estos pasos, si el cliente hace clic en el enlace, el PLP (`Product Listing Page`) nacerá automáticamente de las entrañas de `Catalogo.tsx`. No necesitas crear ninguna página ni código nuevo. El PLP es inteligente: leerá en la URL la última palabra (`/cejas`), buscará en la base de datos PostgreSQL, extraerá todos los maquillajes donde aplique `categoria === "cejas"` y los dibujará en pantalla sin fallar.
