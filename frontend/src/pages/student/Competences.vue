<script setup>
import { computed, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import CompetenceModal from '../../components/student/modals/CompetenceModal.vue'

import { competenceGroups } from '../../data/mockData.js'

const activeFilter = ref('Toutes')

const filters = ['Toutes', 'Techniques', 'Soft Skills', 'Langues']

const allCompetences = computed(() => {
  return competenceGroupList.value.flatMap((group) => group.skills)
})
const showCompetenceModal = ref(false)
const competenceGroupList = ref([...competenceGroups])
const filteredCompetences = computed(() => {
  if (activeFilter.value === 'Toutes') {
    return allCompetences.value
  }

  if (activeFilter.value === 'Techniques') {
    return allCompetences.value.filter((skill) => skill.category === 'Technique')
  }

  if (activeFilter.value === 'Soft Skills') {
    return allCompetences.value.filter((skill) => skill.category === 'Soft Skill')
  }

  if (activeFilter.value === 'Langues') {
    return allCompetences.value.filter((skill) => skill.category === 'Langue')
  }

  return allCompetences.value
})

function getCategoryClass(category) {
  if (category === 'Technique') return 'category-technique'
  if (category === 'Soft Skill') return 'category-soft'
  if (category === 'Langue') return 'category-langue'
  return 'category-default'
}
function addCompetence(skill) {
  const group = competenceGroupList.value.find((item) => {
    if (skill.category === 'Technique') return item.title === 'Techniques'
    if (skill.category === 'Soft Skill') return item.title === 'Soft Skills'
    if (skill.category === 'Langue') return item.title === 'Langues'
    return false
  })

  if (group) {
    group.skills.unshift(skill)
  }

  showCompetenceModal.value = false
}

function getProgressClass(category) {
  if (category === 'Technique') return 'progress-purple'
  if (category === 'Soft Skill') return 'progress-green'
  if (category === 'Langue') return 'progress-orange'
  return 'progress-purple'
}
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

        <section class="groups-grid">
          <article
            v-for="group in competenceGroupList"
            :key="group.id"
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

                <td>
                  <button class="action-btn">
                    Modifier
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
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

.action-btn {
  background: transparent;
  border: none;
  color: #f59e0b;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.action-btn:hover {
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
}
</style>