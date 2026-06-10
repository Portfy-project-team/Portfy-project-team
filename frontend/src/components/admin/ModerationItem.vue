<template>
  <div :class="['border-l-4 p-4 rounded-lg mb-3', borderClass, bgClass]">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span :class="['px-2 py-1 text-xs font-semibold rounded', badgeClass]">
            {{ type }}
          </span>
          <span class="text-xs text-slate-600">{{ timeAgo }}</span>
        </div>
        <h4 class="font-bold text-slate-900 mb-1">{{ title }}</h4>
        <p class="text-sm text-slate-700 mb-2">{{ description }}</p>
        <p class="text-xs text-slate-600">Signalé par: {{ reportedBy }}</p>
      </div>
      <div class="flex gap-2 ml-4">
        <button
          @click="$emit('remove')"
          class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
        >
          Supprimer
        </button>
        <button
          class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
        >
          Ignorer
        </button>
        <a
          :href="detailsLink"
          class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold transition-colors"
        >
          Voir projet
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'PROJET' | 'COMMENTAIRE' | 'PROFIL' | string
  title: string
  description: string
  reportedBy: string
  timeAgo: string
  detailsLink: string
}>()

defineEmits<{
  remove: []
}>()

const borderClass = computed(() => {
  const typeMap: Record<string, string> = {
    'PROJET': 'border-red-500',
    'COMMENTAIRE': 'border-orange-500',
    'PROFIL': 'border-yellow-500'
  }
  return typeMap[props.type] || 'border-slate-500'
})

const bgClass = computed(() => {
  const typeMap: Record<string, string> = {
    'PROJET': 'bg-red-50',
    'COMMENTAIRE': 'bg-orange-50',
    'PROFIL': 'bg-yellow-50'
  }
  return typeMap[props.type] || 'bg-slate-50'
})

const badgeClass = computed(() => {
  const typeMap: Record<string, string> = {
    'PROJET': 'bg-red-200 text-red-700',
    'COMMENTAIRE': 'bg-orange-200 text-orange-700',
    'PROFIL': 'bg-yellow-200 text-yellow-700'
  }
  return typeMap[props.type] || 'bg-slate-200 text-slate-700'
})
</script>
