import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  baseURL: Platform.OS === 'android' ? "http://10.0.2.2:5085" : 'http://localhost:5085/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor to handle 401 and refresh token
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log("Refresh Token:", refreshToken);
      
      if (!refreshToken) {
        //throw new Error('No refresh token available');
        return instance(originalRequest);
      }

      // Call your refresh endpoint
      const response = await axios.post(
        `${instance.defaults.baseURL}/refresh`,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Store new tokens
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);

      // Update authorization header
      instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Process queued requests
      processQueue(null, accessToken);

      return instance(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear tokens and reject all queued requests
      processQueue(refreshError, null);
      
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      
      // Optional: Navigate to login screen or dispatch logout action
      // navigation.navigate('Login');
      // or dispatch({ type: 'LOGOUT' });
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;