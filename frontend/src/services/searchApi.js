import { api } from '@/store/authStore.js'

export async function searchTalents(params = {}) {

  const res = await api.get('/search', {
    params
  })

  return res.data.data
}