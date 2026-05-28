<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'Valide'
  }
})

const badgeClass = computed(() => {
  const status = props.status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (status.includes('valide')) return 'status-valid'
  if (status.includes('certifie')) return 'status-valid'
  if (status.includes('attente')) return 'status-pending'
  if (status.includes('correction')) return 'status-correction'
  if (status.includes('brouillon')) return 'status-draft'
  if (status.includes('refuse')) return 'status-rejected'
  if (status.includes('verifie')) return 'status-valid'

  return 'status-default'
})
</script>

<template>
  <span :class="['status-badge', badgeClass]">
    {{ status }}
  </span>
</template>

