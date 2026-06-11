const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const headers  = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

export async function fetchSettings() {
  const res  = await fetch(`${BASE_URL}/api/professor/settings`, { headers: headers() })
  const json = await res.json()
  return json.data
}

export async function saveProfileApi(data) {
  const res = await fetch(`${BASE_URL}/api/professor/settings/profile`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify(data)
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? 'Erreur') }
}

export async function savePasswordApi(data) {
  const res = await fetch(`${BASE_URL}/api/professor/settings/password`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify(data)
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? 'Erreur') }
}

export async function deleteAccountApi() {
  const res = await fetch(`${BASE_URL}/api/professor/settings/account`, {
    method: 'DELETE', headers: headers()
  })
  if (!res.ok) throw new Error('Erreur lors de la suppression.')
}