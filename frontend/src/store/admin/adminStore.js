import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([
    {
      id: '1',
      name: 'Ahmed Alami',
      email: 'ahmed.alami@ensat.ac.ma',
      role: 'Etudiant',
      establishment: 'ENSA Tanger',
      status: 'Actif',
      lastLogin: '2024-06-10'
    },
    {
      id: '2',
      name: 'Pr. Mohamed Benali',
      email: 'm.benali@ensat.ac.ma',
      role: 'Professeur',
      establishment: 'ENSA Tanger',
      status: 'Actif',
      lastLogin: '2024-06-09'
    },
    {
      id: '3',
      name: 'Hassan Benjelloun',
      email: 'h.benjelloun@ocp.ma',
      role: 'Professionnel',
      establishment: 'OCP Group',
      status: 'En attente',
      lastLogin: '2024-06-08'
    },
    {
      id: '4',
      name: 'Fatima Idrissi',
      email: 'f.idrissi@ensat.ac.ma',
      role: 'Etudiant',
      establishment: 'ENSA Tanger',
      status: 'Suspendu',
      lastLogin: '2024-06-05'
    }
  ])

  const totalUsers = computed(() => users.value.length)

  const getUsersByRole = (role) => {
    return users.value.filter((user) => user.role === role)
  }

  const getUserById = (id) => {
    return users.value.find((user) => user.id === id)
  }

  const updateUser = (id, updates) => {
    const user = users.value.find((user) => user.id === id)

    if (user) {
      Object.assign(user, updates)
    }
  }

  const deleteUser = (id) => {
    users.value = users.value.filter((user) => user.id !== id)
  }

  return {
    users,
    totalUsers,
    getUsersByRole,
    getUserById,
    updateUser,
    deleteUser
  }
})