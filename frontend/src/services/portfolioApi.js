import { api } from '@/store/authStore.js'

export async function getPublicPortfolio(studentId) {

  const res = await api.get(
    `/portfolio/public/${studentId}`
  )

  return res.data.portfolio
}