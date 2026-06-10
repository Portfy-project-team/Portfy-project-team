import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEstablishmentStore = defineStore('establishment', () => {
  const establishments = ref([
    {
      id: '1',
      code: 'ET',
      name: 'ENSA Tanger',
      city: 'Tanger, Maroc',
      status: 'Actif',
      students: 412,
      teachers: 38,
      branches: 6,
      years: 3
    },
    {
      id: '2',
      code: 'EF',
      name: 'ENSA Fes',
      city: 'Fes, Maroc',
      status: 'Actif',
      students: 298,
      teachers: 24,
      branches: 5,
      years: 3
    },
    {
      id: '3',
      code: 'EM',
      name: 'ENSA Marrakech',
      city: 'Marrakech, Maroc',
      status: 'Actif',
      students: 187,
      teachers: 15,
      branches: 4,
      years: 3
    },
    {
      id: '4',
      code: 'FS',
      name: 'FST Tanger',
      city: 'Tanger, Maroc',
      status: 'En attente',
      students: 156,
      teachers: 12,
      branches: 3,
      years: 3
    },
    {
      id: '5',
      code: 'EC',
      name: 'ENCG Casablanca',
      city: 'Casablanca, Maroc',
      status: 'Actif',
      students: 94,
      teachers: 9,
      branches: 3,
      years: 3
    },
    {
      id: '6',
      code: 'UR',
      name: 'Universite Rabat',
      city: 'Rabat, Maroc',
      status: 'Actif',
      students: 75,
      teachers: 7,
      branches: 2,
      years: 3
    }
  ])

  const totalEstablishments = computed(() => establishments.value.length)

  const activeEstablishments = computed(() => {
    return establishments.value.filter((establishment) => establishment.status === 'Actif').length
  })

  const getEstablishmentById = (id) => {
    return establishments.value.find((establishment) => establishment.id === id)
  }

  const updateEstablishment = (id, updates) => {
    const establishment = establishments.value.find((establishment) => establishment.id === id)

    if (establishment) {
      Object.assign(establishment, updates)
    }
  }

  return {
    establishments,
    totalEstablishments,
    activeEstablishments,
    getEstablishmentById,
    updateEstablishment
  }
})