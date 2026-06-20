import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../authStore.js'

export const useModerationStore = defineStore('moderation', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalItems = computed(() => items.value.length)

  const urgentItems = computed(() => {
    return items.value.filter((item) => item.status === 'URGENT' || item.status === 'PENDING').length
  })

  const pendingItems = computed(() => {
    return items.value.filter((item) => item.status === 'EN ATTENTE' || item.status === 'PENDING').length
  })

  const fetchModerationItems = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/admin/moderation')
      const data = response.data

      if (!Array.isArray(data)) {
        console.error("Moderation response is not an array:", data)
        items.value = []
        return
      }

      items.value = data.map(item => ({
        id: item.id,
        type: item.type, // e.g., 'PROJET', 'COMMENTAIRE'
        title: item.title || item.content,
        author: item.authorName || 'Anonyme',
        establishment: item.establishment || 'N/A',
        flags: item.reportsCount || 0,
        reason: item.reportReason || 'Signalement automatique',
        date: item.createdAt?.split('T')[0] || 'N/A',
        status: item.status || 'PENDING'
      }))
    } catch (err) {
      console.error("Failed to fetch moderation items:", err)
      error.value = 'Erreur lors du chargement de la modération'
    } finally {
      loading.value = false
    }
  }

  const resolveModerationItem = async (id) => {
    try {
      await api.post(`/admin/moderation/${id}/resolve`)
      const item = items.value.find((i) => i.id === id)
      if (item) item.status = 'RESOLUE'
    } catch (err) {
      console.error("Failed to resolve item:", err)
      throw err
    }
  }

  const removeModerationItem = async (id) => {
    try {
      await api.delete(`/admin/moderation/${id}`)
      items.value = items.value.filter((item) => item.id !== id)
    } catch (err) {
      console.error("Failed to delete moderation item:", err)
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    totalItems,
    urgentItems,
    pendingItems,
    fetchModerationItems,
    resolveModerationItem,
    removeModerationItem
  }
})