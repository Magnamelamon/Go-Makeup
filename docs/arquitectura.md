# Go Makeup — Documentación Completa de Arquitectura y Despliegue

## Diagrama General del Sistema

```mermaid
graph LR
    A["👤 Usuario"] -->|Visita| B["🌐 Vercel<br/>Frontend React"]
    B -->|fetch API_BASE/products| C["☁️ Cloudflare Tunnel<br/>trycloudflare.com"]
    C -->|localhost:5000| D["📲 Tank Android<br/>Express.js"]
    D -->|localhost:5432| E["🗄️ PostgreSQL<br/>go_makeup_db"]
    E -->|JSON Response| D
    D --> C --> B --> A
```

---

## Verificación Final del Sistema ✅

> Todas las pruebas pasaron exitosamente el **28 de marzo de 2026**.

### Resultados de Tests API (vía Cloudflare Tunnel)

| Test | Endpoint | Status | Resultado |
|---|---|---|---|
| Lista de productos | `GET /api/products` | ✅ 200 | 3 productos encontrados |
| Producto individual | `GET /api/products/:id` | ✅ 200 | "Labial" con 1 variante |
| Login admin | `POST /api/admins/login` | ✅ 200 | Token JWT generado |

### Capturas de Pantalla

| Página | Imagen |
|---|---|
| Home | ![Home](screenshots/home_page.png) |
| Catálogo | ![Catálogo](screenshots/catalog_page.png) |
| Detalle de Producto | ![Detalle](screenshots/product_detail.png) |
| Admin Login | ![Login](screenshots/admin_login.png) |

---

## 1. Frontend (React + Vite + TypeScript)

### Stack
- **Framework:** React 19 con TypeScript
- **Bundler:** Vite 7
- **Routing:** React Router DOM 7
- **Hosting:** Vercel (deploy automático desde GitHub)

### Estructura de Archivos Clave

| Archivo | Función |
|---|---|
| `src/config/api.ts` | Configuración central de la URL del API |
| `src/pages/Home/Home.tsx` | Página principal, carga productos destacados |
| `src/pages/Catalogo/Catalogo.tsx` | Catálogo filtrable por categoría |
| `src/pages/ProductoDetalle/ProductoDetalle.tsx` | Detalle de producto con variantes de color |
| `src/pages/AdminProductos/AdminProductos.tsx` | Panel admin: CRUD + carga CSV/JSON |
| `src/context/AuthContext.tsx` | Autenticación JWT para admins |

### Configuración del API (`src/config/api.ts`)

```typescript
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

- En **desarrollo local**: usa `http://localhost:5000/api`
- En **producción (Vercel)**: usa la variable de entorno `VITE_API_URL`

---

## 2. Backend (Express.js + Sequelize)

### Stack
- **Runtime:** Node.js 25 (Termux en Android)
- **Framework:** Express 5
- **ORM:** Sequelize 6
- **Ubicación:** Dispositivo Android "Tank" (`ssh Tank`)

### Endpoints Principales

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/products` | Lista todos los productos con variantes |
| `GET` | `/api/products/:id` | Detalle de un producto |
| `POST` | `/api/products` | Crear producto con variantes |
| `PUT` | `/api/products/:id` | Actualizar producto |
| `DELETE` | `/api/products/:id` | Eliminar producto |
| `POST` | `/api/upload` | Subir imagen (multipart) |
| `POST` | `/api/upload-url` | Descargar imagen desde URL |
| `POST` | `/api/admins/login` | Login admin (JWT) |

---

## 3. Base de Datos (PostgreSQL)

### Conexión
- **Host:** `127.0.0.1` (local en el Tank)
- **Puerto:** `5432`
- **Usuario:** `u0_a216`
- **Base de datos:** `go_makeup_db`

### Esquema

```mermaid
erDiagram
    Catalog ||--o{ CatalogVariant : "tiene"
    Catalog {
        string id PK
        string nombre
        text descripcion
        string categoria
        string urlShein
        string urlTiktok
    }
    CatalogVariant {
        string id_variante PK
        string catalogId FK
        string color
        string color_nombre
        decimal precio
        decimal precio_descuento
        integer stock
        json imagenes
    }
    AdminUser {
        uuid id PK
        string nombre
        string email
        string password
        jsonb permisos
        date ultimo_acceso
    }
```

### Credenciales Admin
- **Email:** `admin2@gomakeup.com`
- **Password:** `Magna131071`

---

## 4. Vercel (Deploy del Frontend)

| Campo | Valor |
|---|---|
| **Repositorio** | `github.com/Magnamelamon/Go-Makeup` |
| **Rama** | `main` |
| **Build Command** | `vite build` |
| **Variable de Entorno** | `VITE_API_URL` = URL de Cloudflare + `/api` |

> **IMPORTANTE:** `VITE_API_URL` se "congela" durante el build. Si cambias la URL del túnel, debes hacer **Redeploy** en Vercel.

### Flujo de Deploy

```mermaid
sequenceDiagram
    participant Dev as 💻 Desarrollador
    participant GH as 🐙 GitHub
    participant V as 🌐 Vercel
    Dev->>GH: git push origin main
    GH->>V: Webhook: nuevo commit
    V->>V: npm install
    V->>V: vite build (inyecta VITE_API_URL)
    V->>V: Deploy a CDN global
    V-->>Dev: ✅ URL pública lista
```

---

## 5. Cloudflare Tunnel

### Quick Tunnel (Gratuito)

```bash
cloudflared tunnel --url http://localhost:5000
```

Genera URL tipo: `https://buying-anytime-unnecessary-brisbane.trycloudflare.com`

> **ADVERTENCIA:** La URL del Quick Tunnel **cambia cada vez** que reinicias `cloudflared`. Para permanencia, compra un dominio (~$3 USD).

### Flujo de una Petición

```mermaid
sequenceDiagram
    participant Browser as 🌍 Navegador
    participant CF as ☁️ Cloudflare Edge
    participant Tank as 📲 Tank (cloudflared)
    participant Express as 🖥️ Express:5000
    participant PG as 🗄️ PostgreSQL

    Browser->>CF: GET /api/products (HTTPS)
    CF->>Tank: Túnel encriptado
    Tank->>Express: HTTP localhost:5000
    Express->>PG: SELECT * FROM catalogs
    PG-->>Express: Filas de datos
    Express-->>Tank: JSON Response
    Tank-->>CF: Túnel encriptado
    CF-->>Browser: JSON + CORS headers
```

---

## 6. Comandos de Referencia Rápida

### Iniciar todo en el Tank (Termux)

```bash
# 1. Iniciar PostgreSQL
pg_ctl start

# 2. Iniciar el backend
cd ~/backend
DATABASE_URL=postgres://u0_a216:magna131071@127.0.0.1:5432/go_makeup_db \
PORT=5000 JWT_SECRET=GoMakeupSecretKey2026 \
nohup node server.js > app.log 2>&1 &

# 3. Iniciar el túnel Cloudflare
nohup cloudflared tunnel --url http://localhost:5000 > tunnel.log 2>&1 &

# 4. Obtener la URL pública
grep "trycloudflare.com" tunnel.log

# 5. Mantener Termux activo
termux-wake-lock
```

### Desde tu computadora (PowerShell)

```powershell
# Conectar al Tank
ssh Tank   # Password: magna131071

# Desarrollo local
cd "c:\Users\crism\OneDrive\Desktop\Go Makeup"
npm run dev

# Desplegar a producción
git add .; git commit -m "cambios"; git push origin main
```

### Actualizar URL en Vercel (cuando cambie el túnel)

1. Vercel Dashboard → Settings → Environment Variables
2. Editar `VITE_API_URL` con la nueva URL + `/api`
3. Deployments → Redeploy

---

## 7. Troubleshooting

| Problema | Causa | Solución |
|---|---|---|
| `Failed to fetch` en Vercel | `VITE_API_URL` no configurada o build viejo | Verificar variable en Vercel + Redeploy |
| `ERR_CONNECTION_REFUSED` local | Backend no está corriendo | `node server.js` en el Tank |
| URL de Cloudflare no funciona | Túnel caído o URL cambió | Reiniciar `cloudflared` y actualizar URL en Vercel |
| `CORS error` en navegador | Backend no tiene cors middleware | Verificar que `cors()` está en `server.js` |
| Login error 500 | `JWT_SECRET` no definido | Incluir `JWT_SECRET=GoMakeupSecretKey2026` al iniciar |
