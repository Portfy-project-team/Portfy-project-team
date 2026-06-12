<script setup>
import { reactive, computed, watch, onMounted, ref } from 'vue'
import { api } from '@/store/authStore.js'

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
          <h2>{{ isEditMode ? 'Modifier le projet' : 'Ajouter un projet' }}</h2>
          <p>Ajoutez un projet academique ou personnel</p>
        </div>

        <button
          type="button"
          class="close-btn"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>

      <div class="form-group">
        <label>Titre du projet <span class="required">*</span></label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Ex: API REST avec Node.js"
        />
      </div>

      <div class="form-group">
        <label>Description <span class="required">*</span></label>
        <textarea
          v-model="form.description"
          placeholder="Decrivez votre projet..."
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Type de projet</label>
          <select v-model="form.type">
            <option v-for="t in projectTypes" :key="t.value" :value="t.value">
              {{ t.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Enseignant encadrant</label>
          <select v-model="form.supervisorId">
            <option value="">Optionnel...</option>
            <option v-for="p in profs" :key="p.id" :value="p.id">
              Pr. {{ p.prenom }} {{ p.nom }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Technologies utilisees</label>
        <input
          v-model="form.technologies"
          type="text"
          placeholder="Ex: React, Node.js, MongoDB"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Lien GitHub</label>
          <input
            v-model="form.github"
            type="text"
            placeholder="https://github.com/..."
          />
        </div>

        <div class="form-group">
          <label>Lien de demo</label>
          <input
            v-model="form.demo"
            type="text"
            placeholder="https://..."
          />
        </div>
      </div>

     <div class="form-group">
  <label>Captures d'ecran</label>

  <label class="upload-box">
    <input
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      hidden
      @change="handleScreenshotUpload"
    />

    <div class="upload-icon">↑</div>

    <strong>
      {{ form.screenshotFileName || 'Cliquez pour uploader' }}
    </strong>

    <span>PNG, JPG jusqu'a 5MB</span>
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
    v-if="!isEditMode || props.projectToEdit.status === 'Brouillon'" 
    type="button"
    class="draft-btn"
    :disabled="!isFormValid"
    @click="saveProject('Brouillon')"
  >
    Enregistrer comme brouillon
  </button>

  <button
    type="button"
    class="submit-btn"
    :disabled="!isFormValid"
    @click="saveProject('En attente')"
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

.project-modal {
  width: 100%;
  max-width: 580px;
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

.required { color: #ef4444; }

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
  min-height: 92px;
  resize: vertical;
}

.upload-box {
  border: 2px dashed #e5e7eb;
  border-radius: 14px;
  min-height: 110px;
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
