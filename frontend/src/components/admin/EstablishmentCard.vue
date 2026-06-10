<template>
  <div class="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div :class="['w-12 h-12 rounded-full flex items-center justify-center font-bold text-white', badgeColor]">
          {{ badge }}
        </div>
        <div>
          <h3 class="font-bold text-slate-900">{{ name }}</h3>
          <p class="text-xs text-slate-600">{{ location }}</p>
        </div>
      </div>
      <span v-if="status === 'Actif'" class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
        Actif
      </span>
      <span v-else-if="status === 'En attente'" class="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
        En attente
      </span>
      <span v-else class="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
        {{ status }}
      </span>
    </div>
    <div class="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-200">
      <div>
        <p class="text-xs text-slate-600">Étudiants</p>
        <p class="text-lg font-bold text-slate-900">{{ students }}</p>
      </div>
      <div>
        <p class="text-xs text-slate-600">Profs</p>
        <p class="text-lg font-bold text-slate-900">{{ professors }}</p>
      </div>
      <div>
        <p class="text-xs text-slate-600">Filières</p>
        <p class="text-lg font-bold text-slate-900">{{ branches }}</p>
      </div>
    </div>
    <div class="mt-4 flex gap-2">
      <button class="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
        Gérer
      </button>
      <button v-if="status === 'En attente'" class="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors">
        Valider
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  badge: string
  name: string
  location: string
  students: number
  professors: number
  branches: number
  status: 'Actif' | 'En attente' | string
  badgeColor: string
}>()
</script>
