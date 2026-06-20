<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Plus, Edit3, Trash2 } from 'lucide-vue-next'
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import CompetenceModal from '../../components/student/modals/CompetenceModal.vue'
import Toast from '../../components/common/Toast.vue'
import ConfirmModal from '../../components/common/ConfirmModal.vue'
import { api } from '@/store/authStore.js'

// --- État ---
const activeFilter = ref('Toutes')
const searchQuery = ref('')
const filters = ['Toutes', 'Technique', 'Soft Skill', 'Langue', 'Autre']
const displayLimit = ref(10)
const isLoading = ref(true)
const notifications = ref([])
const showCompetenceModal = ref(false)
const showConfirmModal = ref(false)
const skillToDelete = ref(null)
const selectedSkill = ref(null)

const competenceGroupList = reactive({
  'Techniques': { title: 'Techniques', subtitle: 'Compétences technologiques', skills: [], color: 'purple' },
  'Soft Skills': { title: 'Soft Skills', subtitle: 'Compétences comportementales', skills: [], color: 'green' },
  'Langues': { title: 'Langues', subtitle: 'Langues maîtrisées', skills: [], color: 'orange' },
  'Autres': { title: 'Autres', subtitle: 'Autres compétences', skills: [], color: 'default' },
})

// --- Watchers ---
watch([activeFilter, searchQuery], () => {
  displayLimit.value = 10
})

// --- Helpers ---
function showNotification(message, type = 'success') {
  const id = Date.now()
  notifications.value.push({ id, message, type })
}

function removeNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function normalizeText(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const niveauToLevel = {
  DEBUTANT: 25,
  INTERMEDIAIRE: 50,
  AVANCE: 75,
  EXPERT: 100,
}

const getCategoryLabel = (categorie) => {
  if (['FRONTEND', 'BACKEND', 'DESIGN', 'MOBILE', 'DEVOPS', 'DATA'].includes(categorie)) return 'Technique'
  if (categorie === 'SOFT_SKILLS') return 'Soft Skill'
  if (categorie === 'LANGUE') return 'Langue'
  return 'Autre'
}

const getCategoryGroup = (categorie) => {
  if (['FRONTEND', 'BACKEND', 'DESIGN', 'MOBILE', 'DEVOPS', 'DATA'].includes(categorie)) return 'Techniques'
  if (categorie === 'SOFT_SKILLS') return 'Soft Skills'
  if (categorie === 'LANGUE') return 'Langues'
  return 'Autres'
}

// --- Computed ---
const allCompetences = computed(() => {
  return Object.values(competenceGroupList).flatMap((group) => group.skills)
})

const filteredCompetences = computed(() => {
  let list = allCompetences.value
  if (activeFilter.value !== 'Toutes') {
    list = list.filter((s) => s.category === activeFilter.value)
  }
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = normalizeText(searchQuery.value.trim())
    list = list.filter((s) => normalizeText(s.name).includes(q))
  }
  return list
})

const filteredGroupList = computed(() => {
  const filtered = {}
  Object.keys(competenceGroupList).forEach(key => {
    const group = competenceGroupList[key]
    let skills = group.skills
    
    if (activeFilter.value !== 'Toutes') {
      skills = skills.filter((s) => s.category === activeFilter.value)
    }
    if (searchQuery.value && searchQuery.value.trim() !== '') {
      const q = normalizeText(searchQuery.value.trim())
      skills = skills.filter((s) => normalizeText(s.name).includes(q))
    }
    
    if (skills.length > 0 || (searchQuery.value.trim() === '' && activeFilter.value === 'Toutes')) {
      filtered[key] = { ...group, skills }
    }
  })
  return filtered
})

const displayedCompetences = computed(() => {
  return filteredCompetences.value.slice(0, displayLimit.value)
})

// --- Méthodes UI ---
function getCategoryClass(category) {
  if (category === 'Technique') return 'category-technique'
  if (category === 'Soft Skill') return 'category-soft'
  if (category === 'Langue') return 'category-langue'
  return 'category-default'
}

function getProgressClass(category) {
  if (category === 'Technique') return 'progress-purple'
  if (category === 'Soft Skill') return 'progress-green'
  if (category === 'Langue') return 'progress-orange'
  return 'progress-purple'
}

function openAddSkill() {
  selectedSkill.value = null
  showCompetenceModal.value = true
}

function openEditSkill(skill) {
  selectedSkill.value = skill
  showCompetenceModal.value = true
}

// --- API ---
async function loadSkills() {
  isLoading.value = true
  try {
    const { data } = await api.get('/skills/me')
    const skills = data.skills || []

    Object.keys(competenceGroupList).forEach(key => {
      competenceGroupList[key].skills = []
    })

    skills.forEach((s) => {
      const level = niveauToLevel[s.niveau] || 50
      const rawCategory = s.skill.categorie
      const category = getCategoryLabel(rawCategory)
      const group = getCategoryGroup(rawCategory)

      if (competenceGroupList[group]) {
        competenceGroupList[group].skills.push({
          name: s.skill.nom,
          level,
          category,
          rawCategory,
          source: 'Portfolio',
          skillId: s.skillId,
          niveau: s.niveau,
        })
      }
    })
  } catch (err) {
    showNotification('Erreur lors du chargement des compétences', 'error')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function saveCompetence(skillData) {
  try {
    if (selectedSkill.value) {
      await api.put(`/skills/me/${selectedSkill.value.skillId}`, {
        nom: skillData.name,
        categorie: skillData.category,
        niveau: skillData.niveau || 'DEBUTANT',
      })
      showNotification('Compétence mise à jour avec succès !')
    } else {
      await api.post('/skills/me', {
        nom: skillData.name,
        categorie: skillData.category,
        niveau: skillData.niveau || 'DEBUTANT',
      })
      showNotification('Compétence ajoutée avec succès !')
    }
    await loadSkills()
    showCompetenceModal.value = false
  } catch (err) {
    showNotification(err?.response?.data?.message || "Erreur lors de l'enregistrement", 'error')
    console.error(err)
  }
}

function confirmDelete(skillId) {
  skillToDelete.value = skillId
  showConfirmModal.value = true
}

async function deleteCompetence() {
  if (!skillToDelete.value) return
  try {
    await api.delete(`/skills/me/${skillToDelete.value}`)
    await loadSkills()
    showNotification('Compétence supprimée avec succès')
  } catch (err) {
    showNotification(err?.response?.data?.message || 'Erreur lors de la suppression', 'error')
    console.error(err)
  } finally {
    showConfirmModal.value = false
    skillToDelete.value = null
  }
}

onMounted(() => {
  loadSkills()
})
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar 
        title="Competences" 
        search-placeholder="Rechercher par nom de compétence..."
        disable-global-search
        @search="searchQuery = $event"
      />

      <main class="competences-page">
        <section class="page-header">
          <div>
            <h2>Mes competences</h2>
            <p>Competences techniques, soft skills et langues</p>
          </div>

          <button class="primary-btn" @click="openAddSkill">
            <Plus size="20" style="margin-right: 8px;" />
            Ajouter une competence
          </button>
        </section>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          Chargement de vos compétences...
        </div>

        <template v-else>
          <section class="groups-grid">
            <article
              v-for="(group, key) in filteredGroupList"
              :key="key"
              class="group-card"
            >
              <h3>{{ group.title }}</h3>
              <p class="group-subtitle">{{ group.subtitle }}</p>

              <div class="skills-list">
                <div
                  v-for="skill in group.skills"
                  :key="skill.name"
                  class="skill-item"
                >
                  <div class="skill-header">
                    <span>{{ skill.name }}</span>
                    <strong>{{ skill.level }}%</strong>
                  </div>

                  <div class="progress-bar">
                    <span
                      :class="`progress-${group.color}`"
                      :style="{ width: skill.level + '%' }"
                    ></span>
                  </div>
                </div>

                <div v-if="group.skills.length === 0" class="empty-message">
                  Aucune compétence trouvée
                </div>
              </div>
            </article>
          </section>

          <section class="table-card">
            <div class="filters">
              <button
                v-for="filter in filters"
                :key="filter"
                :class="['filter-btn', { active: activeFilter === filter }]"
                @click="activeFilter = filter"
              >
                {{ filter }}
              </button>
            </div>

            <div class="table-responsive">
              <table class="competences-table">
                <thead>
                  <tr>
                    <th>COMPETENCE</th>
                    <th>CATEGORIE</th>
                    <th>NIVEAU</th>
                    <th>SOURCE</th>
                    <th class="actions-th">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="skill in displayedCompetences"
                    :key="skill.name"
                  >
                    <td class="skill-name">
                      {{ skill.name }}
                    </td>

                    <td>
                      <span :class="['category-badge', getCategoryClass(skill.category)]">
                        {{ skill.category }}
                      </span>
                    </td>

                    <td>
                      <div class="level-cell">
                        <div class="mini-progress">
                          <span
                            :class="getProgressClass(skill.category)"
                            :style="{ width: skill.level + '%' }"
                          ></span>
                        </div>
                        <span>{{ skill.level }}%</span>
                      </div>
                    </td>

                    <td>
                      <span class="source-badge">{{ skill.source }}</span>
                    </td>

                    <td class="action-cell">
                      <button
                        class="icon-btn edit-btn"
                        @click="openEditSkill(skill)"
                        title="Modifier"
                      >
                        <Edit3 size="18" />
                      </button>
                      <button
                        class="icon-btn delete-btn"
                        @click="confirmDelete(skill.skillId)"
                        title="Supprimer"
                      >
                        <Trash2 size="18" />
                      </button>
                    </td>
                  </tr>

                  <tr v-if="filteredCompetences.length === 0">
                    <td colspan="5" class="empty-table">
                      Aucune compétence trouvée pour ce filtre.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="filteredCompetences.length > displayLimit" class="load-more-container">
              <button class="load-more-btn" @click="displayLimit += 10">
                Voir plus de compétences
              </button>
            </div>
          </section>
        </template>
      </main>
    </div>

    <!-- Modals & Notifications -->
    <CompetenceModal
      v-if="showCompetenceModal"
      :skill-to-edit="selectedSkill"
      @close="showCompetenceModal = false"
      @save="saveCompetence"
    />

    <ConfirmModal
      v-if="showConfirmModal"
      title="Supprimer la compétence"
      message="Êtes-vous sûr de vouloir supprimer cette compétence de votre profil ?"
      confirm-text="Supprimer"
      type="danger"
      @confirm="deleteCompetence"
      @cancel="showConfirmModal = false"
    />

    <Toast 
      v-for="n in notifications" 
      :key="n.id" 
      :message="n.message" 
      :type="n.type" 
      @close="removeNotification(n.id)" 
    />
  </div>
</template>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f8fafc;
}

.competences-page {
  padding: 32px 40px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-header h2 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.page-header p {
  color: #64748b;
  font-size: 16px;
}

.primary-btn {
  display: flex;
  align-items: center;
  background: #0f3a4f;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(15, 58, 79, 0.2);
}

.primary-btn:hover {
  background: #0b3558;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(15, 58, 79, 0.3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #64748b;
  font-size: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #0f3a4f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.group-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  min-height: 330px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.group-card h3 {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}

.group-subtitle {
  margin: 0 0 24px;
  color: #64748b;
  font-size: 14px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  padding: 4px 0;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 15px;
}

.skill-header span {
  font-weight: 700;
  color: #0f172a;
}

.skill-header strong {
  color: #64748b;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #f1f5f9;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease-out;
}

.progress-purple { background: #6366f1; }
.progress-green { background: #10b981; }
.progress-orange { background: #f59e0b; }

.empty-message {
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  padding: 20px;
  font-style: italic;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #e2e8f0;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f8fafc;
  color: #0f172a;
}

.filter-btn.active {
  background: #0f3a4f;
  color: #ffffff;
  border-color: #0f3a4f;
}

.table-responsive {
  overflow-x: auto;
}

.competences-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.competences-table th {
  text-align: left;
  padding: 16px 12px;
  border-bottom: 2px solid #f1f5f9;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.actions-th {
  text-align: right !important;
  padding-right: 24px !important;
}

.competences-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 15px;
  vertical-align: middle;
}

.competences-table tr:hover td {
  background: #f8fafc;
}

.skill-name {
  font-weight: 700;
  color: #0f172a !important;
}

.category-badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.category-technique { background: #eef2ff; color: #4f46e5; }
.category-soft { background: #dcfce7; color: #16a34a; }
.category-langue { background: #fef3c7; color: #d97706; }
.category-default { background: #f1f5f9; color: #475569; }

.level-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.level-select {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}

.level-select:focus {
  border-color: #0f3a4f;
  box-shadow: 0 0 0 2px rgba(15, 58, 79, 0.1);
}

.mini-progress {
  width: 80px;
  height: 6px;
  border-radius: 999px;
  background: #f1f5f9;
  overflow: hidden;
}

.mini-progress span {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.source-badge {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
}

.action-cell {
  text-align: right;
  padding-right: 24px !important;
}

.icon-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fca5a5;
}

.empty-table {
  text-align: center;
  padding: 40px !important;
  color: #94a3b8 !important;
  font-style: italic;
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding-top: 24px;
}

.load-more-btn {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 8px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

@media (max-width: 1200px) {
  .groups-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .groups-grid {
    grid-template-columns: 1fr;
  }
  
  .competences-page {
    padding: 24px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .primary-btn {
    justify-content: center;
  }
}
</style>