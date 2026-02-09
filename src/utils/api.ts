import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

// const api = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default api;

// const api = axios.create({
//   baseURL: 'https://subintroductive-smashable-scottie.ngrok-free.dev/api',
// });
// export default api;


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5026/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // avoid hanging requests
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Server responded with an error:', error.response);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Axios setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
