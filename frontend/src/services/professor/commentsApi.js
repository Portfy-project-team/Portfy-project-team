import { api } from '../../store/authStore.js'

export async function fetchComments() {
  const res = await api.get('/professor/comments')
  return res.data.data
}

export async function markAsReadApi(id) {
  await api.patch(`/professor/comments/${id}/read`)
}

export async function deleteCommentApi(id) {
  await api.delete(`/professor/comments/${id}`)
}

export async function replyToCommentApi(id, message) {
  await api.post(`/professor/comments/${id}/reply`, { message })
}
