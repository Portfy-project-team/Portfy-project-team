<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  stageToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  company: '',
  position: '',
  location: '',
  period: '',
  duration: '',
  missions: '',
  technologies: '',
  companySupervisor: '',
  academicSupervisor: '',
  reportFile: null,
  reportFileName: ''
})

const isEditMode = computed(() => props.stageToEdit !== null)

watch(
  () => props.stageToEdit,
  (stage) => {
    if (stage) {
      form.company = stage.company || ''
      form.position = stage.position || ''
      form.location = stage.location || ''
      form.period = stage.period || ''
      form.duration = stage.duration || ''
      form.missions = stage.missions ? stage.missions.join(', ') : ''
      form.technologies = stage.technologies ? stage.technologies.join(', ') : ''
      form.companySupervisor = stage.companySupervisor || ''
      form.academicSupervisor = stage.academicSupervisor || ''
    } else {
      form.company = ''
      form.position = ''
      form.location = ''
      form.period = ''
      form.duration = ''
      form.missions = ''
      form.technologies = ''
      form.companySupervisor = ''
      form.academicSupervisor = ''
    }
  },
  { immediate: true }
)

const isFormValid = computed(() => {
  return (
    form.company.trim() !== '' &&
    form.position.trim() !== '' &&
    form.location.trim() !== '' &&
    form.period.trim() !== '' &&
    form.duration.trim() !== ''
  )
})

function saveStage(status) {
  if (!isFormValid.value) return

  const stageData = {
    id: props.stageToEdit ? props.stageToEdit.id : Date.now(),
    company: form.company,
    position: form.position,
    location: form.location,
    period: form.period,
    duration: form.duration,
    status: props.stageToEdit ? props.stageToEdit.status : status,
    iconColor: props.stageToEdit ? props.stageToEdit.iconColor : 'cream',
    missions: form.missions
      ? form.missions.split(',').map((item) => item.trim())
      : [],
    technologies: form.technologies
      ? form.technologies.split(',').map((item) => item.trim())
      : [],
    companySupervisor: form.companySupervisor,
    academicSupervisor: form.academicSupervisor,
    validationMessage: props.stageToEdit ? props.stageToEdit.validationMessage : '',
    reportFileName: form.reportFileName,
    reportFile: form.reportFile
  }

  emit('save', stageData)
}
function handleReportUpload(event) {
  const file = event.target.files[0]

  if (!file) return

  const maxSize = 5 * 1024 * 1024

  if (file.size > maxSize) {
    alert('Le fichier ne doit pas depasser 5MB')
    return
  }

  if (file.type !== 'application/pdf') {
    alert('Le rapport doit etre un fichier PDF')
    return
  }

  form.reportFile = file
  form.reportFileName = file.name
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h2>{{ isEditMode ? 'Modifier le stage' : 'Ajouter un stage' }}</h2>
          <p>Ajoutez une experience professionnelle</p>
        </div>

        <button type="button" class="close-btn" @click="$emit('close')">
          ×
        </button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Organisme d'accueil</label>
          <input v-model="form.company" type="text" placeholder="Ex: OCP Group" />
        </div>

        <div class="form-group">
          <label>Poste occupe</label>
          <input v-model="form.position" type="text" placeholder="Ex: Developpeur Full Stack Stagiaire" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Ville</label>
          <input v-model="form.location" type="text" placeholder="Ex: Casablanca, Maroc" />
        </div>

        <div class="form-group">
          <label>Duree</label>
          <input v-model="form.duration" type="text" placeholder="Ex: 2 mois" />
        </div>
      </div>

      <div class="form-group">
        <label>Periode</label>
        <input v-model="form.period" type="text" placeholder="Ex: Juillet 2024 a Aout 2024" />
      </div>

      <div class="form-group">
        <label>Missions realisees</label>
        <textarea v-model="form.missions" placeholder="Ex: Developpement application, Integration API, Tests automatises"></textarea>
      </div>

      <div class="form-group">
        <label>Technologies utilisees</label>
        <input v-model="form.technologies" type="text" placeholder="Ex: React, Node.js, PostgreSQL, Docker" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Encadrant entreprise</label>
          <input v-model="form.companySupervisor" type="text" placeholder="Ex: M. Hassan Benjelloun" />
        </div>

        <div class="form-group">
          <label>Encadrant academique</label>
          <select v-model="form.academicSupervisor">
            <option value="">Selectionner...</option>
            <option>Pr. Benali</option>
            <option>Pr. Idrissi</option>
            <option>Pr. Rachid</option>
          </select>
        </div>
      </div>

<div class="form-group">
  <label>Rapport de stage</label>

  <label class="upload-box">
    <input
      type="file"
      accept="application/pdf"
      hidden
      @change="handleReportUpload"
    />

    <div class="upload-icon">↑</div>

    <strong>
      {{ form.reportFileName || 'Cliquez pour uploader' }}
    </strong>

    <span>PDF jusqu'a 5MB</span>
  </label>
</div>

      <div class="modal-actions">
  <button
    type="button"
    class="draft-btn"
    v-if="!isEditMode"
    :disabled="!isFormValid"
    @click="saveStage('Brouillon')"
  >
    Enregistrer comme brouillon
  </button>

  <button
    type="button"
    class="submit-btn"
    :disabled="!isFormValid"
    @click="saveStage('En attente')"
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

.modal-card {
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
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
  min-height: 90px;
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

.draft-btn,
.submit-btn {
  border-radius: 9px;
  padding: 13px 18px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
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

  .draft-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>