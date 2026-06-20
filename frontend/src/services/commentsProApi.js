import { api } from '@/store/authStore.js'

export async function createComment(data) {

  const res =
    await api.post(
      '/comments-pro',
      data
    )

  return res.data
}

export async function getPortfolioComments(
  portfolioId
) {

  const res =
    await api.get(
      `/comments-pro/portfolio/${portfolioId}`
    )

  return res.data.data
}

export async function getMyComments() {

  const res =
    await api.get(
      '/comments-pro/me'
    )

  return res.data.data
}

export async function updateComment(
  id,
  contenu
) {

  const res =
    await api.put(
      `/comments-pro/${id}`,
      { contenu }
    )

  return res.data
}

export async function deleteComment(
  id
) {

  const res =
    await api.delete(
      `/comments-pro/${id}`
    )

  return res.data
}