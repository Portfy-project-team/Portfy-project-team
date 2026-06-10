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
          <th class="px-6 py-3 text-left font-semibold text-slate-700">Établissement</th>
          <th class="px-6 py-3 text-left font-semibold text-slate-700">Statut</th>
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
                {{ user.name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ user.name }}</p>
                <p class="text-xs text-slate-600">{{ user.email }}</p>
              </div>
            </div>
          </td>
          <td class="px-6 py-3">
            <span :class="['px-2 py-1 text-xs font-semibold rounded', getRoleClass(user.role)]">
              {{ user.role }}
            </span>
          </td>
          <td class="px-6 py-3 text-slate-700">{{ user.establishment }}</td>
          <td class="px-6 py-3">
            <span :class="['px-2 py-1 text-xs font-semibold rounded', getStatusClass(user.status)]">
              {{ user.status }}
            </span>
          </td>
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
      <p class="text-sm text-slate-600">Affichage 1-4 sur {{ users.length }}</p>
      <div class="flex gap-2">
        <button class="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Précédent</button>
        <button class="px-3 py-1 bg-slate-900 text-white rounded-lg text-sm font-semibold">1</button>
        <button class="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">2</button>
        <button class="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: string
  name: string
  email: string
  role: string
  establishment: string
  status: string
}

const props = defineProps<{
  title: string
  users: User[]
}>()

const router = useRouter()
const searchQuery = ref('')

const filteredUsers = computed(() => {
  return props.users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getRoleClass = (role: string) => {
  const roleMap: Record<string, string> = {
    'Étudiant': 'bg-blue-100 text-blue-700',
    'Professeur': 'bg-purple-100 text-purple-700',
    'Professionnel': 'bg-green-100 text-green-700'
  }
  return roleMap[role] || 'bg-slate-100 text-slate-700'
}

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'Actif': 'bg-green-100 text-green-700',
    'En attente': 'bg-orange-100 text-orange-700',
    'Suspendu': 'bg-red-100 text-red-700'
  }
  return statusMap[status] || 'bg-slate-100 text-slate-700'
}

const selectUser = (userId: string) => {
  router.push(`/admin/users/${userId}`)
}
</script>
