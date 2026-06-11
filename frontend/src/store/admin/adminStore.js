import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const ADMIN_BASE_URL = `${API_BASE_URL}/admin`

function getToken() {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('authToken')
  )
}

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function readResponse(response) {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || `Erreur API ${response.status}`)
  }

  return data
}

function extractUsers(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.users)) return payload.users
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function extractUser(payload) {
  return payload?.user || payload?.data || payload
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalUsers = computed(() => users.value.length)
  const pendingUsers = computed(() => users.value.filter((user) => user.status === 'PENDING').length)
  const activeUsers = computed(() => users.value.filter((user) => user.status === 'ACTIVE').length)
  const blockedUsers = computed(() => users.value.filter((user) => user.status === 'BLOCKED').length)

  const fetchUsers = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()

      if (filters.role) params.set('role', filters.role)
      if (filters.status) params.set('status', filters.status)

      const query = params.toString() ? `?${params.toString()}` : ''

      const response = await fetch(`${ADMIN_BASE_URL}/users${query}`, {
        method: 'GET',
        headers: getHeaders()
      })

      const data = await readResponse(response)
      users.value = extractUsers(data)
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des utilisateurs'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUsersByRole = (role) => {
    return users.value.filter((user) => user.role === role)
  }

  const getUserById = (id) => {
    return users.value.find((user) => String(user.id) === String(id))
  }

  const addUser = async (user) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${ADMIN_BASE_URL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          role: user.role
        })
      })

      const data = await readResponse(response)
      const createdUser = extractUser(data)

      if (createdUser?.id) {
        users.value.unshift(createdUser)
      } else {
        await fetchUsers()
      }

      return createdUser
    } catch (err) {
      error.value = err.message || 'Erreur lors de la creation utilisateur'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, updates) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${ADMIN_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      })

      const data = await readResponse(response)
      const updatedUser = extractUser(data)

      const index = users.value.findIndex((user) => String(user.id) === String(id))
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updatedUser }
      }

      return updatedUser
    } catch (err) {
      error.value = err.message || 'Erreur lors de la modification utilisateur'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUserStatus = async (id, status) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${ADMIN_BASE_URL}/users/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      })

      const data = await readResponse(response)
      const updatedUser = extractUser(data)

      const index = users.value.findIndex((user) => String(user.id) === String(id))
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updatedUser, status }
      }

      return updatedUser
    } catch (err) {
      error.value = err.message || 'Erreur lors de la modification du statut'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${ADMIN_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      await readResponse(response)
      users.value = users.value.filter((user) => String(user.id) !== String(id))
    } catch (err) {
      error.value = err.message || 'Erreur lors de la suppression utilisateur'
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveUser = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${ADMIN_BASE_URL}/accept-invite/${id}`, {
        method: 'POST',
        headers: getHeaders()
      })

      const data = await readResponse(response)
      const approvedUser = extractUser(data)

      const index = users.value.findIndex((user) => String(user.id) === String(id))
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...approvedUser, status: 'ACTIVE' }
      }

      return approvedUser
    } catch (err) {
      error.value = err.message || 'Erreur lors de la validation utilisateur'
      throw err
    } finally {
      loading.value = false
    }
  }

  const rejectUser = async (id, reason = 'Refuse par administrateur') => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${ADMIN_BASE_URL}/reject-invite/${id}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason })
      })

      const data = await readResponse(response)
      await fetchUsers()
      return data
    } catch (err) {
      error.value = err.message || 'Erreur lors du refus utilisateur'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    totalUsers,
    pendingUsers,
    activeUsers,
    blockedUsers,
    fetchUsers,
    getUsersByRole,
    getUserById,
    addUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    approveUser,
    rejectUser
  }
})
