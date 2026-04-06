# 🚀 Guía Rápida — Levantar el Servidor en 2 Minutos

Sigue estos pasos en orden cuando el servidor o el túnel se caigan.

---

## Paso 1: Conectar al Tank por SSH

```bash
ssh -p 8022 u0_a216@192.168.100.76
# Password: magna131071
```

## Paso 2: Verificar qué está caído

```bash
termux-wake-lock
curl -s http://localhost:5000/ && echo " ← Backend OK" || echo "⛔ Backend CAÍDO"
pgrep cloudflared && echo "Túnel OK" || echo "⛔ Túnel CAÍDO"
pg_ctl -D $PREFIX/var/lib/postgresql status
```

## Paso 3: Levantar lo que esté caído

### Si PostgreSQL está caído:
```bash
pg_ctl -D $PREFIX/var/lib/postgresql start
```

### Si el Backend está caído:
```bash
cd ~/backend
export DATABASE_URL=postgres://u0_a216:magna131071@127.0.0.1:5432/go_makeup_db
export JWT_SECRET=GoMakeupSecretKey2026
export PORT=5000
pm2 start server.js --name "gomakeup-api"
```

### Si el Túnel está caído:
```bash
pkill cloudflared 2>/dev/null
nohup cloudflared tunnel --url http://localhost:5000 > ~/backend/tunnel.log 2>&1 &
sleep 6
grep -o "https://.*trycloudflare.com" ~/backend/tunnel.log | tail -1
```
> ⚠️ **Copia la URL que aparece** — la necesitas para el siguiente paso.

## Paso 4: Actualizar Vercel (solo si el túnel se reinició)

1. Ir a [vercel.com](https://vercel.com) → Go Makeup → **Settings** → **Environment Variables**
2. Editar `VITE_API_URL` → pegar la nueva URL + `/api`
   - Ejemplo: `https://manchester-clock-able-territory.trycloudflare.com/api`
3. Ir a **Deployments** → clic en los 3 puntos del último deploy → **Redeploy**

## Paso 5: Verificar

```bash
# Desde el Tank:
curl -s http://localhost:5000/api/products | head -c 50

# Desde la PC:
# Abrir https://go-makeup.vercel.app y verificar que carguen los productos
```

---

## Comando Todo-en-Uno (copiar y pegar)

Si todo está caído, ejecuta esto en el Tank:

```bash
termux-wake-lock && \
pg_ctl -D $PREFIX/var/lib/postgresql start 2>/dev/null; \
cd ~/backend && \
export DATABASE_URL=postgres://u0_a216:magna131071@127.0.0.1:5432/go_makeup_db && \
export JWT_SECRET=GoMakeupSecretKey2026 && \
export PORT=5000 && \
pm2 delete all 2>/dev/null; pm2 start server.js --name "gomakeup-api" && \
pkill cloudflared 2>/dev/null; \
nohup cloudflared tunnel --url http://localhost:5000 > ~/backend/tunnel.log 2>&1 & \
sleep 6 && \
echo "=== BACKEND ===" && curl -s http://localhost:5000/ && echo "" && \
echo "=== NUEVA URL ===" && grep -o "https://.*trycloudflare.com" ~/backend/tunnel.log | tail -1
```

> Después de ejecutar, copia la URL que aparece y actualízala en Vercel → `VITE_API_URL`.
