<script setup>
import { ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import StageModal from '../../components/student/modals/StageModal.vue'

import { stages } from '../../data/mockData.js'

const stageList = ref([...stages])
const showStageModal = ref(false)
const selectedStage = ref(null)

function openAddStage() {
  selectedStage.value = null
  showStageModal.value = true
}

function openEditStage(stage) {
  selectedStage.value = stage
  showStageModal.value = true
}

function saveStage(stageData) {
  if (selectedStage.value) {
    const index = stageList.value.findIndex((stage) => stage.id === stageData.id)

    if (index !== -1) {
      stageList.value[index] = stageData
    }
  } else {
    stageList.value.unshift(stageData)
  }

  showStageModal.value = false
  selectedStage.value = null
}

function closeStageModal() {
  showStageModal.value = false
  selectedStage.value = null
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Stages" user-initials="AA" />

      <main class="stages-page">
        <section class="page-header">
          <div>
            <h2>Mes stages</h2>
            <p>Gerez vos experiences professionnelles</p>
          </div>

          <button class="primary-btn" @click="openAddStage">
            Nouveau stage
          </button>
        </section>

        <section class="stages-list">
          <article
            v-for="stage in stageList"
            :key="stage.id"
            class="stage-card"
          >
            <div class="stage-header">
              <div class="stage-left">
                <div :class="['stage-icon', stage.iconColor]"></div>

                <div>
                  <h3>{{ stage.company }}</h3>
                  <h4>{{ stage.position }}</h4>
                  <p>
                    {{ stage.location }} - {{ stage.period }}
                    <span>({{ stage.duration }})</span>
                  </p>
                </div>
              </div>

              <StatusBadge :status="stage.status" />
            </div>

            <div class="stage-body">
              <div class="missions">
                <h5>MISSIONS REALISEES</h5>

                <ul>
                  <li
                    v-for="mission in stage.missions"
                    :key="mission"
                  >
                    {{ mission }}
                  </li>
                </ul>
              </div>

              <div class="technologies">
                <h5>TECHNOLOGIES</h5>

                <div class="tags">
                  <span
                    v-for="tech in stage.technologies"
                    :key="tech"
                    class="tag"
                  >
                    {{ tech }}
                  </span>
                </div>

                <div class="supervisors">
                  <p>
                    <strong>Encadrant entreprise:</strong>
                    {{ stage.companySupervisor }}
                  </p>
                  <p>
                    <strong>Encadrant academique:</strong>
                    {{ stage.academicSupervisor }}
                  </p>
                </div>
              </div>
            </div>

            <div class="stage-footer">
              <span
                v-if="stage.validationMessage"
                class="validation-pill"
              >
                {{ stage.validationMessage }}
              </span>

              <button class="edit-btn" @click="openEditStage(stage)">
                Modifier
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
    <StageModal
      v-if="showStageModal"
      :stage-to-edit="selectedStage"
      @close="closeStageModal"
      @save="saveStage"
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

.stages-page {
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

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.stage-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 26px;
}

.stage-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e7eb;
}

.stage-left {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.stage-icon {
  width: 56px;
  height: 56px;
  border-radius: 9px;
  flex-shrink: 0;
}

.stage-icon.blue {
  background: #dff2ff;
}

.stage-icon.cream {
  background: #fff2d8;
}

.stage-left h3 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  color: #050505;
}

.stage-left h4 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 800;
  color: #082a47;
}

.stage-left p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.stage-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 38px;
  padding: 22px 0;
  border-bottom: 1px solid #e5e7eb;
}

.stage-body h5 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 900;
  color: #050505;
}

.missions ul {
  margin: 0;
  padding-left: 18px;
  color: #334155;
}

.missions li {
  margin-bottom: 7px;
  font-size: 15px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.tag {
  background: #eaf3f8;
  color: #082a47;
  padding: 7px 12px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
}

.supervisors p {
  margin: 4px 0;
  color: #64748b;
  font-size: 14px;
}

.supervisors strong {
  color: #050505;
}

.stage-footer {
  min-height: 52px;
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.validation-pill {
  display: inline-flex;
  align-items: center;
  background: #d6f7e4;
  color: #078143;
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 800;
}

.edit-btn {
  background: #082a47;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.edit-btn:hover {
  background: #0b3558;
}

@media (max-width: 900px) {
  .stage-body {
    grid-template-columns: 1fr;
  }

  .stage-header {
    flex-direction: column;
  }
}

@media (max-width: 700px) {
  .stages-page {
    padding: 22px;
  }

  .page-header {
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }

  .stage-left {
    flex-direction: column;
  }

  .stage-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .edit-btn {
    width: 100%;
  }
}
</style>