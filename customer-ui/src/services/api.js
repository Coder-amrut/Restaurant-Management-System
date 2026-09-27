const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('auth_token') || '';
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
    }
    if (response.status === 204) return true;
    return await response.json();
  } catch (err) {
    console.error(`Request failed for ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth API
  login: (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Products API
  getProducts: (search = '') => {
    const queryString = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/products${queryString}`);
  },

  createProduct: (productData) => {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  updateProduct: (id, productData) => {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  deleteProduct: (id) => {
    return request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Orders API
  getOrders: () => {
    return request('/orders');
  },

  getOrderById: (id) => {
    return request(`/orders/${id}`);
  },

  createOrder: (orderPayload) => {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
  },

  updateOrderStatus: (id, status) => {
    return request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Dashboard Metrics API
  getDashboard: () => {
    return request('/dashboard');
  },

  // Profile API
  updateProfile: (profileData) => {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Helper seed endpoint
  seedDemoMenu: () => {
    return request('/public/seed-demo', {
      method: 'POST'
    });
  }
};
