<script setup>
import { ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import FormationModal from '../../components/student/modals/FormationModal.vue'

import { formations } from '../../data/mockData.js'

const formationList = ref([...formations])
const showFormationModal = ref(false)
const selectedFormation = ref(null)

function openAddFormation() {
  selectedFormation.value = null
  showFormationModal.value = true
}

function openEditFormation(formation) {
  selectedFormation.value = formation
  showFormationModal.value = true
}

function saveFormation(formationData) {
  if (selectedFormation.value) {
    const index = formationList.value.findIndex((formation) => {
      return formation.id === formationData.id
    })

    if (index !== -1) {
      formationList.value[index] = formationData
    }
  } else {
    formationList.value.unshift(formationData)
  }

  closeFormationModal()
}

function closeFormationModal() {
  showFormationModal.value = false
  selectedFormation.value = null
}

function viewCertificate(formation) {
  if (formation.certificateLink) {
    window.open(formation.certificateLink, '_blank')
    return
  }

  alert('Aucun certificat disponible pour cette formation pour le moment.')
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Formations & Certifications" user-initials="IH" />

      <main class="formations-page">
        <section class="page-header">
          <div>
            <h2>Mes formations</h2>
            <p>Cours en ligne, certifications et formations continues</p>
          </div>

          <button
            type="button"
            class="primary-btn"
            @click="openAddFormation"
          >
            Nouvelle formation
          </button>
        </section>

        <section class="formations-grid">
          <article
            v-for="formation in formationList"
            :key="formation.id"
            class="formation-card"
          >
            <div class="formation-top">
              <div :class="['formation-icon', formation.iconColor]"></div>

              <div class="formation-info">
                <h3>{{ formation.title }}</h3>
                <p>{{ formation.provider }}</p>
              </div>

              <StatusBadge :status="formation.status" />
            </div>

            <div class="progress-block">
              <div class="progress-label">
                <span>Progression</span>
                <strong>{{ formation.progress }}%</strong>
              </div>

              <div class="progress-bar">
                <span
                  :class="formation.progressColor"
                  :style="{ width: formation.progress + '%' }"
                ></span>
              </div>
            </div>

            <div class="formation-meta">
              <strong>{{ formation.label }}:</strong>
              <span>{{ formation.date }}</span>
            </div>

            <div class="tags">
              <span
                v-for="tag in formation.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>

            <div class="card-footer">
              <div class="links">
                <button
                  v-for="link in formation.links"
                  :key="link"
                  type="button"
                  :class="['link-btn', { orange: link === 'Certificat' }]"
                  @click="viewCertificate(formation)"
                >
                  {{ link }}
                </button>
              </div>

              <button
                type="button"
                class="edit-btn"
                @click="openEditFormation(formation)"
              >
                Modifier
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>

    <FormationModal
      v-if="showFormationModal"
      :formation-to-edit="selectedFormation"
      @close="closeFormationModal"
      @save="saveFormation"
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

.formations-page {
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

.formations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.formation-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.formation-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;
}

.formation-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  flex-shrink: 0;
}

.cream {
  background: #fff2d8;
}

.blue {
  background: #dff2ff;
}

.purple {
  background: #ebe7ff;
}

.pink {
  background: #fde2e2;
}

.formation-info {
  flex: 1;
}

.formation-info h3 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 800;
  color: #050505;
}

.formation-info p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.progress-block {
  margin-bottom: 18px;
}

.progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 15px;
}

.progress-label strong {
  color: #050505;
  font-size: 15px;
}

.progress-bar {
  height: 8px;
  width: 100%;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.green {
  background: linear-gradient(90deg, #f0a91f, #10b981);
}

.blue-green {
  background: linear-gradient(90deg, #1d70b8, #10b981);
}

.purple-orange {
  background: linear-gradient(90deg, #5b4cc4, #f59e0b);
}

.gray {
  background: #e5e7eb;
}

.formation-meta {
  margin-bottom: 14px;
  font-size: 15px;
  color: #64748b;
}

.formation-meta strong {
  color: #050505;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  background: #eaf3f8;
  color: #082a47;
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
}

.card-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.link-btn,
.edit-btn {
  background: transparent;
  border: none;
  font-size: 15px;
  cursor: pointer;
  padding: 0;
}

.link-btn {
  color: #082a47;
}

.link-btn.orange,
.edit-btn {
  color: #f59e0b;
  font-weight: 700;
}

.link-btn:hover,
.edit-btn:hover {
  text-decoration: underline;
}

@media (max-width: 1100px) {
  .formations-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .formations-page {
    padding: 22px;
  }

  .page-header {
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }

  .formation-top {
    flex-wrap: wrap;
  }
}
</style>