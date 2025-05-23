import api from '../api/api';

export async function getServicesRequest({ page = 0, size = 12 }) {
  const response = await api.get('/api/service', { params: { page, size } });
  return response.data;
}

export async function getServiceRequest(id) {
  const response = await api.get(`/api/service/${id}`);
  return response.data;
}

export async function createServiceRequest(data) {
  const response = await api.post('/api/service', data);
  return response.data;
}

export async function updateServiceRequest(id, data) {
  const response = await api.put(`/api/service/${id}`, data);
  return response.data;
}

export async function deleteServiceRequest(id) {
  const response = await api.delete(`/api/service/${id}`);
  return response.data;
}