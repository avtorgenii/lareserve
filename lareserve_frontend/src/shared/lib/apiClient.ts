import axios from 'axios';

import { tokenStorage } from '@/features/auth/model/tokenStorage';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

apiClient.interceptors.request.use((config) => {
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
    }
    console.error('[API] Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: (error.config?.baseURL ?? '') + (error.config?.url ?? ''),
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
      requestHeaders: error.config?.headers,
    });
    return Promise.reject(error);
  }
);
