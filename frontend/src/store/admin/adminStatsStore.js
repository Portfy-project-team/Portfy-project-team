import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../authStore.js'

export const useAdminStatsStore = defineStore('adminStats', () => {
  const stats = ref([])
  const branches = ref([])
  const loading = ref(false)

  const fetchStats = async () => {
    loading.value = true
    try {
      const response = await api.get('/admin/platform-stats')
      stats.value = response.data.stats
      branches.value = response.data.branches
    } catch (err) {
      console.error("Failed to fetch platform stats:", err)
    } finally {
      loading.value = false
    }
  }

  return { stats, branches, loading, fetchStats }
})