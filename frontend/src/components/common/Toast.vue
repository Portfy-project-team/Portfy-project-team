<script setup>
import { ref, onMounted } from 'vue'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-vue-next'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success' // success, error, warning, info
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])
const visible = ref(true)

function close() {
  visible.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" :class="['toast-notification', type]">
      <div class="toast-icon">
        <CheckCircle v-if="type === 'success'" size="20" />
        <XCircle v-if="type === 'error'" size="20" />
        <AlertCircle v-if="type === 'warning'" size="20" />
        <Info v-if="type === 'info'" size="20" />
      </div>
      
      <div class="toast-content">
        {{ message }}
      </div>

      <button class="toast-close" @click="close">
        <X size="16" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-notification {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  min-width: 280px;
  max-width: 400px;
  border-left: 4px solid #e2e8f0;
}

.toast-notification.success {
  border-left-color: #10b981;
  background: #f0fdf4;
  color: #065f46;
}

.toast-notification.error {
  border-left-color: #ef4444;
  background: #fef2f2;
  color: #991b1b;
}

.toast-notification.warning {
  border-left-color: #f59e0b;
  background: #fffbeb;
  color: #92400e;
}

.toast-notification.info {
  border-left-color: #3b82f6;
  background: #eff6ff;
  color: #1e40af;
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-content {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.toast-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.toast-close:hover {
  opacity: 1;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
