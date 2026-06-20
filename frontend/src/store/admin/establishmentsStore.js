import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../authStore.js'

export const useEstablishmentStore = defineStore('establishment', () => {
  const establishments = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalEstablishments = computed(() => establishments.value.length)

  const activeEstablishments = computed(() => {
    return establishments.value.filter((establishment) => establishment.status === 'Actif' || establishment.status === 'ACTIVE').length
  })

  const fetchEstablishments = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/admin/establishments')
      const data = response.data

      if (!Array.isArray(data)) {
        console.error("Establishments response is not an array:", data)
        establishments.value = []
        return
      }

      establishments.value = data.map(est => ({
        id: est.id || est.name,
        code: est.code || est.name?.substring(0, 2).toUpperCase(),
        name: est.name,
        city: est.city || 'Maroc',
        status: est.status === 'ACTIVE' || est.status === 'Actif' ? 'Actif' : 'En attente',
        students: est._count?.students || 0,
        teachers: est._count?.profs || 0,
        branches: est._count?.filieres || 0,
        years: 3
      }))
    } catch (err) {
      console.error("Failed to fetch establishments:", err)
      error.value = 'Erreur lors du chargement des établissements'
    } finally {
      loading.value = false
    }
  }

  const createEstablishment = async (data) => {
    try {
      await api.post('/admin/establishments', data)
      await fetchEstablishments()
    } catch (err) {
      console.error("Failed to create establishment:", err)
      throw err
    }
  }

  const getEstablishmentById = (id) => {
    return establishments.value.find((establishment) => establishment.id?.toString() === id?.toString())
  }

  const updateEstablishment = async (id, updates) => {
    try {
      await api.patch(`/admin/establishments/${id}`, updates)
      const establishment = establishments.value.find((e) => e.id === id)
      if (establishment) {
        Object.assign(establishment, updates)
      }
    } catch (err) {
      console.error("Failed to update establishment:", err)
      throw err
    }
  }

  return {
    establishments,
    loading,
    error,
    totalEstablishments,
    activeEstablishments,
    fetchEstablishments,
    createEstablishment,
    getEstablishmentById,
    updateEstablishment
  }
})