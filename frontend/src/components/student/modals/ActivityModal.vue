<script setup>
import { reactive, computed, watch } from 'vue'
import { 
  X, 
  Award, 
  Tag, 
  Building2, 
  AlignLeft, 
  Type, 
  Calendar, 
  Upload, 
  Check,
  Save,
  Plus
} from 'lucide-vue-next'

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
        <button type="button" class="close-btn" @click="$emit('close')">
          <X size="24" />
        </button>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label>
            <Award size="16" />
            Nom de l'activité <span class="required">*</span>
          </label>
          <input v-model="form.title" type="text" placeholder="Ex: Club IT, Hackathon 2024..." />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>
              <Tag size="16" />
              Type <span class="required">*</span>
            </label>
            <select v-model="form.type">
              <option value="">Sélectionner...</option>
              <option v-for="t in activityTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              <Building2 size="16" />
              Organisation
            </label>
            <input v-model="form.organisation" type="text" placeholder="Ex: ENSA, Association X..." />
          </div>
        </div>

        <div class="form-group">
          <label>
            <Type size="16" />
            Rôle / Titre
          </label>
          <input v-model="form.role" type="text" placeholder="Ex: Président, Membre actif, Participant..." />
        </div>

        <div class="form-group">
          <label>
            <AlignLeft size="16" />
            Description des réalisations
          </label>
          <textarea v-model="form.description" placeholder="Décrivez brièvement ce que vous avez accompli..."></textarea>
        </div>

        <div class="form-group">
          <label>
            <Calendar size="16" />
            Période
          </label>
          <input v-model="form.periode" type="text" placeholder="Ex: 2023 - 2024 ou Été 2024" />
        </div>

        <div class="form-group">
          <label>Attestation de participation</label>
          <label class="upload-area" :class="{ 'has-file': form.proofFileName }">
            <input type="file" accept="image/*,application/pdf" hidden @change="handleProofUpload" />
            <div class="upload-icon">
              <Upload size="24" v-if="!form.proofFileName" />
              <Check size="24" v-else />
            </div>
            <div class="upload-text">
              <strong>{{ form.proofFileName || 'Choisir un fichier (PDF ou Image)' }}</strong>
              <span>Taille maximale : 5 Mo</span>
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
          <Save size="18" v-if="isEditMode" />
          <Plus size="18" v-else />
          {{ isEditMode ? 'Enregistrer' : 'Ajouter' }}
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 24px;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 24px 32px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}

.modal-header h2 { 
  margin: 0; 
  font-size: 24px; 
  color: #0f172a; 
  font-weight: 800; 
}

.modal-header p { 
  margin: 4px 0 0; 
  color: #64748b; 
  font-size: 15px; 
}

.close-btn { 
  background: #f1f5f9; 
  border: none; 
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #64748b; 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.form-body { 
  padding: 32px; 
  overflow-y: auto;
  flex: 1;
}

.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

label { 
  display: flex; 
  align-items: center;
  gap: 8px;
  margin-bottom: 8px; 
  font-weight: 700; 
  color: #334155; 
  font-size: 14px; 
}

label svg {
  color: #0f3a4f;
}

.required { color: #ef4444; }

input, select, textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s;
}

input:focus, select:focus, textarea:focus {
  background: #ffffff;
  border-color: #0f3a4f;
  box-shadow: 0 0 0 4px rgba(15, 58, 79, 0.1);
  outline: none;
}

textarea { height: 100px; resize: vertical; min-height: 80px; }

.upload-area {
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  background: #f8fafc;
  transition: all 0.2s;
}

.upload-area:hover { 
  background: #f1f5f9; 
  border-color: #0f3a4f; 
}

.upload-area.has-file {
  border-color: #10b981;
  background: #f0fdf4;
}

.upload-icon { 
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f3a4f;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.upload-area.has-file .upload-icon {
  color: #10b981;
}

.upload-text { display: flex; flex-direction: column; }
.upload-text strong { font-size: 14px; color: #0f172a; }
.upload-text span { font-size: 12px; color: #64748b; }

.modal-footer {
  padding: 24px 32px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.btn-cancel, .btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-cancel:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.btn-save {
  background: #0f3a4f;
  color: white;
  border: none;
}

.btn-save:hover {
  background: #0b3558;
  transform: translateY(-1px);
}

.btn-save:disabled { 
  background: #94a3b8; 
  cursor: not-allowed; 
  transform: none;
}

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column; }
  .btn-cancel, .btn-save { width: 100%; justify-content: center; }
}
</style>

