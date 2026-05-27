<script setup>
import { computed } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatCard from '../../components/student/StatCard.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'

import { activities } from '../../data/mockData.js'

const totalActivities = computed(() => activities.length)

const verifiedActivities = computed(() => {
  return activities.filter((activity) => {
    const status = activity.status.toLowerCase()
    return status.includes('verifie')
  }).length
})

const pendingActivities = computed(() => {
  return activities.filter((activity) => {
    const status = activity.status.toLowerCase()
    return status.includes('attente')
  }).length
})
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

          <button class="primary-btn">
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
              <tr v-for="activity in activities" :key="activity.id">
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
  </div>
</template>

