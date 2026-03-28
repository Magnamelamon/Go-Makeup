# Documentación de Integración: Catálogo (CLP - Category Listing Page)

Este documento detalla la integración de la página del Catálogo general con la API Backend (Node.js/Express) que extrae los datos de MongoDB.

## 1. ¿Qué funcionalidad cumple esta integración?
El objetivo principal es eliminar los datos estáticos (`dummy data`) e integrar un flujo dinámico. Cuando el usuario navega a la página del catálogo general (`/catalogo`) o a una categoría específica (como `/catalogo/labios`), la aplicación pide la lista de productos al servidor en tiempo real.

## 2. Archivos Afectados y Cómo Funciona

**Archivo Principal:** `src/pages/Catalogo/Catalogo.tsx`

### El Flujo de Datos (Cómo lo hacemos)
1. **Inicialización (Estado de carga):**
   Al cargar la página, React define un estado inicial vacío `[productos, setProductos] = useState([])` y activa una bandera `loading = true`. Muestra en pantalla un texto "Cargando catálogo...".
2. **Consumo de la API (`useEffect`):**
   Automáticamente, React lanza una petición asíncrona: `fetch('http://localhost:5000/api/products')`.
3. **Resolución:**
   Cuando el servidor Backend responde con el JSON de productos, React usa `setProductos(data)` para popular el estado y apaga la bandera de carga (`loading = false`).
4. **Filtrado Dinámico en el Cliente:**
   El componente revisa la URL actual mediante el hook `useParams()`.
   - Si la URL dice `/catalogo` (No hay categoría), el arreglo `productosFiltrados` tendrá TODOS los productos.
   - Si la URL dice `/catalogo/ojos` (Hay categoría detectada), el arreglo se filtra usando `filter()` comparando la categoría solicitada con el atributo `categoria` de cada producto en el JSON.
5. **Renderizado:**
   Finalmente, se manda a llamar a `<ProductCard>` por cada producto filtrado, renderizando visualmente los datos extraídos de la Base de Datos.

## 3. ¿A quién impactamos?

### Impacto en el Usuario Final (UX)
- **Tiempos de carga:** Se agrega un mínimo tiempo de espera (Loader) de milisegundos mientras llega la información, lo cual es el estándar moderno, a cambio de que siempre vea el stock actualizado y los productos verdaderos que se suban a la base de datos sin necesidad de actualizar la aplicación entera.
- **Navegación Fluida:** Dado que descargamos de golpe la lista general, cambiar instantáneamente entre categorías en la barra lateral (/labios, /rostro...) es inmediato, lo que da una sensación de gran rapidez y dinamismo, mejorando enormemente la experiencia.

### Impacto en la Arquitectura de Código (DX - Developer Experience)
- **Código más limpio:** Se eliminó la dependencia artificial al archivo pesado `products.json` y a los métodos locales antiguos. El Catálogo ya no es "dueño" de la información, ahora solo es un "lector" (consumidor de API).
- **Escalabilidad:** Ahora estás listo para hacer crecer el catálogo a cientos de productos. Si en el futuro es muy grande, en este mismo componente se añadirá *Paginación* (ej: traer 20 productos por cada "página").
