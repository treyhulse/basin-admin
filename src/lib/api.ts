import axios, { AxiosInstance } from 'axios';
import { getAuthToken, removeAuthToken } from './auth';
import { AuthResponse, AuthContextResponse, SignUpRequest } from './auth';

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string, tenant_slug?: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password, tenant_slug });
    return response.data;
  },
  signup: async (userData: SignUpRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  getAuthContext: async (): Promise<AuthContextResponse> => {
    const response = await api.get('/auth/context');
    return response.data;
  },
  switchTenant: async (tenant_id: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/switch-tenant', { tenant_id });
    return response.data;
  },
  getUserTenants: async () => {
    const response = await api.get('/auth/tenants');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  list: async (params?: {
    limit?: number;
    offset?: number;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    email?: string;
    is_active?: boolean;
  }) => {
    const response = await api.get('/items/users', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/items/users/${id}`);
    return response.data;
  },
  create: async (userData: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role_id: string;
    tenant_id?: string;
  }) => {
    const response = await api.post('/items/users', userData);
    return response.data;
  },
  update: async (id: string, userData: Record<string, unknown>) => {
    const response = await api.put(`/items/users/${id}`, userData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/items/users/${id}`);
    return response.data;
  },
};

// Roles API
export const rolesAPI = {
  list: async (params?: {
    limit?: number;
    offset?: number;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    name?: string;
  }) => {
    const response = await api.get('/items/roles', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/items/roles/${id}`);
    return response.data;
  },
  create: async (roleData: {
    name: string;
    description: string;
    tenant_id?: string;
  }) => {
    const response = await api.post('/items/roles', roleData);
    return response.data;
  },
  update: async (id: string, roleData: Record<string, unknown>) => {
    const response = await api.put(`/items/roles/${id}`, roleData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/items/roles/${id}`);
    return response.data;
  },
};

// Permissions API
export const permissionsAPI = {
  list: async (params?: {
    limit?: number;
    offset?: number;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    table_name?: string;
    action?: string;
    role_id?: string;
  }) => {
    const response = await api.get('/items/permissions', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/items/permissions/${id}`);
    return response.data;
  },
  create: async (permissionData: {
    role_id: string;
    table_name: string;
    action: string;
    tenant_id?: string;
  }) => {
    const response = await api.post('/items/permissions', permissionData);
    return response.data;
  },
  update: async (id: string, permissionData: Record<string, unknown>) => {
    const response = await api.put(`/items/permissions/${id}`, permissionData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/items/permissions/${id}`);
    return response.data;
  },
};

// Collections API
export const collectionsAPI = {
  list: async (params?: {
    limit?: number;
    offset?: number;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    name?: string;
    icon?: string;
    is_primary?: boolean;
  }) => {
    const response = await api.get('/items/collections', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/items/collections/${id}`);
    return response.data;
  },
  create: async (collectionData: {
    name: string;
    description: string;
    icon?: string;
    is_primary?: boolean;
    tenant_id?: string;
  }) => {
    const response = await api.post('/items/collections', collectionData);
    return response.data;
  },
  update: async (id: string, collectionData: Record<string, unknown>) => {
    const response = await api.put(`/items/collections/${id}`, collectionData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/items/collections/${id}`);
    return response.data;
  },
};

// Fields API
export const fieldsAPI = {
  list: async (params?: {
    limit?: number;
    offset?: number;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    name?: string;
    collection_id?: string;
    field_type?: string;
    is_primary?: boolean;
  }) => {
    const response = await api.get('/items/fields', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/items/fields/${id}`);
    return response.data;
  },
  create: async (fieldData: {
    name: string;
    collection_id: string;
    field_type: string;
    is_required?: boolean;
    is_primary?: boolean;
    validation_rules?: Record<string, unknown>;
    tenant_id?: string;
  }) => {
    const response = await api.post('/items/fields', fieldData);
    return response.data;
  },
  update: async (id: string, fieldData: Record<string, unknown>) => {
    const response = await api.put(`/items/fields/${id}`, fieldData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/items/fields/${id}`);
    return response.data;
  },
};

// API Keys API
export const apiKeysAPI = {
  list: async (params?: {
    limit?: number;
    offset?: number;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    name?: string;
    user_id?: string;
  }) => {
    const response = await api.get('/items/api-keys', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/items/api-keys/${id}`);
    return response.data;
  },
  create: async (apiKeyData: {
    name: string;
    user_id: string;
    permissions: string[];
    tenant_id?: string;
  }) => {
    const response = await api.post('/items/api-keys', apiKeyData);
    return response.data;
  },
  update: async (id: string, apiKeyData: Record<string, unknown>) => {
    const response = await api.put(`/items/api-keys/${id}`, apiKeyData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/items/api-keys/${id}`);
    return response.data;
  },
};

// Tenants API
export const tenantsAPI = {
  list: async () => {
    const response = await api.get('/tenants');
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },
  create: async (tenantData: {
    name: string;
    slug: string;
    domain?: string;
  }) => {
    const response = await api.post('/tenants', tenantData);
    return response.data;
  },
  update: async (id: string, tenantData: {
    name?: string;
    slug?: string;
    domain?: string;
    is_active?: boolean;
  }) => {
    const response = await api.put(`/tenants/${id}`, tenantData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
  },
  join: async (id: string) => {
    const response = await api.post(`/tenants/${id}/join`);
    return response.data;
  },
  addUser: async (id: string, userData: {
    user_id: string;
    role_id: string;
    tenant_id: string;
  }) => {
    const response = await api.post(`/tenants/${id}/users`, userData);
    return response.data;
  },
  removeUser: async (id: string, userId: string) => {
    const response = await api.delete(`/tenants/${id}/users/${userId}`);
    return response.data;
  },
};

// Generic items API for dynamic tables
export const itemsAPI = {
  list: async (table: string, params?: {
    limit?: number;
    offset?: number;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    filter?: string;
  }) => {
    const response = await api.get(`/items/${table}`, { params });
    return response.data;
  },
  get: async (table: string, id: string) => {
    const response = await api.get(`/items/${table}/${id}`);
    return response.data;
  },
  create: async (table: string, data: Record<string, unknown>) => {
    const response = await api.post(`/items/${table}`, data);
    return response.data;
  },
  update: async (table: string, id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/items/${table}/${id}`, data);
    return response.data;
  },
  delete: async (table: string, id: string) => {
    const response = await api.delete(`/items/${table}/${id}`);
    return response.data;
  },
};

export default api;


