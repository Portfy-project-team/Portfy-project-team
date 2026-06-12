<script setup>
import { reactive, computed, watch, onMounted, ref } from 'vue'
import { api } from '@/store/authStore.js'
import { 
  X, 
  Type, 
  AlignLeft, 
  Folder, 
  User, 
  Cpu, 
  Github, 
  ExternalLink, 
  Upload,
  Check,
  Save,
  Send
} from 'lucide-vue-next'

const props = defineProps({
  projectToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const profs = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/stages/encadrants') 
    profs.value = res.data
  } catch (e) {
    console.error('Erreur profs', e)
  }
})

const form = reactive({
  title: '',
  description: '',
  type: 'PERSONNEL',
  supervisorId: '',
  technologies: '',
  github: '',
  demo: '',
  screenshotFile: null,
  screenshotFileName: ''
})

const projectTypes = [
  { label: 'Projet de module', value: 'MODULE' },
  { label: 'Projet d\'integration', value: 'INTEGRATION' },
  { label: 'Projet personnel', value: 'PERSONNEL' },
  { label: 'Projet de stage', value: 'STAGE' },
  { label: 'Hackathon', value: 'HACKATHON' }
]

const isEditMode = computed(() => props.projectToEdit !== null)

watch(
  () => props.projectToEdit,
  (project) => {
    if (project) {
      form.title = project.title || ''
      form.description = project.description || ''
      form.type = project.type || 'PERSONNEL'
      form.supervisorId = project.profId || ''
      form.technologies = project.tags ? project.tags.join(', ') : ''
      form.github = project.github || ''
      form.demo = project.demo || ''
      form.screenshotFileName = project.screenshotUrl ? 'Image existante' : ''
    } else {
      Object.assign(form, {
        title: '', description: '', type: 'PERSONNEL',
        supervisorId: '', technologies: '', github: '',
        demo: '', screenshotFile: null, screenshotFileName: ''
      })
    }
  },
  { immediate: true }
)

const isFormValid = computed(() => {
  return (
    form.title.trim() !== '' &&
    form.description.trim() !== '' &&
    form.type !== ''
  )
})

function handleScreenshotUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert('Le fichier ne doit pas depasser 5MB')
    return
  }
  form.screenshotFile = file
  form.screenshotFileName = file.name
}

function saveProject(status) {
  if (!isFormValid.value) return

  const projectData = {
    id: props.projectToEdit?.id,
    title: form.title,
    type: form.type,
    description: form.description,
    status: status, 
    tags: form.technologies
      ? form.technologies.split(',').map((tag) => tag.trim())
      : [],
    profId: form.supervisorId ? Number(form.supervisorId) : null,
    github: form.github,
    demo: form.demo,
    screenshotFile: form.screenshotFile
  }

  emit('save', projectData)
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="project-modal">
      <div class="modal-header">
        <div>
          <h2>{{ isEditMode ? 'Modifier le projet' : 'Nouveau projet' }}</h2>
          <p>Completez les informations ci-dessous pour votre projet</p>
        </div>

        <button
          type="button"
          class="close-btn"
          @click="$emit('close')"
        >
          <X size="24" />
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>
            <Type size="16" />
            Titre du projet <span class="required">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Ex: API REST avec Node.js"
          />
        </div>

        <div class="form-group">
          <label>
            <AlignLeft size="16" />
            Description <span class="required">*</span>
          </label>
          <textarea
            v-model="form.description"
            placeholder="Decrivez les objectifs, les defis et les solutions de votre projet..."
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>
              <Folder size="16" />
              Type de projet
            </label>
            <select v-model="form.type">
              <option v-for="t in projectTypes" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>
              <User size="16" />
              Enseignant encadrant
            </label>
            <select v-model="form.supervisorId">
              <option value="">Optionnel...</option>
              <option v-for="p in profs" :key="p.id" :value="p.id">
                Pr. {{ p.prenom }} {{ p.nom }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>
            <Cpu size="16" />
            Technologies utilisees
          </label>
          <input
            v-model="form.technologies"
            type="text"
            placeholder="Ex: React, Node.js, MongoDB (separes par des virgules)"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>
              <Github size="16" />
              Lien GitHub
            </label>
            <input
              v-model="form.github"
              type="url"
              placeholder="https://github.com/votre-repo"
            />
          </div>

          <div class="form-group">
            <label>
              <ExternalLink size="16" />
              Lien de demo
            </label>
            <input
              v-model="form.demo"
              type="url"
              placeholder="https://votre-demo.com"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Captures d'ecran</label>
          <label class="upload-box" :class="{ 'has-file': form.screenshotFileName }">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              hidden
              @change="handleScreenshotUpload"
            />
            <div class="upload-icon">
              <Upload size="32" v-if="!form.screenshotFileName" />
              <Check size="32" v-else />
            </div>
            <strong>
              {{ form.screenshotFileName || 'Cliquez pour uploader une image' }}
            </strong>
            <span>PNG, JPG jusqu'a 5MB</span>
          </label>
        </div>
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
          v-if="!isEditMode || props.projectToEdit.status === 'Brouillon'" 
          type="button"
          class="draft-btn"
          :disabled="!isFormValid"
          @click="saveProject('Brouillon')"
        >
          <Save size="18" />
          Brouillon
        </button>

        <button
          type="button"
          class="submit-btn"
          :disabled="!isFormValid"
          @click="saveProject('En attente')"
        >
          <Send size="18" />
          {{ isEditMode ? 'Enregistrer' : 'Soumettre' }}
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
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.project-modal {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.modal-header p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.close-btn {
  border: none;
  background: #f1f5f9;
  color: #64748b;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.modal-body {
  padding: 32px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

label svg {
  color: #0f3a4f;
}

.required { color: #ef4444; }

input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 16px;
  color: #0f172a;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  background: #ffffff;
  border-color: #0f3a4f;
  box-shadow: 0 0 0 4px rgba(15, 58, 79, 0.1);
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.upload-box {
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  background: #f8fafc;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-box:hover {
  border-color: #0f3a4f;
  background: #0f3a4f05;
}

.upload-box.has-file {
  border-color: #10b981;
  background: #10b98105;
  color: #065f46;
}

.upload-icon {
  color: #0f3a4f;
}

.upload-box.has-file .upload-icon {
  color: #10b981;
}

.modal-actions {
  padding: 24px 32px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn,
.draft-btn,
.submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #ffffff;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.draft-btn {
  background: #ffffff;
  color: #0f3a4f;
  border: 1px solid #0f3a4f;
}

.submit-btn {
  background: #0f3a4f;
  color: #ffffff;
  border: none;
}

.submit-btn:hover {
  background: #0b3558;
  transform: translateY(-1px);
}

.draft-btn:hover {
  background: #0f3a4f05;
}

.cancel-btn:hover {
  background: #f1f5f9;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

@media (max-width: 640px) {
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
    justify-content: center;
  }
}
</style>
