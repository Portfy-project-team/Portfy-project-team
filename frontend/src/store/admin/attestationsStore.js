import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../authStore.js'

export const useAttestationStore = defineStore('attestation', () => {
  const attestations = ref([])
  const loading = ref(false)
  const error = ref(null)

  const pendingAttestations = computed(() => {
    return attestations.value.filter((attestation) => attestation.status === 'PENDING' || attestation.status === 'A_VALIDER').length
  })

  const totalAttestations = computed(() => attestations.value.length)

  const fetchAttestations = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/admin/attestations')
      const data = response.data

      if (!Array.isArray(data)) {
        console.error("Attestations response is not an array:", data)
        attestations.value = []
        return
      }

      attestations.value = data.map(item => ({
        id: item.id,
        type: item.type || 'ACTIVITE',
        title: item.nom || item.title,
        student: item.user ? `${item.user.prenom} ${item.user.nom}` : 'Inconnu',
        establishment: item.user?.student?.etablissement || 'N/A',
        submittedDate: item.createdAt?.split('T')[0] || 'N/A',
        status: item.statutV || 'A_VALIDER',
        filePath: item.attestationUrl
      }))
    } catch (err) {
      console.error("Failed to fetch attestations:", err)
      error.value = 'Erreur lors du chargement des attestations'
    } finally {
      loading.value = false
    }
  }

  const validateAttestation = async (id) => {
    try {
      await api.post(`/admin/activities/${id}/validate`)
      const attestation = attestations.value.find((a) => a.id === id)
      if (attestation) attestation.status = 'VALIDEE'
    } catch (err) {
      console.error("Failed to validate attestation:", err)
      throw err
    }
  }

  const rejectAttestation = async (id) => {
    try {
      await api.post(`/admin/activities/${id}/reject`)
      const attestation = attestations.value.find((a) => a.id === id)
      if (attestation) attestation.status = 'REJETEE'
    } catch (err) {
      console.error("Failed to reject attestation:", err)
      throw err
    }
  }

  return {
    attestations,
    loading,
    error,
    pendingAttestations,
    totalAttestations,
    fetchAttestations,
    validateAttestation,
    rejectAttestation
  }
})