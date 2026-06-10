import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAttestationStore = defineStore('attestation', () => {
  const attestations = ref([
    {
      id: '1',
      type: 'STAGES',
      title: 'Attestation de stage - OCP Group',
      student: 'Ahmed Alami',
      establishment: 'ENSA Tanger',
      submittedDate: '2024-05-28',
      status: 'A_VALIDER',
      filePath: 'attestation_ocp_2024.pdf'
    },
    {
      id: '2',
      type: 'CERTIFICATIONS',
      title: 'Certification AWS Cloud Practitioner',
      student: 'Mohamed Tazi',
      establishment: 'ENSA Fes',
      submittedDate: '2024-05-27',
      status: 'A_VALIDER',
      filePath: 'aws_certification.pdf'
    },
    {
      id: '3',
      type: 'DIPLOMES',
      title: 'Diplome Bac Sciences Mathematiques',
      student: 'Sara El Amrani',
      establishment: 'ENSA Marrakech',
      submittedDate: '2024-05-25',
      status: 'A_VALIDER',
      filePath: 'diplome_bac_2024.pdf'
    }
  ])

  const pendingAttestations = computed(() => {
    return attestations.value.filter((attestation) => attestation.status === 'A_VALIDER').length
  })

  const totalAttestations = computed(() => attestations.value.length)

  const validateAttestation = (id) => {
    const attestation = attestations.value.find((attestation) => attestation.id === id)

    if (attestation) {
      attestation.status = 'VALIDEE'
    }
  }

  const rejectAttestation = (id) => {
    const attestation = attestations.value.find((attestation) => attestation.id === id)

    if (attestation) {
      attestation.status = 'REJETEE'
    }
  }

  return {
    attestations,
    pendingAttestations,
    totalAttestations,
    validateAttestation,
    rejectAttestation
  }
})