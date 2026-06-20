<script setup>
import { reactive, computed } from 'vue'

const emit = defineEmits(['close', 'save'])

const form = reactive({
  professor: '',
  subject: '',
  purpose: '',
  visibility: 'Privee',
  message: ''
})

const isFormValid = computed(() => {
  return (
    form.professor.trim() !== '' &&
    form.subject.trim() !== '' &&
    form.purpose.trim() !== ''
  )
})

function saveLetterRequest() {
  if (!isFormValid.value) return

  const newLetter = {
    id: Date.now(),
    initials: form.professor
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    professor: form.professor,
    meta: 'ENSA Tanger',
    status: 'En attente',
    visibility: form.visibility,
    quote: '',
    object: form.subject,
    date: '',
    requestText: `Demande envoyee aujourd'hui - En attente de redaction`,
    avatarColor: 'yellow',
    purpose: form.purpose,
    message: form.message
  }

  emit('save', newLetter)
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h2>Demander une lettre</h2>
          <p>Envoyez une demande de recommandation a un enseignant</p>
        </div>

        <button type="button" class="close-btn" @click="$emit('close')">
          ×
        </button>
      </div>

      <div class="form-group">
        <label>Enseignant</label>
        <input
          v-model="form.professor"
          type="text"
          placeholder="Ex: Pr. Mohamed Benali"
        />
      </div>

      <div class="form-group">
        <label>Objet de la lettre</label>
        <input
          v-model="form.subject"
          type="text"
          placeholder="Ex: Candidature Master"
        />
      </div>

      <div class="form-group">
        <label>Objectif</label>
        <select v-model="form.purpose">
          <option value="">Selectionner...</option>
          <option>Candidature Master</option>
          <option>Stage</option>
          <option>Double diplomation</option>
          <option>Bourse</option>
          <option>Emploi</option>
        </select>
      </div>

      <div class="form-group">
        <label>Visibilite</label>
        <select v-model="form.visibility">
          <option>Privee</option>
          <option>Publique</option>
        </select>
      </div>

      <div class="form-group">
        <label>Message</label>
        <textarea
          v-model="form.message"
          placeholder="Expliquez rapidement pourquoi vous demandez cette lettre..."
        ></textarea>
      </div>

      <div class="modal-actions">
        <button type="button" class="cancel-btn" @click="$emit('close')">
          Annuler
        </button>

        <button
          type="button"
          class="submit-btn"
          :disabled="!isFormValid"
          @click="saveLetterRequest"
        >
          Envoyer la demande
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
  max-width: 560px;
  background: #ffffff;
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 24px 60px rgba(8, 42, 71, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
}

.modal-header p {
  margin: 0;
  color: #64748b;
}

.close-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 30px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #082a47;
  font-weight: 800;
}

input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  padding: 12px 14px;
  font-size: 15px;
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #f0a91f;
  box-shadow: 0 0 0 3px rgba(240, 169, 31, 0.18);
}

textarea {
  min-height: 90px;
  resize: vertical;
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
</style>