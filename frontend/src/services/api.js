import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const bookService = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return api.post('/books', data, config);
  },
  update: (id, data) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return api.put(`/books/${id}`, data, config);
  },
  delete: (id) => api.delete(`/books/${id}`),
  getCategories: () => api.get('/books/categories'),
  restock: (id, additionalCopies) => api.put(`/books/${id}/restock`, { additionalCopies })
};

export const transactionService = {
  getAll: (params) => api.get('/transactions', { params }),
  getByUser: (userId) => api.get(`/transactions/user/${userId}`),
  issue: (data) => api.post('/transactions/issue', data),
  return: (data) => api.post('/transactions/return', data),
  getStats: () => api.get('/transactions/stats')
};

export const userService = {
  getAll: () => api.get('/auth/users'),
  getCurrentUser: () => api.get('/auth/user'),
  updateUser: (data) => api.put('/auth/user', data)
};

export const requestService = {
  getMyRequests: () => api.get('/requests/my'),
  getAll: (status) => api.get('/requests', { params: { status } }),
  create: (bookId) => api.post('/requests', { bookId }),
  approve: (id, data) => api.put(`/requests/${id}/approve`, data),
  reject: (id, data) => api.put(`/requests/${id}/reject`, data),
  cancel: (id) => api.delete(`/requests/${id}`)
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export default api;
