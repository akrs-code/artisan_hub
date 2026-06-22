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

// ─── Shops API ───────────────────────────────────────────────────────────────

export const shopsAPI = {
  getOwned: () =>
    request('/shops/owned', {
      method: 'GET',
    }),
  createShop: (formData) =>
    request('/shops', {
      method: 'POST',
      body: formData,
    }),
};

// ─── Products API ────────────────────────────────────────────────────────────

export const productsAPI = {
  getShopProducts: (shopId) =>
    request(`/products/shops/${shopId}/get_products`, {
      method: 'GET',
    }),

  createProduct: (shopId, formData) =>
    request(`/products/shops/${shopId}/products`, {
      method: 'POST',
      body: formData,
    }),

  updateProduct: (productId, formData) =>
    request(`/products/products/${productId}/edit_product`, {
      method: 'PUT',
      body: formData,
    }),

  deleteProduct: (productId) =>
    request(`/products/products/${productId}/delete_product`, {
      method: 'DELETE',
    }),
};

// ─── Orders API ──────────────────────────────────────────────────────────────

export const ordersAPI = {
  getShopOrders: (shopId) =>
    request(`/orders/shops/${shopId}/orders`, {
      method: 'GET',
    }),

  confirmOrder: (orderId) =>
    request(`/orders/${orderId}/confirm`, {
      method: 'PUT',
    }),

  shipOrder: (orderId, shippingData) =>
    request(`/orders/${orderId}/ship`, {
      method: 'PUT',
      body: JSON.stringify(shippingData),
    }),

  deliverOrder: (orderId) =>
    request(`/orders/${orderId}/deliver`, {
      method: 'PUT',
    }),

  cancelOrder: (orderId) =>
    request(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    }),
};

export default request;
