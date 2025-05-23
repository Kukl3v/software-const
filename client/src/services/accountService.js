import api from '../api/api'

export async function getUserByEmailRequest(email) {
  const response = await api.get(`/api/user/search?email=${email}`)
  return response.data[0]
}

export async function getUsersRequest({ page = 0, size = 12 }) {
  const response = await api.get('/api/user', { params: { page, size } })
  return response.data
}

export async function createEmployeeRequest(data) {
  const response = await api.post('/api/user/employee', data)
  return response.data
}

export async function updateUserRequest(id, data) {
  const response = await api.put(`/api/user/${id}`, data)
  return response.data
}

export async function updatePasswordRequest(id, data) {
  const response = await api.put(`/api/user/${id}/password`, data)
  return response.data
}

export async function deleteUserRequest(id) {
  const response = await api.delete(`/api/user/${id}`)
  return response.data
}

export async function getUsersByRoleRequest(role) {
  const response = await api.get(`/api/user/role/${role}`);
  return response.data;
}