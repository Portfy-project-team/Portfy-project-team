<script setup>
import { computed, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

import { historyItems } from '../../data/mockData.js'

const activeFilter = ref('Tout')
const filters = ['Tout', 'Validations', 'Refus', 'Modifications']

const filteredHistory = computed(() => {
  if (activeFilter.value === 'Tout') return historyItems

  if (activeFilter.value === 'Validations') {
    return historyItems.filter((item) => normalize(item.status).includes('valide'))
  }

  if (activeFilter.value === 'Refus') {
    return historyItems.filter((item) => normalize(item.status).includes('refuse'))
  }

  if (activeFilter.value === 'Modifications') {
    return historyItems.filter((item) => normalize(item.status).includes('modifie'))
  }

  return historyItems
})

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function statusClass(status) {
  const s = normalize(status)

  if (s.includes('valide')) return 'status-valid'
  if (s.includes('correction')) return 'status-correction'
  if (s.includes('auto')) return 'status-auto'
  if (s.includes('modifie')) return 'status-modified'
  if (s.includes('refuse')) return 'status-rejected'

  return 'status-default'
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Historique" user-initials="IH" />

      <main class="history-page">
        <section class="page-header">
          <h2>Historique des validations</h2>
          <p>Toutes les actions effectuees sur votre compte</p>
        </section>

        <section class="filters">
          <button
            v-for="filter in filters"
            :key="filter"
            :class="['filter-btn', { active: activeFilter === filter }]"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </section>

        <section class="table-card">
          <table class="history-table">
            <thead>
              <tr>
                <th>ACTION</th>
                <th>ELEMENT</th>
                <th>PAR</th>
                <th>DATE</th>
                <th>STATUT</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in filteredHistory"
                :key="item.id"
              >
                <td>
                  <div class="action-cell">
                    <span :class="['action-icon', item.iconColor]"></span>
                    <strong>{{ item.action }}</strong>
                  </div>
                </td>

                <td>{{ item.element }}</td>
                <td>{{ item.by }}</td>
                <td>{{ item.date }}</td>

                <td>
                  <span :class="['status-pill', statusClass(item.status)]">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
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

.history-page {
  padding: 32px 38px 60px;
}

.page-header {
  margin-bottom: 22px;
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

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.filter-btn {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #334155;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.filter-btn.active {
  background: #082a47;
  color: #ffffff;
  font-weight: 800;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 950px;
}

.history-table thead {
  background: #f8fafc;
}

.history-table th {
  text-align: left;
  padding: 20px 24px;
  color: #64748b;
  font-size: 14px;
  font-weight: 800;
}

.history-table td {
  padding: 18px 24px;
  border-top: 1px solid #e5e7eb;
  color: #334155;
  font-size: 15px;
}

.action-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-cell strong {
  color: #050505;
  font-size: 16px;
}

.action-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-block;
  flex-shrink: 0;
}

.action-icon.green {
  background: #d6f7e4;
}

.action-icon.orange {
  background: #ffe0d6;
}

.action-icon.purple {
  background: #ebe7ff;
}

.action-icon.blue {
  background: #dff2ff;
}

.action-icon.yellow {
  background: #fff2d8;
}

.action-icon.pink {
  background: #fde2e2;
}

.status-pill {
  display: inline-flex;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.status-valid {
  background: #d6f7e4;
  color: #078143;
}

.status-correction {
  background: #ffe0d6;
  color: #c2410c;
}

.status-auto {
  background: #ebe7ff;
  color: #5b4cc4;
}

.status-modified {
  background: #fff2d8;
  color: #c77a00;
}

.status-rejected {
  background: #fde2e2;
  color: #dc2626;
}

.status-default {
  background: #eef2f7;
  color: #475569;
}

@media (max-width: 700px) {
  .history-page {
    padding: 22px;
  }
}
</style>