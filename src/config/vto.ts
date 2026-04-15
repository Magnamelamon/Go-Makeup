// URL del backend del probador virtual de uñas (VTO)
// Cuando el backend VTO esté desplegado, configurar VITE_VTO_API_URL en .env
// Mientras no exista, el widget usará colores mock automáticamente (fallback integrado)
export const VTO_API_URL = import.meta.env.VITE_VTO_API_URL || 'http://localhost:3001';
