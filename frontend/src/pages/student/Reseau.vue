<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Filter, Award, ChevronRight, User } from 'lucide-vue-next'
import { api } from '@/store/authStore.js'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

const router = useRouter()

const searchText = ref('')
const selectedField = ref('')
const networkStudents = ref([])
const loading = ref(true)

async function fetchNetwork() {
  loading.value = true
  try {
    const res = await api.get('/search', {
      params: { 
        q: searchText.value || ' ',
        filiere: selectedField.value || undefined,
        limit: 20 
      }
    })

    networkStudents.value = res.data.data.map(s => ({
      id: s.studentId,
      name: s.studentName,
      initials: s.initials,
      avatarColor: s.color || '#2f74b4',
      year: s.filiere || 'Étudiant',
      field: s.filiere || 'Général',
      school: s.school || 'Ensa Tanger',
      score: s.scoreCredibilite,
      level: s.scoreCredibilite >= 80 ? 'Expert' : s.scoreCredibilite >= 50 ? 'Avancé' : 'Inter.',
      levelClass: s.scoreCredibilite >= 80 ? 'level-expert' : s.scoreCredibilite >= 50 ? 'level-advanced' : 'level-inter',
      skills: s.tags || [],
      visibilite: s.visibilite
    }))
  } catch (e) {
    console.error('Erreur recherche', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchNetwork)

watch(searchText, () => {
  if (searchText.value.length > 2 || searchText.value.length === 0) {
    fetchNetwork()
  }
})

watch(selectedField, () => {
  fetchNetwork()
})

function viewStudentPortfolio(student) {
  if (student.visibilite === 'PRIVATE') {
    alert("Impossible de voir ce portfolio car il est configuré en mode privé par l'utilisateur.")
    return
  }
  router.push(`/portfolio/${student.id}`)
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Réseau étudiants" disable-global-search :show-search="false" />

      <main class="network-page">
        <section class="page-header">
          <div>
            <h2>Réseau étudiants</h2>
            <p>Découvrez les portfolios des autres étudiants de votre réseau</p>
          </div>
        </section>

        <section class="filters-card">
          <div class="search-box">
            <Search size="20" />
            <input
              v-model="searchText"
              type="text"
              placeholder="Rechercher par nom, badge ou projet..."
            />
          </div>

          <div class="filter-group">
            <Filter size="18" />
            <select v-model="selectedField">
              <option value="">Toutes les filières</option>
              <option value="Informatique">Informatique</option>
              <option value="Industriel">Industriel</option>
            </select>
          </div>
        </section>

        <section class="table-card" v-if="!loading">
          <div class="table-responsive">
            <table class="network-table">
              <thead>
                <tr>
                  <th>ETUDIANT</th>
                  <th>FILIERE</th>
                  <th>ETABLISSEMENT</th>
                  <th>SCORE</th>
                  <th>COMPÉTENCES</th>
                  <th class="actions-th">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="student in networkStudents"
                  :key="student.id"
                >
                  <td>
                    <div class="student-cell">
                      <div class="avatar" :style="{ background: student.avatarColor }">
                        {{ student.initials }}
                      </div>

                      <div class="student-info">
                        <h3>{{ student.name }}</h3>
                        <p>{{ student.year }}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="field-info">
                      {{ student.field }}
                    </div>
                  </td>
                  
                  <td>
                    <div class="school-info">
                      {{ student.school }}
                    </div>
                  </td>

                  <td>
                    <div class="score-cell">
                      <div class="score-value">
                        <strong>{{ student.score.toFixed(0) }}</strong>
                        <span class="score-total">/100</span>
                      </div>
                      <span :class="['level-badge', student.levelClass]">
                        {{ student.level }}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div class="badges-list">
                      <span
                        v-for="skill in student.skills.slice(0, 2)"
                        :key="skill"
                        class="mini-badge"
                      >
                        <Award size="12" />
                        {{ skill }}
                      </span>
                      <span v-if="student.skills.length > 2" class="more-badges">
                        +{{ student.skills.length - 2 }}
                      </span>
                    </div>
                  </td>

                  <td class="action-cell">
                    <button
                      type="button"
                      :class="['portfolio-btn', { 'btn-private': student.visibilite === 'PRIVATE' }]"
                      @click="viewStudentPortfolio(student)"
                    >
                      <template v-if="student.visibilite === 'PRIVATE'">
                        Privé
                      </template>
                      <template v-else>
                        Voir portfolio
                        <ChevronRight size="16" />
                      </template>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="networkStudents.length === 0" class="empty-state">
            <User size="48" />
            <h3>Aucun étudiant trouvé</h3>
            <p>Essayez de modifier vos critères de recherche.</p>
          </div>
        </section>
        
        <div v-else class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des membres du réseau...</p>
        </div>
      </main>
    </div>
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

.network-page {
  padding: 32px 40px;
}

.page-header {
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

.filters-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: #0f3a4f;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(15, 58, 79, 0.1);
}

.search-box svg { color: #64748b; }

.search-box input {
  width: 100%;
  height: 48px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: #0f172a;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  min-width: 200px;
}

.filter-group svg { color: #64748b; }

.filter-group select {
  border: none;
  background: transparent;
  outline: none;
  height: 48px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  width: 100%;
  cursor: pointer;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.table-responsive {
  overflow-x: auto;
}

.network-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.network-table thead {
  background: #f8fafc;
}

.network-table th {
  text-align: left;
  padding: 18px 24px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.network-table td {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  color: #334155;
  font-size: 15px;
  vertical-align: middle;
}

.network-table tr:hover td {
  background: #f8fafc;
}

.student-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.student-info h3 {
  margin: 0 0 2px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.student-info p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.score-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.score-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.score-value strong {
  font-size: 18px;
  color: #0f172a;
}

.score-total {
  font-size: 12px;
  color: #94a3b8;
}

.level-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  width: fit-content;
}

.level-expert { background: #dcfce7; color: #16a34a; }
.level-advanced { background: #eff6ff; color: #3b82f6; }
.level-inter { background: #fef3c7; color: #d97706; }

.badges-list {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.mini-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  color: #0f3a4f;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.more-badges {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.action-cell {
  text-align: right;
  padding-right: 32px !important;
}

.portfolio-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #0f3a4f;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.portfolio-btn:hover {
  background: #0f3a4f;
  color: #ffffff;
  border-color: #0f3a4f;
}

.btn-private {
  color: #94a3b8;
  background: #f1f5f9;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

.btn-private:hover {
  background: #e2e8f0;
  color: #64748b;
  border-color: #cbd5e1;
}

.empty-state, .loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #64748b;
}

.empty-state svg { color: #cbd5e1; margin-bottom: 16px; }
.empty-state h3 { font-size: 18px; color: #0f172a; margin-bottom: 8px; font-weight: 800; }

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #0f3a4f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1100px) {
  .filters-card { flex-direction: column; }
}

@media (max-width: 700px) {
  .network-page { padding: 24px; }
}
</style>

