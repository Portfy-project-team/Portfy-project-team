<template>
  <div class="bg-white rounded-lg border border-slate-200 p-6 mb-4">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span v-if="type === 'DIPLOMES'" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
            DIPLÔMES
          </span>
          <span v-else-if="type === 'STAGES'" class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
            STAGES
          </span>
          <span v-else class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
            {{ type }}
          </span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">{{ title }}</h3>
        <p class="text-sm text-slate-600">
          Soumis par <strong>{{ submittedBy }}</strong> - {{ institution }} - Génie {{ field }}
        </p>
        <div class="flex items-center gap-4 mt-3 text-xs text-slate-600">
          <span>📄 {{ filename }}</span>
          <span>📅 {{ submittedDate }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          @click="$emit('validate')"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Valider
        </button>
        <button
          @click="$emit('reject')"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Refuser
        </button>
        <button
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
        >
          Voir détails
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  type: string
  submittedBy: string
  institution: string
  field: string
  filename: string
  submittedDate: string
}>()

defineEmits<{
  validate: []
  reject: []
}>()
</script>
