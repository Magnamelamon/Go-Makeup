# Documentación de Arquitectura de Autenticación: Modo Administrador

Este documento describe **cómo funciona el sistema de seguridad** implementado para proteger y administrar la información del E-commerce "Go Makeup". Ahora que la tienda consume datos reales, es indispensable proteger quién tiene permisos para agregar, modificar o eliminar dichos productos.

## 1. Conceptos Fundamentales

### a) BCryptJS (El Candado Inquebrantable)
Es una librería de encriptación que utilizamos en el Backend (`backend/models/AdminUser.js`). Jamás debemos guardar contraseñas literales como *"1234"* en la Base de Datos, porque si alguien externo lee la tabla, robaría esas credenciales inmediatamente.
- **¿Cómo funciona?** Cuando el "Sembrador" (`seeders.js`) trató de inyectar el password `adminpassword` al admin, una función secreta atada a la base de datos de nombre "pre-save hooks" interceptó el password antes de meterlo al disco duro, lo "saló" (generando entropía aleatoria), y lo transformó en una cadena de texto larga de caracteres ininteligibles (Ej: `$2b$10$Ok1.Mj6...`).
- De esa forma, *ni siquiera nosotros mismos* podemos visualizar en MongoDB tu password verdadero. Así que cuando intentamos verificar si tu contraseña es correcta al iniciar sesión, usamos el método `matchPassword` interno para comparar lo que acabas de teclear en la web, contra el Hash (Candado) matemático que tenemos guardado.

### b) JWT (JSON Web Token - El Gafete Digital)
A diferencia de sesiones viejas que sobrecargaban memoria física en el Servidor Web, estamos utilizando un sistema totalmente "stateless" (sin memoria) basado en tokens ultra-seguros, lo que lo vuelve muy escalable.
- **¿Qué es?** Es una credencial de 3 partes que demuestra que ya fuiste autenticado por nosotros. Una de esas partes está firmada usando una estricta "Firma Secreta" que solo tú Servidor NodeJS conoce (la variable `JWT_SECRET` en tu archivo `.env`).
- **El flujo:** Cuando tu contraseña de administrador hace "Match", usamos el programa en `backend/utils/generateToken.js` para fabricar un string encriptado que diga *"Yo Servidor afirmo que el Admin ID: 123 acaba de hacer Login*". Y se lo entregamos a React. Acto seguido, React guarda este string directamente en el almacenamiento web local (`localStorage`).

## 2. El Viaje del Inicio de Sesión (API Journey: Auth Flow)

Así viajan los datos en pantalla cuando le das click al botón rosa "Iniciar Sesión" del Portal Exclusivo:

1. **La Página Login (`Login.tsx`):** Recolecta el correo `admin@gomakeup.com` y la contraseña y despacha una función de llamada maestra.
2. **El Proveedor de Autenticador (`AuthContext.tsx`):** Captura esos datos recolectados y ahora "toca la puerta" real de Internet en el Servidor Express por el canal de `POST /api/admins/login`, mandándole los dos valores envueltos en un sobrecito JSON.
3. **El Árbitro de Express (`server.js`):** El Node recibe este sobre escrito en formato JSON, y se lo pre-traduce al router (`adminRoutes.js`).
4. **Validación Cerebral (`adminController.js`):** La carpeta controlador busca, con ayuda del modelo de Mongo, el correo `admin@...`. Si lo encuentró, entonces utiliza bcrypt para ver si el candado abre.
5. **Generador de Beneficio (`adminController.js`):** Sí se desbloqueó, entonces genera nuestro *Token JWT* por default con vigencia de expiración de **30 días**. Manda al Front-end todo en objeto: `200 OK: {"Email": "..", "ID": "...", "Token": "..."}`.
6. **Almacenamiento (Vuelta al Frontend):** React recibe el semáforo verde. Toma todos esos datos, esconde tu credencial en tu propio navegador Web (`localStorage`), informa que ya estamos "Autenticados", te traslada de `/login` al `/Home`. Y ahora, un engranaje administrativo flotará y será siempre visible mientras estés jugando con tu web. 

## 3. Próximos Pasos Constructivos (Módulo CRUD)
El esfuerzo que acabamos de hacer pavimenta completamente y de forma segura el terreno para la **Creación de Productos**:
Como el administrador (Go Makeup Team) ya demostró su identidad y bajó un **Token JWT** hacia su navegador, en el futuro podremos usar el `Token` de la credencial JWT guardado. Crearemos una pantalla nueva llamada "Panel de Control" que enviará al servidor Express esta Credencial acompañando de los datos de "Nuevo Labial". Y el servidor sólo permitirá registrar aquel labial en MongoDB tras constatar criptográficamente la pureza natural del Token digital.

---
**Nota Técnica Específica de Refactorización Reciente:**  El último "Error 500" presentado durante las primeras pruebas interactivas en tu máquina, ocurrió porque modernizamos tu tecnología, migrando de los `Call-backs (Next())` antiguos creados en 2018 para las funciones de Express/Mongoose, a sintaxis modernas con `Promesas` estilo (Async/Await). Resolviendo esto, el sistema se acopló íntegramente de manera elegante y síncrona, resolviendo cualquier futuro choque derivado del asincronismo original.
