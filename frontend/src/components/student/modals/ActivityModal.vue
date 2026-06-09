<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  activityToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  title: '',
  role: '',
  type: '',
  organisation: '',
  periode: '',
  description: '',
  proofFile: null,
  proofFileName: ''
})

const activityTypes = [
  'Hackathon',
  'Club',
  'Evenement',
  'Competition',
  'Association'
]

const isEditMode = computed(() => props.activityToEdit !== null)

watch(
  () => props.activityToEdit,
  (activity) => {
    if (activity) {
      form.title = activity.title || ''
      form.role = activity.role || ''
      form.type = activity.type || ''
      form.organisation = activity.organisation || ''
      form.periode = activity.periode || ''
      form.description = activity.description || ''
      form.proofFile = activity.proofFile || null
      form.proofFileName = activity.proofFileName || ''
    } else {
      form.title = ''
      form.role = ''
      form.type = ''
      form.organisation = ''
      form.periode = ''
      form.description = ''
      form.proofFile = null
      form.proofFileName = ''
    }
  },
  { immediate: true }
)

const isFormValid = computed(() => {
  return (
    form.title.trim() !== '' &&
    form.role.trim() !== '' &&
    form.type !== '' &&
    form.organisation.trim() !== '' &&
    form.periode.trim() !== ''
  )
})

function getTypeClass(type) {
  if (type === 'Hackathon') return 'type-hackathon'
  if (type === 'Club') return 'type-club'
  if (type === 'Evenement') return 'type-event'
  if (type === 'Competition') return 'type-competition'
  if (type === 'Association') return 'type-association'

  return 'type-default'
}

function handleProofUpload(event) {
  const file = event.target.files[0]

  if (!file) return

  const maxSize = 5 * 1024 * 1024
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']

  if (file.size > maxSize) {
    alert('Le fichier ne doit pas depasser 5MB')
    return
  }

  if (!allowedTypes.includes(file.type)) {
    alert('Le fichier doit etre PDF, PNG ou JPG')
    return
  }

  form.proofFile = file
  form.proofFileName = file.name
}

function saveActivity(status) {
  if (!isFormValid.value) return

  const activityData = {
    id: props.activityToEdit ? props.activityToEdit.id : Date.now(),
    title: form.title,
    role: form.role,
    type: form.type,
    typeClass: getTypeClass(form.type),
    organisation: form.organisation,
    periode: form.periode,
    description: form.description,
    status: props.activityToEdit ? props.activityToEdit.status : status,
    proofFile: form.proofFile,
    proofFileName: form.proofFileName
  }

  emit('save', activityData)
}
</script>
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="activity-modal">
      <div class="modal-header">
        <div>
          <h2>{{ isEditMode ? 'Modifier activite' : 'Nouvelle activite' }}</h2>
          <p>Ajoutez un club, evenement, hackathon ou engagement associatif</p>
        </div>

        <button class="close-btn" type="button" @click="$emit('close')">
          ×
        </button>
      </div>

      <div class="form-group">
        <label>Nom de l'activite</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Ex: Hackathon UMBP 2024"
        />
      </div>

      <div class="form-group">
        <label>Role / participation</label>
        <input
          v-model="form.role"
          type="text"
          placeholder="Ex: Participant - Equipe gagnante"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Type d'activite</label>
          <select v-model="form.type">
            <option value="">Selectionner...</option>
            <option
              v-for="type in activityTypes"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Organisation</label>
          <input
            v-model="form.organisation"
            type="text"
            placeholder="Ex: ENSA Tanger"
          />
        </div>
      </div>

      <div class="form-group">
        <label>Periode</label>
        <input
          v-model="form.periode"
          type="text"
          placeholder="Ex: Mars 2024 ou 2023 - 2025"
        />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea
          v-model="form.description"
          placeholder="Decrivez votre activite..."
        ></textarea>
      </div>

 <div class="form-group">
  <label>Attestation / preuve</label>

  <label class="upload-box">
    <input
      type="file"
      accept="application/pdf, image/png, image/jpeg, image/jpg"
      hidden
      @change="handleProofUpload"
    />

    <div class="upload-icon">↑</div>

    <strong>
      {{ form.proofFileName || 'Cliquez pour uploader' }}
    </strong>

    <span>PDF, PNG, JPG jusqu'a 5MB</span>
  </label>
</div>

<div class="modal-actions">
  <button
    type="button"
    class="cancel-btn"
    @click="$emit('close')"
  >
    Annuler
  </button>

  <button
    v-if="!isEditMode"
    type="button"
    class="draft-btn"
    :disabled="!isFormValid"
    @click="saveActivity('Brouillon')"
  >
    Enregistrer brouillon
  </button>

  <button
    type="button"
    class="submit-btn"
    :disabled="!isFormValid"
    @click="saveActivity('En attente')"
  >
    {{ isEditMode ? 'Enregistrer les modifications' : 'Soumettre a validation' }}
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

.activity-modal {
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
select,
textarea {
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
select:focus,
textarea:focus {
  border-color: #f0a91f;
  box-shadow: 0 0 0 3px rgba(240, 169, 31, 0.18);
}

textarea {
  min-height: 88px;
  resize: vertical;
}

.upload-box {
  border: 2px dashed #e5e7eb;
  border-radius: 14px;
  min-height: 105px;
  background: #fafafa;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.upload-icon {
  font-size: 28px;
  color: #082a47;
}

.upload-box strong {
  color: #082a47;
  font-size: 14px;
}

.upload-box span {
  font-size: 13px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.draft-btn,
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

.draft-btn {
  background: #ffffff;
  color: #082a47;
  border: 1px solid #e5e7eb;
}

.submit-btn {
  background: #082a47;
  color: #ffffff;
  border: 1px solid #082a47;
}

.submit-btn:hover {
  background: #0b3558;
}

.draft-btn:hover {
  border-color: #f0a91f;
  color: #f59e0b;
}

.cancel-btn:hover {
  background: #f8fafc;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 650px) {
  .activity-modal {
    max-height: 90vh;
    overflow-y: auto;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .draft-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>