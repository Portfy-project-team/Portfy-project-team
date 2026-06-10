<template>
  <div class="bg-white rounded-lg border border-slate-200 p-4 mb-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-700">
          {{ badge }}
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">{{ name }}</h4>
          <p class="text-xs text-slate-600">{{ description }}</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="isActive" class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
          Actif
        </span>
        <span v-else class="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
          Inactif
        </span>
        <button
          @click="toggleActive"
          :class="[
            'w-12 h-6 rounded-full transition-colors relative',
            isActive ? 'bg-green-500' : 'bg-slate-300'
          ]"
        >
          <div
            :class="[
              'w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5',
              isActive ? 'translate-x-6' : 'translate-x-0.5'
            ]"
          ></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  badge: string
  name: string
  description: string
  isActive?: boolean
}>()

const isActive = ref(props.isActive ?? true)

const toggleActive = () => {
  isActive.value = !isActive.value
}
</script>
