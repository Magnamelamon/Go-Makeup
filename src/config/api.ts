// Central API base URL configuration
// In production (Vercel), uses the VITE_API_URL environment variable
// In development, falls back to localhost:5000/api
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
