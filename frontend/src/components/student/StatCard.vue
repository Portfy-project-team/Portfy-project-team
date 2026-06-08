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

<style scoped>
.stat-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 28px 24px 20px;
  min-height: 145px;
  width: 100%;
}

.stat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
}

.stat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #536174;
}

.stat-square {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  display: inline-block;
}

.square-cream {
  background: #fff2d8;
}

.square-green {
  background: #cef5df;
}

.square-blue {
  background: #dff2ff;
}

.square-yellow {
  background: #fff2b8;
}

.stat-value {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  line-height: 1;
  margin-bottom: 8px;
}

.value {
  font-size: 34px;
  font-weight: 800;
  color: #050505;
}

.unit {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 4px;
}

.stat-subtitle {
  margin: 0;
  font-size: 14px;
}

.subtitle-green {
  color: #10b981;
}

.subtitle-orange {
  color: #f59e0b;
}

.subtitle-gray {
  color: #64748b;
}

@media (max-width: 768px) {
  .stat-card {
    min-height: 130px;
    padding: 22px 20px;
  }

  .value {
    font-size: 30px;
  }
}
</style>