// frontend/src/store/dashboardStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchDashboard } from '@/services/dashboardApi'

export const useDashboardStore = defineStore('dashboard', () => {
  const user            = ref(null)
  const stats           = ref([])
  const pendingProjects = ref([])
  const recommendations = ref([])
  const recentActivity  = ref([])
  const loading         = ref(false)
  const error           = ref(null)

  async function loadDashboard() {
    loading.value = true
    error.value   = null
    try {
      const data            = await fetchDashboard()
      user.value            = data.user
      stats.value           = data.stats
      pendingProjects.value = data.pendingProjects
      recommendations.value = data.recommendations
      recentActivity.value  = data.recentActivity
    } catch (e) {
      error.value = e?.message ?? 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  return {
    user, stats, pendingProjects, recommendations, recentActivity,
    loading, error,
    loadDashboard,
  }
})