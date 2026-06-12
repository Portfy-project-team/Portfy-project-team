import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../authStore.js'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalUsers = computed(() => users.value.length)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/admin/users')
      const data = response.data.users || response.data
      
      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data)
        users.value = []
        return
      }

      // Map API response to the format expected by the frontend
      users.value = data
        .filter(user => user.role !== 'ADMIN') // Filter out admins
        .map(user => {
          let displayRole = 'Etudiant'
          if (user.role === 'PROF') displayRole = 'Professeur'
          if (user.role === 'PRO')  displayRole = 'Professionnel'

          return {
            id: user.id,
            name: user.nom && user.prenom ? `${user.prenom} ${user.nom}` : (user.student?.nom ? `${user.student?.prenom} ${user.student?.nom}` : (user.prof?.nom ? `${user.prof?.prenom} ${user.prof?.nom}` : (user.professionnel?.nom ? `${user.professionnel?.prenom} ${user.professionnel?.nom}` : (user.admin?.nom ? `${user.admin?.prenom} ${user.admin?.nom}` : user.email)))),
            email: user.email,
            role: displayRole,
            establishment: user.student?.etablissement || user.prof?.etablissement || user.professionnel?.entreprise || 'N/A',
            status: user.status === 'ACTIVE' ? 'Actif' : (user.status === 'PENDING' ? 'En attente' : 'Suspendu'),
            lastLogin: user.createdAt // Approximation if no last login available
          }
        })
    } catch (err) {
      console.error("Failed to fetch users:", err)
      error.value = err.response?.data?.message || 'Erreur lors du chargement des utilisateurs'
    } finally {
      loading.value = false
    }
  }

  const getUsersByRole = (role) => {
    // Map frontend role names to DB enum names if necessary
    let dbRole = role
    if (role === 'Etudiant') dbRole = 'STUDENT'
    if (role === 'Professeur') dbRole = 'PROF'
    if (role === 'Professionnel') dbRole = 'PRO'
    if (role === 'Administrateur') dbRole = 'ADMIN'
    
    return users.value.filter((user) => user.role === dbRole || user.role === role)
  }

  const getUserById = (id) => {
    return users.value.find((user) => user.id.toString() === id.toString())
  }

  const updateUser = async (id, updates) => {
    try {
      // Logic for updating user details if needed
      const user = users.value.find((u) => u.id === id)
      if (user) {
        Object.assign(user, updates)
      }
    } catch (err) {
      console.error("Failed to update user:", err)
    }
  }

  const updateUserStatus = async (id, status) => {
    try {
      let dbStatus = 'PENDING'
      if (status === 'Actif') dbStatus = 'ACTIVE'
      if (status === 'Suspendu') dbStatus = 'BLOCKED'
      
      await api.patch(`/admin/users/${id}/status`, { status: dbStatus })
      const user = users.value.find((user) => user.id === id)
      if (user) {
        user.status = status
      }
    } catch (err) {
      console.error("Failed to update user status:", err)
      throw err
    }
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`)
      users.value = users.value.filter((user) => user.id !== id)
    } catch (err) {
      console.error("Failed to delete user:", err)
      throw err
    }
  }

  return {
    users,
    totalUsers,
    loading,
    error,
    fetchUsers,
    getUsersByRole,
    getUserById,
    updateUser,
    updateUserStatus,
    deleteUser
  }
})