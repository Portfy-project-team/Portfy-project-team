<script setup>
import { reactive, computed, watch } from 'vue'
import { X, Award, List, BarChart, Link } from 'lucide-vue-next'

const props = defineProps({
  skillToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  category: '',
  level: '',
  source: ''
})

const isEditMode = computed(() => props.skillToEdit !== null)

watch(
  () => props.skillToEdit,
  (skill) => {
    if (skill) {
      form.name = skill.name || ''
      // Map the frontend mapped category back to the backend enum format
      let cat = skill.category
      if (cat === 'Technique') cat = 'Technique'
      else if (cat === 'Soft Skill') cat = 'SOFT_SKILLS'
      else if (cat === 'Langue') cat = 'Langue'
      
      // If it doesn't match exactly, fallback to AUTRE or try to find a match
      if (['FRONTEND', 'BACKEND', 'DESIGN', 'MOBILE', 'DEVOPS', 'DATA', 'SOFT_SKILLS', 'LANGUE', 'AUTRE'].includes(skill.rawCategory)) {
        form.category = skill.rawCategory
      } else {
         form.category = cat === 'SOFT_SKILLS' ? 'SOFT_SKILLS' : (cat === 'Langue' ? 'LANGUE' : 'FRONTEND')
      }

      form.level = skill.niveau || ''
      form.source = skill.source || ''
    } else {
      Object.assign(form, { name: '', category: '', level: '', source: '' })
    }
  },
  { immediate: true }
)

const isFormValid = computed(() => {
  return (
    form.name.trim() !== '' &&
    form.category !== '' &&
    form.level !== '' &&
    form.source.trim() !== ''
  )
})

function saveCompetence() {
  if (!isFormValid.value) return

  const skillData = {
    id: props.skillToEdit?.skillId,
    name: form.name,
    niveau: form.level,
    category: form.category,
    source: form.source
  }

  emit('save', skillData)
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card small">
      <div class="modal-header">
        <div>
          <h2>{{ isEditMode ? 'Modifier la compétence' : 'Nouvelle compétence' }}</h2>
          <p>{{ isEditMode ? 'Mettez à jour les informations de cette compétence' : 'Ajoutez une compétence à votre profil' }}</p>
        </div>

        <button type="button" class="close-btn" @click="$emit('close')">
          <X size="24" />
        </button>
      </div>

      <div class="form-group">
        <label>
          <Award size="16" />
          Nom de la compétence
        </label>
        <input 
          v-model="form.name" 
          type="text" 
          placeholder="Ex: React.js, Leadership" 
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>
            <List size="16" />
            Catégorie
          </label>
          <select v-model="form.category">
            <option value="">Sélectionner...</option>
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="DESIGN">Design / UI-UX</option>
            <option value="MOBILE">Mobile</option>
            <option value="DEVOPS">DevOps / Cloud</option>
            <option value="DATA">Data Science / IA</option>
            <option value="SOFT_SKILLS">Soft Skills</option>
            <option value="LANGUE">Langues</option>
            <option value="AUTRE">Autre</option>
          </select>
        </div>

        <div class="form-group">
          <label>
            <BarChart size="16" />
            Niveau
          </label>
          <select v-model="form.level">
            <option value="">Sélectionner...</option>
            <option value="DEBUTANT">Débutant</option>
            <option value="INTERMEDIAIRE">Intermédiaire</option>
            <option value="AVANCE">Avancé</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>
          <Link size="16" />
          Source / preuve
        </label>
        <input v-model="form.source" type="text" placeholder="Ex: Projets académiques, Certification" />
      </div>

      <div class="modal-actions">
        <button type="button" class="cancel-btn" @click="$emit('close')">
          Annuler
        </button>

        <button type="button" class="submit-btn" :disabled="!isFormValid" @click="saveCompetence">
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
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0 0 6px;
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

.form-group {
  margin-bottom: 20px;
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
  margin-bottom: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

label svg {
  color: #0f3a4f;
}

input,
select {
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
select:focus {
  background: #ffffff;
  border-color: #0f3a4f;
  box-shadow: 0 0 0 4px rgba(15, 58, 79, 0.1);
}

input:disabled,
select:disabled {
  background: #e2e8f0;
  cursor: not-allowed;
  opacity: 0.7;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.cancel-btn,
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

.submit-btn {
  background: #0f3a4f;
  color: #ffffff;
  border: none;
}

.submit-btn:hover {
  background: #0b3558;
  transform: translateY(-1px);
}

.cancel-btn:hover {
  background: #f1f5f9;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
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
    justify-content: center;
  }
}
</style>