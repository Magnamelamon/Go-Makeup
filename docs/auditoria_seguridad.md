# Go Makeup — Auditoría de Seguridad

**Fecha:** 28 de Marzo de 2026  
**Auditor:** Antigravity AI  
**Alcance:** Backend Express.js, Frontend React, Cloudflare Tunnel, Vercel

---

## Resumen Ejecutivo

Se identificaron **9 vulnerabilidades** en la aplicación desplegada, de las cuales **3 son críticas**, **4 son altas** y **2 son medias**. La más urgente es la **ausencia total de autenticación** en los endpoints de administración.

### Prueba de Penetración Realizada

Se ejecutaron peticiones HTTP desde una máquina externa (sin credenciales ni token) contra la API pública. Resultados:

| Test | Endpoint | Resultado | Impacto |
|---|---|---|---|
| Listar admins sin auth | `GET /api/admins` | **200 OK** ⛔ | Expone emails de todos los admins |
| Crear admin sin auth | `POST /api/admins` | **201 Created** ⛔ | Cualquiera puede crear cuentas admin |
| Eliminar productos sin auth | `DELETE /api/products/:id` | **404** (pero procesa la petición) ⛔ | Cualquiera puede borrar el catálogo |
| Subir archivos sin auth | `POST /api/upload` | Accesible ⛔ | Almacenamiento ilimitado abusable |

---

## Vulnerabilidades Encontradas

### 🔴 CRÍTICA #1 — Endpoints de Admin sin Autenticación

**Archivo:** `backend/routes/adminRoutes.js`, `backend/routes/productRoutes.js`

**Problema:** Ninguno de los endpoints POST/PUT/DELETE requiere un token JWT. Los comentarios dicen `@access Private/Admin`, pero no se implementó ningún middleware de verificación.

**Impacto:** Cualquier persona en internet puede:
- Crear cuentas de administrador
- Listar todos los administradores (con emails)
- Eliminar cualquier producto del catálogo
- Modificar precios y descripciones

**Solución:**
```javascript
// backend/middleware/authMiddleware.js (CREAR ESTE ARCHIVO)
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await AdminUser.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      next();
    } catch (error) {
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'No autorizado, sin token' });
  }
};
```

Aplicar en las rutas:
```javascript
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, getAdmins);
router.post('/', protect, createAdmin);
router.put('/:id', protect, updateAdmin);
router.delete('/:id', protect, deleteAdmin);
```

---

### 🔴 CRÍTICA #2 — CORS Totalmente Abierto

**Archivo:** `backend/server.js` (línea 18)

**Problema:** `app.use(cors())` sin restricciones permite que CUALQUIER sitio web haga peticiones a tu API, incluidos sitios maliciosos.

**Solución:**
```javascript
app.use(cors({
  origin: [
    'https://go-makeup.vercel.app',
    'http://localhost:5173' // solo para desarrollo
  ],
  credentials: true
}));
```

---

### 🔴 CRÍTICA #3 — SSRF en `/api/upload-url` (Server-Side Request Forgery)

**Archivo:** `backend/routes/uploadRoutes.js` (línea 59-102)

**Problema:** El endpoint acepta cualquier URL y hace `fetch()` desde el servidor. Un atacante podría enviar:
- `http://127.0.0.1:5432` — escanear puertos internos
- `http://169.254.169.254/metadata` — acceder a metadatos del servidor
- URLs masivas para agotar disco/RAM

**Solución:**
```javascript
// Validar que sea una URL http(s) y no una IP privada
const url = new URL(req.body.url);
if (!['http:', 'https:'].includes(url.protocol)) {
  return res.status(400).json({ message: 'Solo se permiten URLs HTTP/HTTPS' });
}
const blocklist = ['127.0.0.1', 'localhost', '0.0.0.0', '169.254.169.254'];
if (blocklist.includes(url.hostname)) {
  return res.status(400).json({ message: 'URL no permitida' });
}
```

---

### 🟠 ALTA #4 — Sin Límite de Tamaño en Uploads

**Archivo:** `backend/routes/uploadRoutes.js` (línea 36-41)

**Problema:** Multer no tiene `limits` configurado. Un atacante puede subir archivos enormes hasta llenar el almacenamiento del Tank.

**Solución:**
```javascript
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
```

---

### 🟠 ALTA #5 — Mensajes de Error Exponen Detalles Internos

**Archivos:** `backend/routes/productRoutes.js` (líneas 82, 127, 156)

**Problema:** Los errores devuelven `error.message` directamente al cliente:
```javascript
res.status(500).json({ message: 'Error creating product: ' + error.message });
```
Esto puede revelar estructura de tablas, queries SQL, y rutas de archivos.

**Solución:**
```javascript
res.status(500).json({ message: 'Error interno del servidor' });
// El error.message solo debe ir a console.error(), nunca al cliente
```

---

### 🟠 ALTA #6 — Sin Rate Limiting en Login

**Archivo:** `backend/routes/adminRoutes.js`

**Problema:** No hay límite de intentos de login, permitiendo ataques de fuerza bruta para adivinar contraseñas.

**Solución:**
```bash
npm install express-rate-limit
```
```javascript
import rateLimit from 'express-rate-limit';
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: { message: 'Demasiados intentos. Intenta en 15 minutos.' }
});
router.post('/login', loginLimiter, authAdmin);
```

---

### 🟠 ALTA #7 — `.env` No Excluido en `.gitignore`

**Archivo:** `.gitignore`

**Problema:** Solo se excluye `.env*.local` pero NO `.env`. Si se crea un archivo `.env` con credenciales, podría ser pusheado a GitHub accidentalmente.

**Solución:** Agregar `.env` al `.gitignore`:
```
.env
.env*.local
```

---

### 🟡 MEDIA #8 — JWT Expira en 30 Días

**Archivo:** `backend/utils/generateToken.js`

**Problema:** `expiresIn: '30d'` es excesivamente largo. Si un token es robado, el atacante tiene un mes completo de acceso.

**Solución:** Reducir a 8 horas para uso normal:
```javascript
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' });
```

---

### 🟡 MEDIA #9 — Frontend No Envía Token JWT en Peticiones Admin

**Archivos:** `AdminProductos.tsx`, `AdminUsuarios.tsx`

**Problema:** Las peticiones `fetch()` del admin no incluyen el header `Authorization: Bearer <token>`. Actualmente funciona porque el backend no valida auth, pero al implementar el middleware de la vulnerabilidad #1, dejará de funcionar.

**Solución:** Actualizar todas las peticiones admin:
```typescript
const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Prioridades de Remediación

| Prioridad | Vulnerabilidad | Esfuerzo |
|---|---|---|
| 1️⃣ Inmediato | #1 Auth middleware | ~1 hora |
| 2️⃣ Inmediato | #2 CORS restringido | ~5 minutos |
| 3️⃣ Urgente | #3 SSRF en upload-url | ~30 minutos |
| 4️⃣ Urgente | #7 .gitignore .env | ~1 minuto |
| 5️⃣ Importante | #4 Límite de uploads | ~5 minutos |
| 6️⃣ Importante | #5 Error messages | ~15 minutos |
| 7️⃣ Importante | #6 Rate limiting | ~15 minutos |
| 8️⃣ Mejora | #8 JWT expiration | ~2 minutos |
| 9️⃣ Mejora | #9 Frontend auth headers | ~30 minutos |
