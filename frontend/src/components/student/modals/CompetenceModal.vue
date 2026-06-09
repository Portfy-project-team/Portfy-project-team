<script setup>
import { reactive, computed } from 'vue'

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  category: '',
  level: '',
  source: ''
})

const isFormValid = computed(() => {
  return (
    form.name.trim() !== '' &&
    form.category !== '' &&
    form.level !== '' &&
    form.source.trim() !== ''
  )
})

function createCompetence() {
  if (!isFormValid.value) return

  const newSkill = {
    name: form.name,
    level: Number(form.level),
    category: form.category,
    source: form.source
  }

  emit('save', newSkill)
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card small">
      <div class="modal-header">
        <div>
          <h2>Nouvelle competence</h2>
          <p>Ajoutez une competence a votre profil</p>
        </div>

        <button type="button" class="close-btn" @click="$emit('close')">
          ×
        </button>
      </div>

      <div class="form-group">
        <label>Nom de la competence</label>
        <input v-model="form.name" type="text" placeholder="Ex: React.js, Leadership" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Categorie</label>
          <select v-model="form.category">
            <option value="">Selectionner...</option>
            <option>Technique</option>
            <option>Soft Skill</option>
            <option>Langue</option>
          </select>
        </div>

        <div class="form-group">
          <label>Niveau (%)</label>
          <input v-model="form.level" type="number" min="0" max="100" placeholder="Ex: 80" />
        </div>
      </div>

      <div class="form-group">
        <label>Source / preuve</label>
        <input v-model="form.source" type="text" placeholder="Ex: Projets academiques, Certification" />
      </div>

      <div class="modal-actions">
        <button type="button" class="cancel-btn" @click="$emit('close')">
          Annuler
        </button>

        <button type="button" class="submit-btn" :disabled="!isFormValid" @click="createCompetence">
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
  max-width: 520px;
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