# Documentación de Integración: Detalle de Producto (PDP - Product Detail Page)

Este documento explica cómo la página de Detalles del Producto se conectó a la base de datos de MongoDB a través de nuestra API en Node.js/Express.

## 1. ¿Qué funcionalidad cumple esta integración?
Permite que cuando un usuario hace clic en un labial o paleta específica, la página ya no busque la información en archivos estáticos locales de React (`getProductoById()`), sino que haga una consulta real al servidor Backend consultando por el `ID` específico del producto para renderizar sus colores, imágenes, stock real y precios actuales.

## 2. Archivos Afectados y Cómo Funciona

**Archivo Principal:** `src/pages/ProductoDetalle/ProductoDetalle.tsx`

### El Flujo de Datos
1. **Detección de Producto (`useParams`):**
   React lee la URL (ejemplo: `/producto/P001`) y extrae el ID `P001` gracias a la herramienta de routing.
2. **Consumo de la API Particular (`useEffect`):**
   Se hace una petición a la ruta específica que tú mismo creaste en tu servidor: `fetch('http://localhost:5000/api/products/P001')`. Esta ruta entra a `productController.js` y usa la función de Mongoose `Catalog.findOne({ id: req.params.id })`.
3. **Manejo de Variantes (Colores y Tallas):**
   Al recibir la respuesta de la Base de Datos, React no solo carga el producto en `setProducto(prod)`, sino que extrae automáticamente el arreglo de "variantes" que diseñamos en MongoDB. Automáticamente selecciona la variante `[0]` (la primera) para ser el color por defecto al cargarse la página.
4. **Productos Relacionados (Cross-Selling):**
   Para llenar la sección de "También te podría gustar", React hace una segunda petición para traer los artículos de la tienda y filtrar los primeros 10 que compartan la misma "categoría" de MongoDB que el producto actual visualizado. 

## 3. ¿A quién impactamos?

### Impacto en el Negocio / Usuario Final
- **Stock en Tiempo Real:** Como las tallas y colores (`variantes`) ahora provienen directo del backend, si en MongoDB el stock (`stock: 0`) baja, el botón de la tienda automáticamente mostrará la etiqueta **"AGOTADO"**, evitando que el cliente se frustre al no encontrar información verdadera.
- **Manejo de Precios Centralizados:** Si activas un descuento global o parcial cambiando el campo `precio_descuento`, se reflejará dinámicamente en el Frontend de todos sin necesidad de tocar código.

### Impacto Arquitectónico (Próximos Pasos)
- Este archivo era la última gran dependencia de catálogo que estaba "quemada" (hardcoded). El sistema de eCommerce e inventario general está finalizado a nivel lectura (GET).
- Abre las puertas a la **Fase 3**: La Autenticación. Ahora que los productos son reales, los usuarios (que por ahora siguen simulados con `users.ts` y AuthContext) son el próximo paso lógico para que un usuario pueda iniciar sesión con credenciales validadas por MongoDB conectadas a estos productos reales.
