<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Projets'
  },
  value: {
    type: [String, Number],
    default: 0
  },
  unit: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'cream'
  },
  subtitleColor: {
    type: String,
    default: 'gray'
  }
})

const squareClass = computed(() => `square-${props.color}`)
const subtitleClass = computed(() => `subtitle-${props.subtitleColor}`)
</script>

<template>
  <div class="stat-card">
    <div class="stat-header">
      <h3>{{ title }}</h3>
      <span :class="['stat-square', squareClass]"></span>
    </div>

    <div class="stat-value">
      <span class="value">{{ value }}</span>
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>

    <p :class="['stat-subtitle', subtitleClass]">
      {{ subtitle }}
    </p>
  </div>
</template>

