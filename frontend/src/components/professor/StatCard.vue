<template>
  <span class="badge" :class="status">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ status: String })
const label = computed(() => ({
  published: 'Publiée',
  pending: 'En attente',
  validated: 'Validé',
}[props.status] || props.status))
</script>

<style scoped>
.badge { 
  font-size: 0.7rem;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.published { 
  background: #dcfce7;
  color: #16a34a; 
}

.pending { 
  background: #fef9c3;
  color: #92400e;
 }

.validated { 
  background: #dbeafe; 
  color: #1d4ed8; 
  }
  
</style>

