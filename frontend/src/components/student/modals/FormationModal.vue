<script setup>
import { reactive, computed } from 'vue'

const emit = defineEmits(['close', 'save'])

const form = reactive({
  title: '',
  provider: '',
  type: '',
  date: '',
  progress: '',
  tags: '',
  certificateLink: ''
})

const isFormValid = computed(() => {
  return (
    form.title.trim() !== '' &&
    form.provider.trim() !== '' &&
    form.type !== '' &&
    form.progress !== ''
  )
})

function createFormation(status) {
  if (!isFormValid.value) return

  const newFormation = {
    id: Date.now(),
    title: form.title,
    provider: form.provider,
    status,
    iconColor: 'cream',
    progress: Number(form.progress),
    progressColor: Number(form.progress) === 100 ? 'green' : 'purple-orange',
    label: form.type,
    date: form.date || 'En cours',
    tags: form.tags ? form.tags.split(',').map((tag) => tag.trim()) : [],
    links: form.certificateLink ? ['Certificat', 'Voir'] : ['Voir']
  }

  emit('save', newFormation)
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h2>Ajouter une formation</h2>
          <p>Ajoutez une certification, MOOC ou formation continue</p>
        </div>

        <button type="button" class="close-btn" @click="$emit('close')">
          ×
        </button>
      </div>

      <div class="form-group">
        <label>Titre de la formation</label>
        <input v-model="form.title" type="text" placeholder="Ex: AWS Cloud Practitioner" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Fournisseur</label>
          <input v-model="form.provider" type="text" placeholder="Ex: Coursera, Udemy, AWS" />
        </div>

        <div class="form-group">
          <label>Type</label>
          <select v-model="form.type">
            <option value="">Selectionner...</option>
            <option>Certification</option>
            <option>MOOC</option>
            <option>Formation</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Date d'obtention / progression</label>
          <input v-model="form.date" type="text" placeholder="Ex: Janvier 2025 ou En cours" />
        </div>

        <div class="form-group">
          <label>Progression (%)</label>
          <input v-model="form.progress" type="number" min="0" max="100" placeholder="Ex: 100" />
        </div>
      </div>

      <div class="form-group">
        <label>Competences acquises</label>
        <input v-model="form.tags" type="text" placeholder="Ex: React, Cloud, DevOps" />
      </div>

      <div class="form-group">
        <label>Lien du certificat</label>
        <input v-model="form.certificateLink" type="text" placeholder="https://..." />
      </div>

      <div class="modal-actions">
        <button type="button" class="cancel-btn" @click="$emit('close')">
          Annuler
        </button>

        <button type="button" class="submit-btn" :disabled="!isFormValid" @click="createFormation('Certifie')">
          Ajouter
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 42, 71, 0.62);
  backdrop-filter: blur(2px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 24px 60px rgba(8, 42, 71, 0.25);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  color: #050505;
}

.modal-header p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.close-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 30px;
  cursor: pointer;
  line-height: 1;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #082a47;
  font-size: 14px;
  font-weight: 800;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 9px;
  padding: 12px 14px;
  color: #050505;
  font-size: 15px;
  outline: none;
}

input:focus,
select:focus {
  border-color: #f0a91f;
  box-shadow: 0 0 0 3px rgba(240, 169, 31, 0.18);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.submit-btn {
  border-radius: 9px;
  padding: 13px 18px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.cancel-btn {
  background: #ffffff;
  color: #64748b;
  border: 1px solid #e5e7eb;
}

.submit-btn {
  background: #082a47;
  color: #ffffff;
  border: 1px solid #082a47;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 650px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>