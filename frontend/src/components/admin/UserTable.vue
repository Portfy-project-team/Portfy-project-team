<template>
  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
      <h3 class="font-bold text-slate-900">{{ title }}</h3>
      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher..."
          class="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
    </div>
    <table class="w-full text-sm">
      <thead class="bg-slate-50 border-b border-slate-200">
        <tr>
          <th class="px-6 py-3 text-left font-semibold text-slate-700">Utilisateur</th>
          <th class="px-6 py-3 text-left font-semibold text-slate-700">Rôle</th>
          <th class="px-6 py-3 text-left font-semibold text-slate-700">Statut</th>
          <th class="px-6 py-3 text-left font-semibold text-slate-700">Créé le</th>
          <th class="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in filteredUsers"
          :key="user.id"
          class="border-b border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <td class="px-6 py-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {{ getInitials(user.email) }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ getDisplayName(user.email) }}</p>
                <p class="text-xs text-slate-600">{{ user.email }}</p>
              </div>
            </div>
          </td>
          <td class="px-6 py-3">
            <span :class="['px-2 py-1 text-xs font-semibold rounded', getRoleClass(user.role)]">
              {{ formatRole(user.role) }}
            </span>
          </td>
          <td class="px-6 py-3">
            <span :class="['px-2 py-1 text-xs font-semibold rounded', getStatusClass(user.status)]">
              {{ formatStatus(user.status) }}
            </span>
          </td>
          <td class="px-6 py-3 text-slate-700">{{ formatDate(user.createdAt) }}</td>
          <td class="px-6 py-3">
            <button
              @click="selectUser(user.id)"
              class="text-blue-600 hover:text-blue-700 font-semibold text-xs"
            >
              Voir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
      <p class="text-sm text-slate-600">{{ filteredUsers.length }} utilisateur(s)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: string | number
  email: string
  role: 'ADMIN' | 'PRO' | 'STUDENT' | 'PROF' | string
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'BLOCKED' | string
  createdAt?: string
}

const props = defineProps<{
  title: string
  users: User[]
}>()

const router = useRouter()
const searchQuery = ref('')

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return props.users.filter((user) => {
    const email = user.email || ''
    const role = user.role || ''
    const status = user.status || ''

    return (
      email.toLowerCase().includes(query) ||
      role.toLowerCase().includes(query) ||
      status.toLowerCase().includes(query) ||
      formatRole(role).toLowerCase().includes(query) ||
      formatStatus(status).toLowerCase().includes(query)
    )
  })
})

const formatRole = (role: string) => {
  const roles: Record<string, string> = {
    STUDENT: 'Etudiant',
    PROF: 'Professeur',
    PRO: 'Professionnel',
    ADMIN: 'Administrateur'
  }

  return roles[role] || role
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    ACTIVE: 'Actif',
    PENDING: 'En attente',
    BLOCKED: 'Suspendu',
    REJECTED: 'Refuse'
  }

  return statuses[status] || status
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const getDisplayName = (email: string) => {
  if (!email) return 'Utilisateur'
  return email.split('@')[0]
}

const getInitials = (email: string) => {
  return getDisplayName(email)
    .split(/[._-]/)
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const getRoleClass = (role: string) => {
  const roleMap: Record<string, string> = {
    STUDENT: 'bg-blue-100 text-blue-700',
    PROF: 'bg-purple-100 text-purple-700',
    PRO: 'bg-green-100 text-green-700',
    ADMIN: 'bg-slate-100 text-slate-700'
  }
  return roleMap[role] || 'bg-slate-100 text-slate-700'
}

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-orange-100 text-orange-700',
    BLOCKED: 'bg-red-100 text-red-700',
    REJECTED: 'bg-slate-100 text-slate-700'
  }
  return statusMap[status] || 'bg-slate-100 text-slate-700'
}

const selectUser = (userId: string | number) => {
  router.push(`/admin/users/${userId}`)
}
</script>
