/**
 * Client API centralisé
 * Gère les appels vers les microservices via les rewrites Next.js
 */

const API_BASE = '';  // Utilise les rewrites Next.js (même origine)

class ApiClient {
  static getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  static async request(endpoint, options = {}) {
    const token = this.getToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Une erreur est survenue');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // ==================== AUTH ====================

  static async register({ email, password, firstName, lastName }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  }

  static async login({ email, password }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async getProfile() {
    return this.request('/api/auth/profile');
  }

  static async updateProfile(data) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==================== PRODUCTS ====================

  static async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return this.request(`/api/products${queryString ? `?${queryString}` : ''}`);
  }

  static async getProduct(id) {
    return this.request(`/api/products/${id}`);
  }

  // ==================== CATEGORIES ====================

  static async getCategories() {
    return this.request('/api/categories');
  }

  // ==================== ORDERS ====================

  static async createOrder({ items, shippingAddress }) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items, shippingAddress }),
    });
  }

  static async getOrders(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return this.request(`/api/orders${queryString ? `?${queryString}` : ''}`);
  }

  static async getOrder(id) {
    return this.request(`/api/orders/${id}`);
  }
}

export default ApiClient;
