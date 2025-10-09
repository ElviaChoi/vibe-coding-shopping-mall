const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const productAPI = {
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProduct: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  getProductStats: async () => {
    return apiRequest('/products/stats');
  }
};

export const userAPI = {
  login: async (email, password) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/users/profile');
  }
};

export const cartAPI = {
  getCart: async (userId) => {
    return apiRequest(`/carts/${userId}`);
  },

  addToCart: async (userId, productData) => {
    return apiRequest(`/carts/${userId}`, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  removeFromCart: async (userId, productData) => {
    return apiRequest(`/carts/${userId}`, {
      method: 'DELETE',
      body: JSON.stringify(productData)
    });
  },

  updateCartItem: async (userId, productData) => {
    return apiRequest(`/carts/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  clearCart: async (userId) => {
    return apiRequest(`/carts/${userId}/clear`, {
      method: 'DELETE'
    });
  },

  getCartCount: async (userId) => {
    if (!userId) {
      return { success: false, message: '사용자 ID가 필요합니다.' };
    }
    return apiRequest(`/carts/${userId}/count`);
  }
};

export const orderAPI = {
  createOrder: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  getOrderById: async (orderId) => {
    return apiRequest(`/orders/${orderId}`);
  },

  getUserOrders: async (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },

  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrderByNumber: async (orderNumber) => {
    return apiRequest(`/orders/number/${orderNumber}`);
  },

  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  cancelOrder: async (orderId) => {
    return apiRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT'
    });
  }
};

export const newsletterAPI = {
  subscribe: async (email, preferences = {}) => {
    return apiRequest('/newsletters/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, preferences })
    });
  },

  unsubscribe: async (email) => {
    return apiRequest('/newsletters/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  checkStatus: async (email) => {
    return apiRequest(`/newsletters/status/${encodeURIComponent(email)}`);
  },

  getSubscribers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/newsletters/subscribers${queryString ? `?${queryString}` : ''}`);
  },

  getStats: async () => {
    return apiRequest('/newsletters/stats');
  }
};