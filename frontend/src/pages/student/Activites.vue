<script setup>
import { computed, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatCard from '../../components/student/StatCard.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import ActivityModal from '../../components/student/modals/ActivityModal.vue'

import { activities } from '../../data/mockData.js'

const showActivityModal = ref(false)
const activityList = ref([...activities])

const totalActivities = computed(() => activityList.value.length)

const verifiedActivities = computed(() => {
  return activityList.value.filter((activity) => {
    const status = activity.status.toLowerCase()
    return status.includes('verifie')
  }).length
})

const pendingActivities = computed(() => {
  return activityList.value.filter((activity) => {
    const status = activity.status.toLowerCase()
    return status.includes('attente')
  }).length
})

function addActivity(activity) {
  activityList.value.unshift(activity)
  showActivityModal.value = false
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

          <button class="primary-btn" @click="showActivityModal=true">
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
              <tr v-for="activity in activityList" :key="activity.id">
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

                <td>{{ activity.organisation }}</td>

                <td>{{ activity.periode }}</td>

                <td>
                  <StatusBadge :status="activity.status" />
                </td>

                <td>
                  <div class="actions">
                    <button
                      v-for="action in activity.actions"
                      :key="action"
                      class="action-btn"
                    >
                      {{ action }}
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
      @close="showActivityModal = false"
      @save="addActivity"
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