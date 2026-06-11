<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import CompetenceModal from '../../components/student/modals/CompetenceModal.vue'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const activeFilter = ref('Toutes')
const filters = ['Toutes', 'Technique', 'Soft Skill', 'Langue']

const competenceGroupList = reactive({
  'Techniques': { title: 'Techniques', subtitle: 'Compétences technologiques', skills: [], color: 'purple' },
  'Soft Skills': { title: 'Soft Skills', subtitle: 'Compétences comportementales', skills: [], color: 'green' },
  'Langues': { title: 'Langues', subtitle: 'Langues maîtrisées', skills: [], color: 'orange' },
})

const showCompetenceModal = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')

const niveauToLevel = {
  DEBUTANT: 25,
  INTERMEDIAIRE: 50,
  AVANCE: 75,
  EXPERT: 100,
}

const getCategoryLabel = (categorie) => {
  if (categorie === 'Technique') return 'Technique'
  if (categorie === 'Soft Skill') return 'Soft Skill'
  if (categorie === 'Langue') return 'Langue'
  return categorie
}

const getCategoryGroup = (categorie) => {
  if (categorie === 'Technique') return 'Techniques'
  if (categorie === 'Soft Skill') return 'Soft Skills'
  if (categorie === 'Langue') return 'Langues'
  return 'Techniques'
}

const allCompetences = computed(() => {
  return Object.values(competenceGroupList).flatMap((group) => group.skills)
})

const filteredCompetences = computed(() => {
  if (activeFilter.value === 'Toutes') {
    return allCompetences.value
  }

  return allCompetences.value.filter((skill) => skill.category === activeFilter.value)
})

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

async function loadSkills() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data } = await api.get('/student/skills/me')
    const skills = data.skills || []

    // Réinitialiser les groupes
    Object.keys(competenceGroupList).forEach(key => {
      competenceGroupList[key].skills = []
    })

    // Remplir les groupes
    skills.forEach((skill) => {
      const level = niveauToLevel[skill.niveau] || 50
      const category = getCategoryLabel(skill.skill.categorie)
      const group = getCategoryGroup(skill.skill.categorie)

      competenceGroupList[group].skills.push({
        name: skill.skill.nom,
        level,
        category,
        source: 'Portfolio',
        skillId: skill.skillId,
        niveau: skill.niveau,
      })
    })
  } catch (err) {
    errorMessage.value = 'Erreur lors du chargement des compétences'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function addCompetence(skillData) {
  try {
    await api.post('/student/skills/me', {
      nom: skillData.name,
      categorie: skillData.category,
      niveau: skillData.niveau || 'DEBUTANT',
    })
    await loadSkills()
    showCompetenceModal.value = false
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Erreur lors de l\'ajout'
    console.error(err)
  }
}

async function deleteCompetence(skillId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return

  try {
    await api.delete(`/student/skills/me/${skillId}`)
    await loadSkills()
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Erreur lors de la suppression'
    console.error(err)
  }
}

async function updateCompetence(skillId, newNiveau) {
  try {
    await api.put(`/student/skills/me/${skillId}`, {
      niveau: newNiveau,
    })
    await loadSkills()
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Erreur lors de la mise à jour'
    console.error(err)
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
      <Topbar title="Competences" user-initials="AA" />

      <main class="competences-page">
        <section class="page-header">
          <div>
            <h2>Mes competences</h2>
            <p>Competences techniques, soft skills et langues</p>
          </div>

          <button class="primary-btn" @click="showCompetenceModal=true">
            Ajouter une competence
          </button>
        </section>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div v-if="isLoading" style="color: #64748b; font-size: 16px; padding: 20px;">
          Chargement...
        </div>

        <template v-else>
          <section class="groups-grid">
            <article
              v-for="(group, key) in competenceGroupList"
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
                  Aucune compétence dans cette catégorie
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

            <table class="competences-table">
              <thead>
                <tr>
                  <th>COMPETENCE</th>
                  <th>CATEGORIE</th>
                  <th>NIVEAU</th>
                  <th>SOURCE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="skill in filteredCompetences"
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
                    {{ skill.source }}
                  </td>

                  <td class="action-cell">
                    <button
                      class="action-btn modify-btn"
                      @click="updateCompetence(skill.skillId, skill.niveau)"
                    >
                      Modifier
                    </button>
                    <button
                      class="action-btn delete-btn"
                      @click="deleteCompetence(skill.skillId)"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredCompetences.length === 0">
                  <td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">
                    Aucune compétence trouvée
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </template>
      </main>
    </div>

    <CompetenceModal
      v-if="showCompetenceModal"
      @close="showCompetenceModal = false"
      @save="addCompetence"
    />
  </div>
</template>

<style scoped>
.error-message {
  color: #dc2626;
  font-size: 14px;
  padding: 12px 20px;
  background: #fff1f1;
  border-radius: 8px;
  margin-bottom: 20px;
  margin-left: 38px;
  margin-right: 38px;
}

.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f1ec;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f4f1ec;
}

.competences-page {
  padding: 32px 38px 60px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.page-header h2 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
  color: #050505;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 17px;
}

.primary-btn {
  background: #082a47;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 16px 34px;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
}

.primary-btn:hover {
  background: #0b3558;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 26px;
}

.group-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  min-height: 330px;
}

.group-card h3 {
  margin: 0 0 18px;
  font-size: 22px;
  font-weight: 800;
  color: #050505;
}

.group-subtitle {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 15px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skill-item {
  padding: 8px 0;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  font-size: 15px;
}

.skill-header span {
  font-weight: 700;
  color: #050505;
}

.skill-header strong {
  color: #050505;
}

.progress-bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.progress-purple {
  background: #6257f2;
}

.progress-green {
  background: #10b981;
}

.progress-orange {
  background: #f0a91f;
}

.empty-message {
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  padding: 20px;
  font-style: italic;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 22px;
  overflow-x: auto;
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.filter-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #334155;
  border-radius: 999px;
  padding: 10px 22px;
  font-size: 15px;
  cursor: pointer;
}

.filter-btn.active {
  background: #082a47;
  color: #ffffff;
  font-weight: 800;
}

.competences-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.competences-table th {
  text-align: left;
  padding: 14px 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #64748b;
  font-size: 14px;
  font-weight: 800;
}

.competences-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #334155;
  font-size: 15px;
}

.skill-name {
  font-weight: 800;
  color: #050505 !important;
}

.category-badge {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 700;
}

.category-technique {
  background: #ebe7ff;
  color: #5b4cc4;
}

.category-soft {
  background: #d6f7e4;
  color: #078143;
}

.category-langue {
  background: #fff2d8;
  color: #c77a00;
}

.category-default {
  background: #eef2f7;
  color: #475569;
}

.level-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-progress {
  width: 110px;
  height: 8px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.mini-progress span {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.action-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: none;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.modify-btn {
  color: #f59e0b;
}

.modify-btn:hover {
  text-decoration: underline;
}

.delete-btn {
  color: #dc2626;
}

.delete-btn:hover {
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .groups-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .competences-page {
    padding: 22px;
  }

  .page-header {
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }

  .action-cell {
    flex-direction: column;
    gap: 4px;
  }
}
</style>