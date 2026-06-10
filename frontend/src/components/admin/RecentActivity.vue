<template>
  <div class="bg-white rounded-lg border border-slate-200 p-4 mb-3 flex items-center justify-between hover:shadow-md transition-shadow">
    <div class="flex items-center gap-3">
      <div class="text-2xl">{{ icon }}</div>
      <div>
        <p class="text-sm text-slate-600">{{ label }}</p>
        <p class="text-lg font-bold text-slate-900">{{ value }}</p>
        <p v-if="trend" :class="['text-xs', trend > 0 ? 'text-green-600' : 'text-red-600']">
          {{ trend > 0 ? '+' : '' }}{{ trend }}% vs mois précédent
        </p>
      </div>
    </div>
    <div class="text-right">
      <span v-if="status" :class="['px-3 py-1 rounded-full text-xs font-semibold', statusClass]">
        {{ status }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number | string
  icon: string
  trend?: number
  status?: string
}>()

const statusClass = computed(() => {
  const text = props.status?.toLowerCase() || ''
  if (text.includes('urgent')) return 'bg-red-100 text-red-700'
  if (text.includes('attent')) return 'bg-orange-100 text-orange-700'
  if (text.includes('valide')) return 'bg-green-100 text-green-700'
  return 'bg-slate-100 text-slate-700'
})
</script>
