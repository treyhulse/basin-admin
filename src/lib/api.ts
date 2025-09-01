import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getAuthToken, removeAuthToken } from './auth';
import { AuthResponse, AuthContextResponse, SignUpRequest } from './auth';
import { logger, logApi, LogContext } from './logger';
import { config } from './config';

// Generate unique request IDs for tracking
const generateRequestId = () => `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const api: AxiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
});

// Request interceptor to add auth token and logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    // Store request metadata for response logging
    (config as any).requestId = requestId;
    (config as any).startTime = startTime;
    
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const logContext: LogContext = {
      requestId,
      endpoint: config.url,
      method: config.method?.toUpperCase(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };
    
    logApi(`Request started: ${config.method?.toUpperCase()} ${config.url}`, logContext, {
      headers: config.headers,
      data: config.data,
      params: config.params,
    });
    
    return config;
  },
  (error) => {
    logger.error('Request interceptor error', undefined, error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors with detailed logging
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestId = (response.config as any).requestId;
    const startTime = (response.config as any).startTime;
    const duration = Date.now() - startTime;
    
    const logContext: LogContext = {
      requestId,
      endpoint: response.config.url,
      method: response.config.method?.toUpperCase(),
      statusCode: response.status,
      duration,
    };
    
    logApi(`Response received: ${response.status} ${response.statusText}`, logContext, {
      data: response.data,
      headers: response.headers,
      duration: `${duration}ms`,
    });
    
    return response;
  },
  (error: AxiosError) => {
    const requestId = (error.config as any)?.requestId;
    const startTime = (error.config as any)?.startTime;
    const duration = startTime ? Date.now() - startTime : undefined;
    
    const logContext: LogContext = {
      requestId,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      statusCode: error.response?.status,
      duration,
    };
    
    // Enhanced error logging with different scenarios
    if (error.code === 'ECONNABORTED') {
      logger.error('Request timeout - backend may be unreachable', logContext, error, {
        timeout: error.config?.timeout,
        url: error.config?.url,
      });
    } else if (error.code === 'ERR_NETWORK') {
      logger.error('Network error - cannot connect to backend', logContext, error, {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        message: 'This usually means the backend server is down or unreachable',
      });
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const statusText = error.response.statusText;
      
      if (status === 401) {
        logger.warn('Authentication failed - removing token and redirecting', logContext, error, {
          status,
          statusText,
          responseData: error.response.data,
        });
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (status >= 500) {
        logger.error(`Server error ${status}: ${statusText}`, logContext, error, {
          status,
          statusText,
          responseData: error.response.data,
          headers: error.response.headers,
        });
      } else {
        logger.warn(`Client error ${status}: ${statusText}`, logContext, error, {
          status,
          statusText,
          responseData: error.response.data,
        });
      }
    } else if (error.request) {
      // Request was made but no response received
      logger.error('No response received from server', logContext, error, {
        requestData: error.request,
        message: 'This usually means the backend server is down or unreachable',
      });
    } else {
      // Something else happened
      logger.error('Request setup error', logContext, error, {
        message: error.message,
      });
    }
    
    return Promise.reject(error);
  }
);

// Helper function to create detailed error messages
export const createDetailedErrorMessage = (error: AxiosError): string => {
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. The backend server may be overloaded or unreachable.';
  }
  
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot connect to the backend server. Please check if the server is running and accessible.';
  }
  
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as any;
    
    if (status === 401) {
      return data?.message || 'Authentication failed. Please check your credentials.';
    }
    
    if (status === 403) {
      return data?.message || 'Access denied. You do not have permission to perform this action.';
    }
    
    if (status === 404) {
      return data?.message || 'The requested resource was not found.';
    }
    
    if (status >= 500) {
      return data?.message || 'Server error. Please try again later or contact support.';
    }
    
    return data?.message || `Request failed with status ${status}.`;
  }
  
  if (error.request) {
    return 'No response received from the server. The backend may be down or unreachable.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Auth API with enhanced logging
export const authAPI = {
  login: async (email: string, password: string, tenant_slug?: string): Promise<AuthResponse> => {
    const startTime = Date.now();
    
    try {
      logApi('Login attempt started', { email, tenant_slug });
      
      const response = await api.post('/auth/login', { email, password, tenant_slug });
      
      const duration = Date.now() - startTime;
      logApi('Login successful', { 
        email, 
        tenant_slug, 
        userId: response.data.user?.id,
        tenantId: response.data.tenant_id,
        duration 
      });
      
      return response.data;
    } catch (error) {
      const duration = Date.now() - startTime;
      const detailedMessage = createDetailedErrorMessage(error as AxiosError);
      
      logApi('Login failed', { 
        email, 
        tenant_slug, 
        duration,
        errorMessage: detailedMessage 
      }, error as Error);
      
      throw new Error(detailedMessage);
    }
  },
  
  signup: async (userData: SignUpRequest): Promise<AuthResponse> => {
    const startTime = Date.now();
    
    try {
      logApi('Signup attempt started', { email: userData.email, tenant_slug: userData.tenant_slug });
      
      const response = await api.post('/auth/signup', userData);
      
      const duration = Date.now() - startTime;
      logApi('Signup successful', { 
        email: userData.email, 
        tenant_slug: userData.tenant_slug,
        userId: response.data.user?.id,
        duration 
      });
      
      return response.data;
    } catch (error) {
      const duration = Date.now() - startTime;
      const detailedMessage = createDetailedErrorMessage(error as AxiosError);
      
      logApi('Signup failed', { 
        email: userData.email, 
        tenant_slug: userData.tenant_slug,
        duration,
        errorMessage: detailedMessage 
      }, error as Error);
      
      throw new Error(detailedMessage);
    }
  },
  
  getCurrentUser: async () => {
    try {
      logApi('Fetching current user');
      const response = await api.get('/auth/me');
      logApi('Current user fetched successfully', { userId: response.data.id });
      return response.data;
    } catch (error) {
      logApi('Failed to fetch current user', undefined, error as Error);
      throw error;
    }
  },
  
  getAuthContext: async (): Promise<AuthContextResponse> => {
    try {
      logApi('Fetching auth context');
      const response = await api.get('/auth/context');
      logApi('Auth context fetched successfully', { 
        userId: response.data.user?.id,
        tenantId: response.data.tenant?.id 
      });
      return response.data;
    } catch (error) {
      logApi('Failed to fetch auth context', undefined, error as Error);
      throw error;
    }
  },
  
  switchTenant: async (tenant_id: string): Promise<AuthResponse> => {
    try {
      logApi('Switching tenant', { tenant_id });
      const response = await api.post('/auth/switch-tenant', { tenant_id });
      logApi('Tenant switched successfully', { 
        tenant_id,
        newToken: !!response.data.token 
      });
      return response.data;
    } catch (error) {
      logApi('Failed to switch tenant', { tenant_id }, error as Error);
      throw error;
    }
  },
  
  getUserTenants: async () => {
    try {
      logApi('Fetching user tenants');
      const response = await api.get('/auth/tenants');
      logApi('User tenants fetched successfully', { 
        tenantCount: response.data.length 
      });
      return response.data;
    } catch (error) {
      logApi('Failed to fetch user tenants', undefined, error as Error);
      throw error;
    }
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
  getByCollection: async (collectionId: string) => {
    const response = await api.get(`/items/fields?collection_id=${collectionId}`);
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


