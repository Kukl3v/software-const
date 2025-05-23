import api from '../api/api'

export async function getSalesReportRequest(startDate, endDate) {
  const response = await api.get('/api/report/sales', {params: { startDate, endDate }})
  return response.data
}