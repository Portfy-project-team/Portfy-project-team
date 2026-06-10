const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const getToken = () => localStorage.getItem('token')

export async function fetchComments() {
  const res = await fetch(`${BASE_URL}/api/professor/comments`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  const json = await res.json()
  return json.data
}

export async function markAsReadApi(id) {
  await fetch(`${BASE_URL}/api/professor/comments/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` }
  })
}

export async function deleteCommentApi(id) {
  await fetch(`${BASE_URL}/api/professor/comments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  })
}

export async function replyToCommentApi(id, message) {
  await fetch(`${BASE_URL}/api/professor/comments/${id}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ message })
  })
}