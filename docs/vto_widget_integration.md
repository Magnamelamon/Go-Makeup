# Documentación de Integración: Probador Virtual de Uñas (VTO Widget)

## Descripción General
El Probador Virtual de Uñas (VTO - Virtual Try-On) es una característica de Realidad Aumentada (AR) integrada en la plataforma **Go Makeup**. Permite a los usuarios visualizar cómo se verían los esmaltes de uñas en sus propias manos utilizando la cámara de su dispositivo.

El widget funciona de manera autónoma, con su propia lógica de renderizado impulsada por **MediaPipe Hands** y un carrusel de colores independiente.

## Ubicación y Arquitectura
El widget se ha implementado como un módulo React independiente dentro del proyecto de Go Makeup. Esto asegura que la lógica del widget no contamine el flujo global de la aplicación.

**Directorio principal:** `src/components/widget/`

### Componentes Clave:
1. **`NailTryOn.tsx` (Componente Core)**:
   - Administra la lógica de AR usando `@mediapipe/camera_utils` y `@mediapipe/hands`.
   - Inicializa y gestiona la cámara trasera (`facingMode: 'environment'`).
   - Dibuja el color sobre las uñas detectadas utilizando un `canvas` que se superpone al feed de video.
   - Contiene su propio selector (carrusel) de colores y realiza un fetch para obtener los esquemas de color desde la API VTO. Implementa un "fallback" a datos simulados (`mock data`) en caso de que el backend VTO no responda.
   - En dispositivos de escritorio, renderiza un código QR para transferir la experiencia AR al móvil ("Handoff").

2. **`NailTryOnModal.tsx`**:
   - Funciona como un "Wrapper" en formato modal a pantalla completa (o casi completa dependiendo del dispositivo).
   - Maneja la accesibilidad básica: puede cerrarse presionando la tecla `Escape` o haciendo click fuera del área activa del widget (en el overlay).
   - Impide el scroll de fondo (`body.style.overflow = 'hidden'`) cuando el probador está activo.

3. **`NailTryOn.css` y `NailTryOnModal.css`**:
   - Todo el CSS del widget está **"namespaced"**, lo que significa que todas las clases utilizan el prefijo `.vto-` (ej. `.vto-widget-container`). Esto previene cualquier riesgo de colisión con las hojas de estilo globales de Go Makeup o Tailwind.

## Configuración y Variables de Entorno
La configuración de la API del VTO se almacena separada de la API general del comercio para mantener el desacoplamiento:
- Archivo: `src/config/vto.ts`
- Variable de entorno requerida (Opcional, en producción): `VITE_VTO_API_URL`
- Valor por defecto: `http://localhost:3001` (Puerto común del backend local del VTO)

## Integración con la Página de Producto (PDP)
La integración con el resto del eCommerce ocurre en `src/pages/ProductoDetalle/ProductoDetalle.tsx`.

La inyección de la interfaz se controla condicionalmente. **Solo se habilita si la categoría del producto es "uñas"**.

```tsx
{/* Probador Virtual — Solo para categoría uñas */}
{producto.categoria?.toLowerCase() === 'uñas' && (
  <>
    <button
      className="producto-btn-vto"
      onClick={() => setShowVTO(true)}
    >
      💅 Probar este color virtualmente
    </button>
    {showVTO && (
      <NailTryOnModal
        onClose={() => setShowVTO(false)}
        initialColor={varianteActiva.color}
      />
    )}
  </>
)}
```

Al abrirse el modal, se pasa como prop `initialColor` el valor hexadecimal de la variante actualmente seleccionada en el PDP.

## Dependencias Instaladas
Para habilitar el tracking de las manos y la transmisión óptima desde la cámara web o del dispositivo:
- `@mediapipe/camera_utils`
- `@mediapipe/hands`

*(Nota: Se excluyó explícitamente `@tensorflow/tfjs` para reducir significativamente el peso del bundle en producción, ya que no era estrictamente utilizado por el modelo de manos en este caso de uso).*

## Scripts Relacionados
Para facilitar las pruebas sin la dependencia de la base de datos de producción real, se incluyó un script de poblado de base de datos (`seed`) para crear al menos un producto funcional válido de la categoría "uñas".
- Archivo: `backend/seed_nail_product.js`
- Ejecución: `node backend/seed_nail_product.js`

## Escalabilidad a Futuro
1. **Micro-Frontend:** El diseño actual aislado en `src/components/widget/` hace que sea muy sencillo extraerlo en el futuro hacia paquete NPM individual (`@gomakeup/vto-widget`) si fuera necesario.
2. **Backend Dedicado:** Ahora mismo la visual se sustenta con "mock data" ante un fallo. Cuando el backend VTO se suba a producción de este módulo, basta con actualizar `VITE_VTO_API_URL` en el entorno de despliegue correspondiente.
