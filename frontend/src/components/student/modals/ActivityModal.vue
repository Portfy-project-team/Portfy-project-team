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
  'Compétition',
  'Association'
]

const isEditMode = computed(() => props.activityToEdit !== null)

watch(
  () => props.activityToEdit,
  (activity) => {
    if (activity) {
      form.title = activity.nom || activity.title || ''
      form.role = activity.description || activity.role || ''
      form.type = activity.type || ''
      form.organisation = activity.organisation || ''
      form.periode = activity.periode || ''
      form.description = activity.description || ''
      form.proofFile = null
      form.proofFileName = activity.attestationUrl ? 'Fichier existant' : ''
    } else {
      Object.assign(form, {
        title: '', role: '', type: '', organisation: '',
        periode: '', description: '', proofFile: null, proofFileName: ''
      })
    }
  },
  { immediate: true }
)

const isFormValid = computed(() => {
  return (
    form.title.trim().length >= 3 &&
    form.type !== ''
  )
})

function handleProofUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert('Le fichier ne doit pas depasser 5MB')
    return
  }
  form.proofFile = file
  form.proofFileName = file.name
}

function submitForm(status) {
  if (!isFormValid.value) return

  const activityData = {
    id: props.activityToEdit?.id,
    nom: form.title,
    description: form.role || form.description,
    type: form.type,
    organisation: form.organisation,
    periode: form.periode,
    status: status
  }

  emit('save', activityData)
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h2>{{ isEditMode ? 'Modifier l\'activité' : 'Nouvelle activité' }}</h2>
          <p>Valorisez vos engagements parascolaires</p>
        </div>
        <button type="button" class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label>Nom de l'activité <span class="required">*</span></label>
          <input v-model="form.title" type="text" placeholder="Ex: Club IT, Hackathon 2024..." />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Type <span class="required">*</span></label>
            <select v-model="form.type">
              <option value="">Sélectionner...</option>
              <option v-for="t in activityTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Organisation</label>
            <input v-model="form.organisation" type="text" placeholder="Ex: ENSA, Association X..." />
          </div>
        </div>

        <div class="form-group">
          <label>Rôle / Description courte</label>
          <input v-model="form.role" type="text" placeholder="Ex: Président, Membre actif, Participant..." />
        </div>

        <div class="form-group">
          <label>Détails supplémentaires</label>
          <textarea v-model="form.description" placeholder="Décrivez vos réalisations..."></textarea>
        </div>

        <div class="form-group">
          <label>Attestation (PDF/Image)</label>
          <label class="upload-area">
            <input type="file" hidden @change="handleProofUpload" />
            <div class="upload-icon">📁</div>
            <div class="upload-text">
              <strong>{{ form.proofFileName || 'Cliquez pour choisir un fichier' }}</strong>
              <span>Max 5Mo</span>
            </div>
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="$emit('close')">Annuler</button>
        <button 
          type="button" 
          class="btn-save" 
          :disabled="!isFormValid"
          @click="submitForm(isEditMode ? props.activityToEdit.status : 'En attente')"
        >
          {{ isEditMode ? 'Enregistrer les modifications' : 'Ajouter l\'activité' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 58, 79, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  overflow: hidden;
}

.modal-header {
  padding: 25px 30px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-header h2 { margin: 0; font-size: 22px; color: #0f3a4f; font-weight: 800; }
.modal-header p { margin: 5px 0 0; color: #64748b; font-size: 14px; }

.close-btn { background: none; border: none; font-size: 28px; color: #94a3b8; cursor: pointer; }

.form-body { padding: 30px; }

.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

label { display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 14px; }
.required { color: #ef4444; }

input, select, textarea {
  width: 100%;
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 15px;
  transition: all 0.2s;
}

input:focus, select:focus, textarea:focus {
  border-color: #0f3a4f;
  box-shadow: 0 0 0 3px rgba(15, 58, 79, 0.1);
  outline: none;
}

textarea { height: 100px; resize: none; }

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  background: #f8fafc;
}

.upload-area:hover { background: #f1f5f9; border-color: #0f3a4f; }

.upload-icon { font-size: 30px; }
.upload-text { display: flex; flex-direction: column; }
.upload-text strong { font-size: 14px; color: #0f3a4f; }
.upload-text span { font-size: 12px; color: #64748b; }

.modal-footer {
  padding: 20px 30px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn-cancel {
  padding: 12px 25px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
}

.btn-save {
  padding: 12px 30px;
  background: #0f3a4f;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.btn-save:disabled { background: #94a3b8; cursor: not-allowed; }
</style>
