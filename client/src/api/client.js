import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: `${API_URL}/api` });

// Attach the JWT (if any) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired/invalid token while logged in -> let AuthContext sign the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

/** Turn any axios error into a message that is safe to show to the user. */
export const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
  if (err.response?.data?.msg) return err.response.data.msg;
  if (err.request && !err.response) return 'Cannot reach the server. Please check your connection.';
  return fallback;
};

export default api;
