import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useModerationStore = defineStore('moderation', () => {
  const items = ref([
    {
      id: '1',
      type: 'PROJET',
      title: 'Projet: "API REST avec Node.js"',
      author: 'Sara Al., Karim B., Imane C.',
      establishment: 'ENSA Tanger',
      flags: 3,
      reason: 'Ce projet semble être une copie. Le code est identique à un projet partagé sur GitHub.',
      date: '2024-06-10',
      status: 'URGENT',
    },
    {
      id: '2',
      type: 'COMMENTAIRE',
      title: 'Commentaire inapproprié sur portfolio',
      author: 'Anonyme',
      establishment: 'ENSA Tanger',
      flags: 2,
      reason: 'Contenu juge offensant par plusieurs utilisateurs.',
      date: '2024-06-10',
      status: 'PENDING',
    },
  ])

  const totalItems = computed(() => items.value.length)

  const urgentItems = computed(() => {
    return items.value.filter((item) => item.status === 'URGENT').length
  })

  const pendingItems = computed(() => {
    return items.value.filter((item) => item.status === 'PENDING').length
  })

  const resolvedItems = computed(() => {
    return items.value.filter((item) => item.status === 'RESOLVED').length
  })

  const getModerationItemById = (id) => {
    return items.value.find((item) => String(item.id) === String(id))
  }

  const resolveModerationItem = (id) => {
    const item = getModerationItemById(id)

    if (item) {
      item.status = 'RESOLVED'
    }
  }

  const removeModerationItem = (id) => {
    items.value = items.value.filter((item) => String(item.id) !== String(id))
  }

  return {
    items,
    totalItems,
    urgentItems,
    pendingItems,
    resolvedItems,
    getModerationItemById,
    resolveModerationItem,
    removeModerationItem,
  }
})
