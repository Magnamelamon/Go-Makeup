// Auth utilities for authenticated API requests

/**
 * Authenticated fetch wrapper for admin requests.
 * Automatically includes Bearer token and handles 401 redirects.
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const session = localStorage.getItem('gomakeup_session');
  const token = session ? JSON.parse(session).token : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  // Only add Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // If 401, token expired — redirect to login
  if (response.status === 401) {
    localStorage.removeItem('gomakeup_session');
    window.location.href = '/admin-login';
  }

  return response;
};
