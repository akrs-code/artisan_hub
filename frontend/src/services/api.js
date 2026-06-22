const API_BASE = 'http://localhost:5000/api';

/**
 * Core fetch wrapper with auth token injection.
 * All API calls go through this function.
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('artisan_hub_token');

  const headers = {
    ...(options.headers || {}),
  };

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (formData) =>
    request('/auth/register', {
      method: 'POST',
      body: formData instanceof FormData ? formData : JSON.stringify(formData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    request('/auth/me', {
      method: 'GET',
    }),
};

export default request;
