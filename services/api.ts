import axios, { InternalAxiosRequestConfig } from 'axios';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = 'https://health-app-backend-production-0d07.up.railway.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        // Ensure headers exist and set Authorization
        if (!config.headers) {
          config.headers = {} as any;
        }
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('✅ Adding auth token to request:', session.access_token.substring(0, 20) + '...');
        console.log('🔍 Request URL:', config.url);
        console.log('🔍 Request method:', config.method?.toUpperCase());
      } else {
        console.warn('⚠️ No auth token available for request');
      }
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response successful:', response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ API Error details:');
    console.error('  URL:', originalRequest?.url);
    console.error('  Method:', originalRequest?.method?.toUpperCase());
    console.error('  Status:', error.response?.status);
    console.error('  Response data:', error.response?.data);
    console.error('  Headers sent:', originalRequest?.headers);
    
    // If we get a 401 and haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Attempting token refresh for 401 error...');
      originalRequest._retry = true;
      
      try {
        // Try to refresh the session
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          throw refreshError;
        }
        
        if (session?.access_token) {
          console.log('✅ Token refreshed successfully');
          // Update the authorization header and retry
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers['Authorization'] = `Bearer ${session.access_token}`;
          console.log('🔄 Retrying original request with new token...');
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Clear session and redirect to login
        await supabase.auth.signOut();
      }
    }
    
    console.error('❌ Final API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;