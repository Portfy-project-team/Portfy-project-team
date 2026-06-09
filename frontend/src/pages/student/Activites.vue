<script setup>
import { computed, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import ActivityModal from '../../components/student/modals/ActivityModal.vue'

import { activities } from '../../data/mockData.js'

const activityList = ref([...activities])
const showActivityModal = ref(false)
const selectedActivity = ref(null)

const totalActivities = computed(() => activityList.value.length)

const verifiedActivities = computed(() => {
  return activityList.value.filter((activity) => activity.status === 'Verifiee').length
})

const pendingActivities = computed(() => {
  return activityList.value.filter((activity) => activity.status === 'En attente').length
})

function openAddActivity() {
  selectedActivity.value = null
  showActivityModal.value = true
}

function openEditActivity(activity) {
  selectedActivity.value = activity
  showActivityModal.value = true
}

function saveActivity(activityData) {
  if (selectedActivity.value) {
    const index = activityList.value.findIndex((activity) => activity.id === activityData.id)

    if (index !== -1) {
      activityList.value[index] = activityData
    }
  } else {
    activityList.value.unshift(activityData)
  }

  closeActivityModal()
}

function closeActivityModal() {
  showActivityModal.value = false
  selectedActivity.value = null
}

function viewAttestation(activity) {
  if (activity.proofFile) {
    const fileUrl = URL.createObjectURL(activity.proofFile)
    window.open(fileUrl, '_blank')
    return
  }

  if (activity.proofFileName) {
    alert(`Attestation ajoutee : ${activity.proofFileName}`)
    return
  }

  alert("Aucune attestation disponible pour cette activite pour le moment.")
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Activites parascolaires" user-initials="AA" />

      <main class="activities-page">
        <section class="page-header">
          <div>
            <h2>Mes activites</h2>
            <p>Clubs, evenements, hackathons et engagements associatifs</p>
          </div>

          <button
            type="button"
            class="primary-btn"
            @click="openAddActivity"
          >
            Nouvelle activite
          </button>
        </section>

        <section class="stats-grid">
          <StatCard
            title="Total activites"
            :value="totalActivities"
            color="cream"
            subtitle=""
          />

          <StatCard
            title="Verifiees"
            :value="verifiedActivities"
            color="green"
            subtitle=""
          />

          <StatCard
            title="En attente"
            :value="pendingActivities"
            color="yellow"
            subtitle=""
          />
        </section>

        <section class="table-card">
          <table class="activities-table">
            <thead>
              <tr>
                <th>ACTIVITE</th>
                <th>TYPE</th>
                <th>ORGANISATION</th>
                <th>PERIODE</th>
                <th>STATUT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="activity in activityList"
                :key="activity.id"
              >
                <td>
                  <div class="activity-name">
                    {{ activity.title }}
                  </div>

                  <div class="activity-role">
                    {{ activity.role }}
                  </div>
                </td>

                <td>
                  <span :class="['type-badge', activity.typeClass]">
                    {{ activity.type }}
                  </span>
                </td>

                <td>
                  {{ activity.organisation }}
                </td>

                <td>
                  {{ activity.periode }}
                </td>

                <td>
                  <StatusBadge :status="activity.status" />
                </td>

                <td>
                  <div class="actions">
                    <button
                      v-if="activity.status === 'Verifiee' || activity.status === 'Vérifiée'"
                      type="button"
                      class="action-btn"
                      @click="viewAttestation(activity)"
                    >
                      Attestation
                    </button>

                    <button
                      type="button"
                      class="action-btn"
                      @click="openEditActivity(activity)"
                    >
                      Modifier
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>

    <ActivityModal
      v-if="showActivityModal"
      :activity-to-edit="selectedActivity"
      @close="closeActivityModal"
      @save="saveActivity"
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

.activities-page {
  padding: 32px 38px;
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
  font-size: 30px;
  font-weight: 800;
  color: #050505;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 17px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 26px;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
}

.activities-table thead {
  background: #f8fafc;
}

.activities-table th {
  text-align: left;
  padding: 20px 26px;
  font-size: 14px;
  font-weight: 800;
  color: #64748b;
}

.activities-table td {
  padding: 20px 26px;
  border-top: 1px solid #e5e7eb;
  color: #334155;
  font-size: 16px;
  vertical-align: middle;
}

.activity-name {
  font-size: 16px;
  font-weight: 800;
  color: #050505;
  margin-bottom: 4px;
}

.activity-role {
  font-size: 14px;
  color: #64748b;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.type-hackathon {
  background: #fff1cc;
  color: #c77a00;
}

.type-club {
  background: #dff2ff;
  color: #1d4ed8;
}

.type-event {
  background: #ebe7ff;
  color: #6d5dfc;
}

.type-competition {
  background: #fee2e2;
  color: #dc2626;
}

.type-association {
  background: #d6f7e4;
  color: #078143;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}

.action-btn {
  background: transparent;
  border: none;
  color: #f59e0b;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.action-btn:hover {
  text-decoration: underline;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-card {
    overflow-x: auto;
  }

  .activities-table {
    min-width: 950px;
  }
}

@media (max-width: 700px) {
  .activities-page {
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