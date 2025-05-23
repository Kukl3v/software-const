import api from '../api/api';

export async function getMembershipsRequest({ page = 0, size = 8 }) {
  const res = await api.get('/api/membership', { params: { page, size } });
  return res.data;
}
export async function createMembershipRequest(data) {
  const res = await api.post('/api/membership', data);
  return res.data;
}
export async function updateMembershipRequest(id, data) {
  const res = await api.put(`/api/membership/${id}`, data);
  return res.data;
}
export async function deleteMembershipRequest(id) {
  const res = await api.delete(`/api/membership/${id}`);
  return res.data;
}
export async function getUserMembershipsRequest(userId) {
  const res = await api.get(`/api/membership/user/${userId}`);
  return res.data;
}
export async function cancelUserMembershipRequest(userMembershipId) {
  const res = await api.delete(`/api/membership/subscription/${userMembershipId}`);
  return res.data;
}
export async function subscribeUserToMembershipRequest(userId, membershipId, startDate) {
  const response = await api.post(
    `/api/membership/user/${userId}/subscribe`,
    null,
    { params: { membershipId, startDate } }
  );
  return response.data;
}

export async function getServicesByMembershipRequest(id) {
  const res = await api.get(`/api/membership/${id}/services`);
  return res.data;
}

export async function getServicesRequest({ page = 0, size = 12 }) {
  const res = await api.get('/api/service', { params: { page, size } });
  return res.data;
}

export async function addServicesToMembershipRequest(id, serviceIds) {
  const res = await api.post(`/api/membership/${id}/services`, serviceIds);
  return res.data;
}
