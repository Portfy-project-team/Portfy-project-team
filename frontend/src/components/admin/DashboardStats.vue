<template>
  <div class="grid grid-cols-4 gap-4 mb-6">
    <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
      <p class="text-sm text-slate-600 mb-2">Utilisateurs totaux</p>
      <p class="text-3xl font-bold text-slate-900 mb-1">{{ totalUsers }}</p>
      <p class="text-xs text-green-600">+12% ce mois</p>
    </div>
    <div class="bg-orange-50 rounded-lg border border-orange-200 p-4">
      <p class="text-sm text-slate-600 mb-2">En attente</p>
      <p class="text-3xl font-bold text-slate-900 mb-1">{{ pending }}</p>
      <p class="text-xs text-orange-600">À valider</p>
    </div>
    <div class="bg-green-50 rounded-lg border border-green-200 p-4">
      <p class="text-sm text-slate-600 mb-2">Établissements</p>
      <p class="text-3xl font-bold text-slate-900 mb-1">{{ establishments }}</p>
      <p class="text-xs text-slate-600">Écoles inscrites</p>
    </div>
    <div class="bg-red-50 rounded-lg border border-red-200 p-4">
      <p class="text-sm text-slate-600 mb-2">Signalements</p>
      <p class="text-3xl font-bold text-slate-900 mb-1">{{ reports }}</p>
      <p class="text-xs text-red-600">Urgents</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalUsers: number
  pending: number
  establishments: number
  reports: number
}>()
</script>
