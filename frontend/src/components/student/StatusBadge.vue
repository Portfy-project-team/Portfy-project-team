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

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 7px 15px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

/* Valide / Certifie */
.status-valid {
  background: #d6f7e4;
  color: #078143;
}

/* En attente */
.status-pending {
  background: #fff1cc;
  color: #c77a00;
}

/* Correction */
.status-correction {
  background: #ffe0d6;
  color: #c2410c;
}

/* Brouillon */
.status-draft {
  background: #e9edf2;
  color: #4b5563;
}

/* Refuse */
.status-rejected {
  background: #fee2e2;
  color: #b91c1c;
}

/* Default */
.status-default {
  background: #eef2f7;
  color: #475569;
}
</style>