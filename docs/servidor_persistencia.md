# Go Makeup — Guía de Persistencia y Mantenimiento del Servidor

**Dispositivo:** Android (Tank) con Termux  
**Fecha:** 28 de Marzo de 2026

---

## Servicios Activos

| Servicio | Puerto | Gestión | Auto-inicio |
|---|---|---|---|
| PostgreSQL | 5432 | `pg_ctl` | ✅ Sí |
| Express.js API | 5000 | `pm2` | ✅ Sí |
| SSH Server | 8022 | `sshd` | ✅ Sí |
| Cloudflare Tunnel | — | `cloudflared` | ✅ Sí |

---

## Capas de Protección

### 1. `termux-wake-lock`
Impide que Android suspenda los procesos de Termux cuando la pantalla se apaga.
```bash
termux-wake-lock    # Activar
termux-wake-unlock  # Desactivar
```

### 2. PM2 (Process Manager)
Gestiona el servidor Express con auto-reinicio si crashea.

```bash
pm2 status                  # Ver estado del servidor
pm2 logs                    # Ver logs en tiempo real
pm2 logs --lines 50         # Últimas 50 líneas
pm2 restart gomakeup-api    # Reiniciar el servidor
pm2 stop gomakeup-api       # Detener
pm2 monit                   # Monitor CPU/RAM en tiempo real
pm2 save                    # Guardar lista de procesos
pm2 resurrect               # Restaurar procesos guardados
```

### 3. Termux:Boot (Auto-inicio)
Script que se ejecuta automáticamente al encender el dispositivo.

**Ubicación:** `~/.termux/boot/start-services.sh`

**Contenido:**
```bash
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
sshd
pg_ctl -D $PREFIX/var/lib/postgresql start -l $HOME/pg.log
sleep 3
export DATABASE_URL=postgres://u0_a216:magna131071@127.0.0.1:5432/go_makeup_db
export JWT_SECRET=GoMakeupSecretKey2026
export PORT=5000
cd $HOME/backend
pm2 resurrect
nohup cloudflared tunnel --url http://localhost:5000 > $HOME/backend/tunnel.log 2>&1 &
```

**Requisito:** Tener la app [Termux:Boot](https://f-droid.org/packages/com.termux.boot/) instalada desde F-Droid.

---

## Después de un Reinicio del Dispositivo

Todo arranca automáticamente excepto la URL del túnel que cambia. Pasos post-reinicio:

1. **Obtener la nueva URL del túnel:**
   ```bash
   grep "trycloudflare.com" ~/backend/tunnel.log | tail -1
   ```

2. **Actualizar Vercel:**
   - Ir a [Vercel Dashboard](https://vercel.com) → Go Makeup → Settings → Environment Variables
   - Cambiar `VITE_API_URL` a la nueva URL + `/api`
   - Ejemplo: `https://nueva-url-generada.trycloudflare.com/api`
   - Hacer **Redeploy** desde la pestaña Deployments

3. **Verificar conectividad:**
   ```bash
   curl -s https://NUEVA-URL.trycloudflare.com/api/products | head -c 100
   ```

---

## Variables de Entorno del Backend

| Variable | Valor | Descripción |
|---|---|---|
| `DATABASE_URL` | `postgres://u0_a216:magna131071@127.0.0.1:5432/go_makeup_db` | Conexión PostgreSQL |
| `JWT_SECRET` | `GoMakeupSecretKey2026` | Clave para firmar tokens JWT |
| `PORT` | `5000` | Puerto del servidor Express |

---

## Troubleshooting

### El servidor no responde
```bash
pm2 status                 # Verificar si está corriendo
pm2 logs gomakeup-api      # Ver errores
pm2 restart gomakeup-api   # Reiniciar
```

### PostgreSQL no conecta
```bash
pg_ctl -D $PREFIX/var/lib/postgresql status    # Estado
pg_ctl -D $PREFIX/var/lib/postgresql restart   # Reiniciar
```

### El túnel cayó
```bash
pkill cloudflared
nohup cloudflared tunnel --url http://localhost:5000 > ~/backend/tunnel.log 2>&1 &
sleep 5
grep "trycloudflare.com" ~/backend/tunnel.log | tail -1
# Actualizar VITE_API_URL en Vercel con la nueva URL
```

### Conectar por SSH desde la PC
```bash
ssh -p 8022 u0_a216@192.168.100.76
# Password: magna131071
```
