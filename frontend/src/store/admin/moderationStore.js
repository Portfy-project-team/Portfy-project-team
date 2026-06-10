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
      status: 'URGENT'
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
      status: 'EN ATTENTE'
    }
  ])

  const totalItems = computed(() => items.value.length)

  const urgentItems = computed(() => {
    return items.value.filter((item) => item.status === 'URGENT').length
  })

  const pendingItems = computed(() => {
    return items.value.filter((item) => item.status === 'EN ATTENTE').length
  })

  const resolveModerationItem = (id) => {
    const item = items.value.find((item) => item.id === id)

    if (item) {
      item.status = 'RESOLUE'
    }
  }

  const removeModerationItem = (id) => {
    items.value = items.value.filter((item) => item.id !== id)
  }

  return {
    items,
    totalItems,
    urgentItems,
    pendingItems,
    resolveModerationItem,
    removeModerationItem
  }
})