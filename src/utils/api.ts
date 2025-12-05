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
  baseURL: 'https://subintroductive-smashable-scottie.ngrok-free.dev',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1', // 👈 This disables ngrok browser warning
  },
  timeout: 10000, // avoid hanging requests
});

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
