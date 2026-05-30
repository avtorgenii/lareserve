import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

apiClient.interceptors.request.use((config) => {
  if (config.baseURL && config.url) {
    const fullURL = config.baseURL + config.url;
    console.log(`[API] Request: ${config.method?.toUpperCase()} ${fullURL}`, config);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status, response.config.url, response);
    return response;
  },
  (error) => {
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
