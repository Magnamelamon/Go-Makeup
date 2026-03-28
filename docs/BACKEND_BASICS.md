# Plan Arquitectónico: Backend (Node.js + Express) y APIs

Has llegado a la fase crucial donde la aplicación cobrará vida. Para que todo quede absolutamente claro, primero desglosaremos los conceptos y luego el plan de acción paso a paso.

## 1. Aclarando los Conceptos Clave

Mencionas la confusión entre servidor, backend y Express. Funciona de la siguiente manera:

*   **El Servidor Físico (o Virtual):** Es la computadora que está encendida 24/7. En este momento, **tu propia computadora** está actuando como servidor local. En el futuro, rentarás un servidor en la nube (como AWS, Heroku, o Render) para que el mundo pueda entrar.
*   **El "Backend":** Es un término general que se refiere a todo lo que corre en ese servidor y que el usuario (el cliente) no puede ver. El backend incluye tu base de datos (MongoDB) y tu código lógico.
*   **Node.js:** Es un entorno que nos permite ejecutar código JavaScript *fuera* de un navegador web, logrando que el JavaScript funcione en el backend (tu servidor).
*   **Express.js:** Es una herramienta (un Framework) que se instala **sobre Node.js**. Programar un backend solo con Node.js puro es muy tedioso y complicado. Express.js nos da atajos y una estructura muy fácil para recibir "Peticiones web" (requests) y enviar "Respuestas" (responses).
*   **La API (Application Programming Interface):** Son las "ventanillas de atención". Tu backend (Express) abrirá varias ventanillas, por ejemplo:
    *   Ventanilla `/api/productos`: Si el frontend (React) te pide algo aquí, tú vas a MongoDB, traes los productos y se los envías.
    *   Ventanilla `/api/usuarios/login`: Aquí el frontend enviará un email y contraseña.

**En resumen:** Usaremos **Node.js** para tener un entorno, dentro instalaremos **Express** para que sea nuestro "Backend" de forma fácil, el cual creará las **APIs** que hablarán con **MongoDB** y le enviarán la información a tu frontend en **React**. Todo esto correrá temporalmente de forma local en tu PC como servidor de pruebas (`localhost:5000`).

---

## 2. Plan de Desarrollo Paso a Paso

### Fase 1: Creación del Servidor Express (El Corazón)
1.  **Inicialización:** Instalar Express y herramientas de desarrollo necesarias (como `nodemon` para que el servidor se reinicie solo al guardar cambios).
2.  **Punto de Entrada (`server.js`):** Crear el archivo principal que levanta el servidor en el puerto 5000 y se conecta a MongoDB usando el archivo `db.js` que ya creamos antes.

### Fase 2: Construcción de las APIs para el HOME (Productos)
Como mencionaste que iniciaremos "llenando los huecos del Home", nos enfocaremos en tener los productos reales.

1.  **Endpoints (Rutas):** Crearemos rutas en `backend/routes/productRoutes.js`:
    *   `GET /api/products` (Para traer todos los productos al Home / Catálogo).
    *   `GET /api/products/:id` (Para traer un solo producto cuando entren al ProductoDetalle).
2.  **Controladores:** Crearemos las funciones lógicas en `backend/controllers/productController.js` que indican cómo Express debe ir a buscar la colección `Catalog` en Mongoose y devolver la data en formato JSON.

### Fase 3: Conexión Frontend (React consume la API)
Una vez que las ventanillas (APIs) en Express estén listas y probadas, pasaremos a tu proyecto en React.

1.  **Peticiones HTTP:** Usaremos la herramienta de React `useEffect` (o instalaremos una librería como `axios`) para que apenas cargue el componente `Home`, envíe la petición a `http://localhost:5000/api/products`.
2.  **Estado Global:** Modificaremos tu código para que guarde esta data en su estado local (`useState`) e imprima tus `ProductCard` dinámicamente, rellenando por fin los huecos.
3.  **Loading/Errores:** Agregaremos diseños de "Cargando..." o "Error" por si el internet u el servidor fallan.

### Fase 4 (Futura): Usuarios y Autenticación
Cuando los productos fluyan correctamente, repetiremos las Fases 2 y 3 pero para el registro e inicio de sesión de usuarios (usando `JSON Web Tokens` para seguridad).
