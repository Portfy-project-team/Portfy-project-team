// src/store/dashboardStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore }   from '@/store/authStore.js'
import { fetchDashboard } from '@/services/dashboardApi.js'

export const useDashboardStore = defineStore('dashboard', () => {
  const authStore = useAuthStore()

  // user vient du authStore — jamais dupliqué ici
  const user = computed(() => authStore.user)

  const stats            = ref([])
  const pendingProjects  = ref([])
  const recommendations  = ref([])
  const recentActivity   = ref([])
  const loading          = ref(false)
  const error            = ref(null)

  async function loadDashboard() {
    loading.value = true
    error.value   = null
    try {
      const data = await fetchDashboard()
      stats.value           = data.stats           ?? []
      pendingProjects.value = data.pendingProjects  ?? []
      recommendations.value = data.recommendations  ?? []
      recentActivity.value  = data.recentActivity   ?? []
    } catch (e) {
      error.value = e.message || 'Erreur de chargement'
    } finally {
      loading.value = false
    }
  }

  return { user, stats, pendingProjects, recommendations, recentActivity, loading, error, loadDashboard }
})