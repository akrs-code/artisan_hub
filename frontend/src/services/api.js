const API_BASE = 'http://localhost:5000/api';


const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('artisan_hub_token');

  const headers = {
    ...(options.headers || {}),
  };

  
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



export const usersAPI = {
  getProfile: () =>
    request('/users/profile', {
      method: 'GET',
    }),
  updateProfile: (data) => {
    
    const isFormData = data instanceof FormData;
    return request('/users/profile', {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    });
  },
};



export const shopsAPI = {
  getOwned: () =>
    request('/shops/owned', {
      method: 'GET',
    }),
  getShopStats: (shopId) =>
    request(`/shops/${shopId}/stats`, {
      method: 'GET',
    }),
  createShop: (formData) =>
    request('/shops', {
      method: 'POST',
      body: formData,
    }),
  updateShop: (shopId, formData) =>
    request(`/shops/${shopId}`, {
      method: 'PUT',
      body: formData,
    }),
  getShops: () =>
    request('/shops', {
      method: 'GET',
    }),
  getNearbyShops: (lat, lng, radius) =>
    request(`/shops/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {
      method: 'GET',
    }),
  getShopById: (shopId) =>
    request(`/shops/${shopId}`, {
      method: 'GET',
    }),
  getReviews: (shopId) =>
    request(`/shops/${shopId}/reviews`, {
      method: 'GET',
    }),
  createReview: (shopId, rating, comment) =>
    request(`/shops/${shopId}/add_reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    }),
};



export const productsAPI = {
  getProducts: (category) =>
    request(`/products${category ? `?category=${category}` : ''}`, {
      method: 'GET',
    }),

  getShopProducts: (shopId) =>
    request(`/products/shops/${shopId}/get_products`, {
      method: 'GET',
    }),

  getProductBySlug: (slugOrId) =>
    request(`/products/products/${slugOrId}`, {
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

  getProductReviews: (productId) =>
    request(`/products/products/${productId}/reviews`, {
      method: 'GET',
    }),

  addProductReview: (productId, rating, comment) =>
    request(`/products/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    }),
};



export const ordersAPI = {
  placeOrder: (orderData) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getMyOrders: () =>
    request('/orders/my', {
      method: 'GET',
    }),

  getShopOrders: (shopId) =>
    request(`/orders/shops/${shopId}/orders`, {
      method: 'GET',
    }),

  confirmOrder: (orderId) =>
    request(`/orders/${orderId}/confirm`, {
      method: 'PUT',
    }),

  prepareOrder: (orderId) =>
    request(`/orders/${orderId}/prepare`, {
      method: 'PUT',
    }),

  readyOrder: (orderId) =>
    request(`/orders/${orderId}/ready`, {
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


  receiveOrder: (orderId) =>
    request(`/orders/${orderId}/receive`, {
      method: 'PUT',
    }),

  completeOrder: (orderId) =>
    request(`/orders/${orderId}/complete`, {
      method: 'PUT',
    }),

  cancelOrder: (orderId) =>
    request(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    }),
};



export const categoriesAPI = {
  getCategories: () =>
    request('/categories', {
      method: 'GET',
    }),
  createCategory: (data) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE',
    }),
};



export const adminAPI = {
  getStats: () =>
    request('/admin/stats', {
      method: 'GET',
    }),

  getUsers: () =>
    request('/admin/users', {
      method: 'GET',
    }),

  toggleUser: (userId) =>
    request(`/admin/users/${userId}/toggle`, {
      method: 'PUT',
    }),

  deleteUser: (userId) =>
    request(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),

  getShops: () =>
    request('/admin/shops', {
      method: 'GET',
    }),

  toggleShop: (shopId) =>
    request(`/admin/shops/${shopId}/toggle`, {
      method: 'PUT',
    }),

  verifyShop: (shopId, status) =>
    request(`/admin/shops/${shopId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  getOrders: () =>
    request('/admin/orders', {
      method: 'GET',
    }),

  getWithdrawals: () =>
    request('/admin/withdrawals', {
      method: 'GET',
    }),

  updateWithdrawalStatus: (withdrawalId, status, notes) =>
    request(`/admin/withdrawals/${withdrawalId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    }),

  getLogs: () =>
    request('/admin/logs', {
      method: 'GET',
    }),

  getProducts: () =>
    request('/admin/products', {
      method: 'GET',
    }),

  moderateProduct: (productId, action) =>
    request(`/admin/products/${productId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    }),

  toggleProduct: (productId) =>
    request(`/admin/products/${productId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'toggle' }),
    }),

  getLogs: () =>
    request('/admin/logs', {
      method: 'GET',
    }),
};



export const cartAPI = {
  getCart: () =>
    request('/cart', {
      method: 'GET',
    }),
  addToCart: (itemData) =>
    request('/cart/add', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
  updateCartItem: (itemData) =>
    request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }),
  removeFromCart: (itemData) =>
    request('/cart/remove', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
};



export const walletAPI = {
  getWalletStats: (shopId) =>
    request(`/wallet/shops/${shopId}/stats`, {
      method: 'GET',
    }),
  requestWithdrawal: (shopId, withdrawalData) =>
    request(`/wallet/shops/${shopId}/withdraw`, {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    }),
  getWithdrawalHistory: (shopId) =>
    request(`/wallet/shops/${shopId}/history`, {
      method: 'GET',
    }),
};



export const notificationsAPI = {
  getNotifications: () =>
    request('/notifications', {
      method: 'GET',
    }),
  markAllAsRead: () =>
    request('/notifications/mark-all-read', {
      method: 'PUT',
    }),
  markAsRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
};

export const aiAPI = {
  chat: (prompt, userLocation) =>
    request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, userLocation }),
    }),
};



export default request;
