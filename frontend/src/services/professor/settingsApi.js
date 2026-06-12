import { api } from '../../store/authStore.js'

export async function fetchSettings() {
  const res = await api.get('/professor/settings')
  return res.data.data
}

export async function saveProfileApi(data) {
  await api.patch('/professor/settings/profile', data)
}

export async function savePasswordApi(data) {
  await api.patch('/professor/settings/password', data)
}

export async function deleteAccountApi() {
  await api.delete('/professor/settings/account')
}
