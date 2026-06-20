<template>
  <div class="bg-white rounded-lg border border-slate-200 p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-slate-900">{{ title }}</h3>
      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-600">{{ percentage }}%</span>
      </div>
    </div>
    <div class="flex items-end gap-3">
      <div class="flex-1">
        <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            :style="{ width: `${percentage}%` }"
            :class="['h-full transition-all', barColor]"
          ></div>
        </div>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
        <p class="text-xs text-slate-600">points</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  percentage: number
  value: number
  barColor: string
}>()
</script>
