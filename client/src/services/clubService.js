import api from '../api/api';

export async function getClubsRequest({ page = 0, size = 8 }) {
  const response = await api.get('/api/club', { params: { page, size } })
  return response.data
}

export async function getAllClubsRequest() {
  const response = await api.get('/api/club');
  return response.data;
}

export async function getClubRequest(id) {
  const response = await api.get(`/api/club/${id}`)
  return response.data
}

export async function createClubRequest(data) {
  const response = await api.post('/api/club', data)
  return response.data
}

export async function updateClubRequest(id, data) {
  const response = await api.put(`/api/club/${id}`, data)
  return response.data
}

export async function deleteClubRequest(id) {
  const response = await api.delete(`/api/club/${id}`)
  return response.data
}