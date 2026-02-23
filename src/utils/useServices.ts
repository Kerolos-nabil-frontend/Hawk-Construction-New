import { useQuery } from '@tanstack/react-query';
import api from './api';

// certificates
const fetchAllCertificates = async () => {
  try {
    const [certsRes, appsRes, offRes, refsRes] = await Promise.all([
      api.get('Certificate/GetAll?type=certificate'),
      api.get('Certificate/GetAll?type=approval'),
      api.get('Certificate/GetAll?type=official_approval'),
      api.get('Certificate/GetAll?type=reference')
    ]);

    // Combine all arrays into one
    return [
      ...(certsRes.data || []),
      ...(appsRes.data || []),
      ...(offRes.data || []),
      ...(refsRes.data || [])
    ];
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
    const response = await api.get('Slider/GetAll');
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

// projects
const fetchAllProjects = async () => {
  try {
    const response = await api.get('Project/GetAll');
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

export function getAllProjects() {
  return useQuery({
    queryKey: ['all projects'],
    queryFn: fetchAllProjects,
  });
}

// careers
const fetchAllCareers = async () => {
  try {
    const response = await api.get('Career/GetAll');
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

export function getAllCareers() {
  return useQuery({
    queryKey: ['all careers'],
    queryFn: fetchAllCareers,
  });
}

// services
const fetchAllServices = async () => {
  try {
    const response = await api.get('Service/GetAll');
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

export function getAllServices() {
  return useQuery({
    queryKey: ['all services'],
    queryFn: fetchAllServices,
  });
}
