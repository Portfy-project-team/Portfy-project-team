<script setup>
import { AlertTriangle, X } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: 'Voulez-vous vraiment effectuer cette action ?'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  type: {
    type: String,
    default: 'danger' // danger, warning, info
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="confirm-modal">
      <div class="modal-header">
        <div :class="['icon-box', type]">
          <AlertTriangle size="24" />
        </div>
        <button class="close-btn" @click="$emit('cancel')">
          <X size="20" />
        </button>
      </div>

      <div class="modal-content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="$emit('cancel')">
          {{ cancelText }}
        </button>
        <button :class="['confirm-btn', type]" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.confirm-modal {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.danger {
  background: #fef2f2;
  color: #ef4444;
}

.icon-box.warning {
  background: #fffbeb;
  color: #f59e0b;
}

.icon-box.info {
  background: #eff6ff;
  color: #3b82f6;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.modal-content p {
  font-size: 15px;
  color: #64748b;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.cancel-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.confirm-btn {
  border: none;
  color: #ffffff;
}

.confirm-btn.danger {
  background: #ef4444;
}

.confirm-btn.danger:hover {
  background: #dc2626;
}

.confirm-btn.warning {
  background: #f59e0b;
}

.confirm-btn.warning:hover {
  background: #d97706;
}

.confirm-btn.info {
  background: #3b82f6;
}

.confirm-btn.info:hover {
  background: #2563eb;
}
</style>
