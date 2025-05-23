import api from '../api/api';

export async function getUserSchedule(userId) {
  const response = await api.get(`/api/session/user/${userId}/schedule`);
  return response.data;
}

export async function getSession(userId) {
  const response = await api.get(`/api/session/user/${userId}`);
  return response.data;
}