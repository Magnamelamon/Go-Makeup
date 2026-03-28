# Documentación del Journey API (Flujo de Datos)

Este documento explica el recorrido paso a paso (El "Journey") de la información desde que el usuario abre nuestra página hasta que los productos salen en su pantalla. Detalla exactamente qué documentos intervienen y cómo se conectan.

## Componentes Involucrados (El Mapa)

Imagina una cadena de relevos donde cuatro jugadores se pasan el testigo en este orden:

1.  **Frontend (El Cliente):** `src/pages/Home/Home.tsx`
2.  **Servidor y Rutas (La Puerta):** `backend/server.js` y `backend/routes/productRoutes.js`
3.  **Controlador (El Cerebro):** `backend/controllers/productController.js`
4.  **Base de Datos (La Bóveda):** `backend/models/Catalog.js` (y MongoDB)

A continuación, cómo ocurre todo el relevo:

---

## El Recorrido Paso a Paso (Journey)

### Paso 1: React pide la información (Frontend)
**Archivo:** `src/pages/Home/Home.tsx`

Cuando el usuario entra al "Home", React carga la pantalla básica vacía y ejecuta inmediatamente la función mágica `useEffect`.
Ahí dentro, usamos `fetch('http://localhost:5000/api/products')` para mandar una "carta de petición" al servidor pidiendo la lista de productos. Mientras esperamos la respuesta, la web le muestra al usuario el texto: *"Cargando productos desde el servidor..."*.

### Paso 2: El Servidor recibe la petición (Backend - Entrada)
**Archivo afecto principal:** `backend/server.js`

Tu computadora, al tener corriendo el archivo `server.js` en segundo plano, actúa como un recepcionista atento en el "puerto 5000".
El servidor identifica que la petición de React viene a la dirección `/api/products` e inmediatamente dice: *"Ah, esta petición es para el departamento de productos, la voy a mandar a `productRoutes.js`"*.

### Paso 3: Las Rutas dirigen el tráfico (Backend - Rutas)
**Archivo afecto:** `backend/routes/productRoutes.js`

Este archivo es como un conmutador telefónico.
Cuando revisa la petición, se da cuenta de que es una petición de tipo `GET` (solo pedir información, no enviar) hacia la raíz secundaria (`/`).
Por ende, la ruta llama a su función correspondiente: `getProducts` que programamos en el controlador.

### Paso 4: El Controlador hace el trabajo (Backend - Controlador)
**Archivo afecto principal:** `backend/controllers/productController.js`

Dentro de este archivo vive la función real `getProducts()`.
El controlador no tiene los datos internamente, pero sabe cómo hablar con la Base de datos gracias al "Modelo" (Mongoose).
El controlador usa la instrucción `await Catalog.find({})` ordenandole a la base de datos: *"Tráeme absolutamente todos los documentos (productos) que tengas en la colección Catalog"*.

### Paso 5: MongoDB Extracción y Retorno (Base de Datos a Backend a Frontend)
**Archivo de la estructura:** `backend/models/Catalog.js`

MongoDB agarra tus datos importados de Compass y se los devuelve al Controlador (Paso 4).
El Controlador dice: *"Perfecto, los tengo"*, los empaqueta en formato JSON (`res.json(products)`) y envía el paquete de regreso por el mismo camino hasta llegar a React.

### Paso 6: React dibuja la pantalla (Frontend - Final)
**Archivo:** `src/pages/Home/Home.tsx`

La petición `fetch` del **Paso 1** finalmente termina y recibe el JSON cargado de los productos.
Acto seguido, React actualiza su estado interno y oculta el mensaje de "Cargando...". Al percatarse del nuevo cargamento, React automáticamente inyecta cada producto dentro de los "huecos" generados por `<ProductCarousel>`, re-dibujando tu página Home mágicamente y mostrándole al usuario exactamente lo que pidió.

## ¿A quién afecta este Flujo?

1.  **Afecta positivamente a la experiencia del usuario (UX):** Ahora ven información verídica y centralizada. Si tu modificas un producto en la Base de Datos, se reflejará instantáneamente en el Home de todos tus usuarios (antes, tenías que mandar una nueva versión entera de la app web).
2.  **Afecta a componentes hijos:** El Carrousel (`ProductCarousel.tsx`) y las tarjetas (`ProductCard.tsx`) ahora están re-dibujándose basados puramente en información enviada por el servidor, siendo 100% dinámicos en vez de estáticos y locales.
