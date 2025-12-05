import { useQuery } from '@tanstack/react-query';
import api from './api';

// certificates
const fetchAllCertificates = async () => {
  try {
    const response = await api.get('/Certificate/GetAll');
    return response.data;
  } catch (error) {
    // Type assertion for AxiosError
    if (error && typeof error === 'object') {
      const err = error as any;
      if (err.response) {
        throw new Error(err.response.data?.message || 'API Error: ' + err.response.status);
      } else if (err.request) {
        throw new Error('No response from server. Check your network or ngrok tunnel.');
      } else {
        throw new Error('Request error: ' + (err.message || 'Unknown error'));
      }
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

export function getAllCertificates() {
  return useQuery({
    queryKey: ['all certificates'],
    queryFn: fetchAllCertificates,
  });
}
//slider
const fetchAllSliders = async () => {
  try {
    const response = await api.get('/Slider/GetAll');
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object') {
      const err = error as any;
      if (err.response) {
        throw new Error(err.response.data?.message || 'API Error: ' + err.response.status);
      } else if (err.request) {
        throw new Error('No response from server. Check your network or ngrok tunnel.');
      } else {
        throw new Error('Request error: ' + (err.message || 'Unknown error'));
      }
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}
export function getAllSliders() {
  return useQuery({
    queryKey: ['all sliders'],
    queryFn: fetchAllSliders,
  });
}
