import api from '../api/api';

export async function registrationRequest(data) {
  const response = await api.post('/api/user', data);
  return response.data;
}