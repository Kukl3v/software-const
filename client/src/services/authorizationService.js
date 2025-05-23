import api from '../api/api'

export async function loginRequest(data) {
  const response = await api.post('/api/auth/login', data)
  return response.data
}