<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
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
        limit: 20 
      }
    })
    
    networkStudents.value = res.data.data.map(s => ({
      id: s.studentId,
      name: s.studentName,
      initials: s.initials,
      avatarColor: 'avatar-blue',
      year: s.filiere || 'Étudiant',
      field: s.filiere || 'Général',
      school: s.school || 'Ensa Tanger',
      score: s.scoreCredibilite,
      level: s.scoreCredibilite >= 80 ? 'Expert' : s.scoreCredibilite >= 50 ? 'Avancé' : 'Inter.',
      levelClass: s.scoreCredibilite >= 80 ? 'level-expert' : s.scoreCredibilite >= 50 ? 'level-advanced' : 'level-inter',
      badges: s.tags
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

function viewStudentPortfolio(student) {
  router.push(`/portfolio/${student.id}`)
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Reseau etudiants" />

      <main class="network-page">
        <section class="page-header">
          <h2>Reseau etudiants</h2>
          <p>Decouvrez les portfolios des autres etudiants de votre reseau</p>
        </section>

        <section class="filters-card">
          <input
            v-model="searchText"
            type="text"
            placeholder="Rechercher par nom, badge ou projet..."
          />

          <select v-model="selectedField">
            <option value="">Toutes les filieres</option>
            <option value="Informatique">Informatique</option>
            <option value="Industriel">Industriel</option>
          </select>

          <select>
            <option>Tous les badges</option>
          </select>

          <select>
            <option>Tous les scores</option>
          </select>
        </section>

        <section class="table-card" v-if="!loading">
          <table class="network-table">
            <thead>
              <tr>
                <th>ETUDIANT</th>
                <th>FILIERE</th>
                <th>ETABLISSEMENT</th>
                <th>SCORE</th>
                <th>BADGES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="student in networkStudents"
                :key="student.id"
              >
                <td>
                  <div class="student-cell">
                    <div :class="['avatar', student.avatarColor]">
                      {{ student.initials }}
                    </div>

                    <div>
                      <h3>{{ student.name }}</h3>
                      <p>{{ student.year }}</p>
                    </div>
                  </div>
                </td>

                <td>{{ student.field }}</td>
                <td>{{ student.school }}</td>

                <td>
                  <div class="score-cell">
                    <strong>{{ student.score }}</strong>
                    <span :class="['level-badge', student.levelClass]">
                      {{ student.level }}
                    </span>
                  </div>
                </td>

                <td>
                  <div class="badges-list">
                    <span
                      v-for="badge in student.badges"
                      :key="badge"
                      class="mini-badge"
                    >
                      {{ badge }}
                    </span>
                  </div>
                </td>

                <td>
                  <button
                    type="button"
                    class="portfolio-btn"
                    @click="viewStudentPortfolio(student)"
                  >
                    Voir portfolio
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="networkStudents.length === 0" class="empty">Aucun étudiant trouvé.</div>
        </section>
        <div v-else class="loading">Chargement du réseau...</div>
      </main>
    </div>
  </div>
</template>

<style scoped>
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

.network-page {
  padding: 32px 38px 60px;
}

.page-header {
  margin-bottom: 24px;
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

.filters-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 190px 190px 190px;
  gap: 14px;
  margin-bottom: 22px;
}

.filters-card input,
.filters-card select {
  height: 48px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 0 16px;
  color: #334155;
  font-size: 15px;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
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
  font-size: 14px;
  font-weight: 800;
}

.network-table td {
  padding: 18px 24px;
  border-top: 1px solid #e5e7eb;
  color: #334155;
  font-size: 15px;
}

.student-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}

.avatar-blue {
  background: #dff2ff;
  color: #1d70b8;
}

.student-cell h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 800;
  color: #050505;
}

.student-cell p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-cell strong {
  color: #050505;
}

.level-badge {
  padding: 6px 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
}

.level-expert {
  background: #ebe7ff;
  color: #5b4cc4;
}

.level-advanced {
  background: #fff2d8;
  color: #c77a00;
}

.level-inter {
  background: #fde2e2;
  color: #dc2626;
}

.badges-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mini-badge {
  background: #eaf3f8;
  color:  #0f3a4f;
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
}

.portfolio-btn {
  background:  #0f3a4f;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.portfolio-btn:hover {
  background: #0b3558;
}

.empty, .loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

@media (max-width: 1100px) {
  .filters-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .network-page {
    padding: 22px;
  }
}
</style>
