import api from '../api/api';

export async function getClassesByUserRequest(userId) {
  const res = await api.get(`/api/group/user/${userId}`);
  return res.data;
}

export async function getClassesByTrainerRequest(trainerId) {
  const res = await api.get(`/api/group/trainer/${trainerId}`);
  return res.data;
}

export async function getClassesByClubRequest(clubId) {
  const res = await api.get(`/api/group/club/${clubId}`);
  return res.data;
}

export async function createGroupRequest(clubId, groupDto) {
  const res = await api.post(`/api/group/club/${clubId}`, groupDto);
  return res.data;
}

export async function removeGroupRequest(groupId, clubId) {
  const res = await api.delete(`/api/group/${groupId}/club/${clubId}`);
  return res.data;
}

export async function addClientsToGroupRequest(groupId, clientIds) {
  const res = await api.post(`/api/group/${groupId}/clients`, clientIds);
  return res.data;
}

export async function removeClientFromGroupRequest(groupId, clientId) {
  const res = await api.delete(`/api/group/${groupId}/clients/${clientId}`);
  return res.data;
}