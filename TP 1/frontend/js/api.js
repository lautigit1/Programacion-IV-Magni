'use strict';

/**
 * API Client Module
 *
 * Generic fetch wrapper that:
 * - Prepends the base URL
 * - Always sends/expects JSON
 * - Handles non-2xx responses by throwing descriptive errors
 * - Handles network failures separately from API errors
 * - Automatically redirects to login on 401
 */

/**
 * Makes an authenticated API request.
 *
 * @param {string} endpoint - Path relative to API_BASE_URL (e.g. '/users')
 * @param {object} options  - Fetch options (method, body, etc.)
 * @returns {Promise<object>} Parsed response body
 * @throws {Error} With meaningful message on failure
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  };

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });
  } catch (networkError) {
    // Network failure (server down, no connection)
    throw new Error('No se pudo conectar con el servidor. Verificá tu conexión.');
  }

  // 401 → redirect to login (session expired or not authenticated)
  if (response.status === 401) {
    const body = await response.json().catch(() => ({}));
    
    // Si la ruta no es el login y no estamos ya en la página de login, redirigir
    if (!endpoint.includes('/auth/login') && !window.location.pathname.includes('login')) {
      window.location.href = 'login.html';
      return new Promise(() => {}); // Dejar la promesa pendiente mientras redirige
    }
    
    throw new Error(body.message || 'Credenciales inválidas');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('La respuesta del servidor no tiene un formato válido.');
  }

  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}`);
  }

  return data;
}
