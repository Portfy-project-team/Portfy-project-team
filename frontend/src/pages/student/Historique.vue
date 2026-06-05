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
      <Topbar title="Historique" user-initials="AA" />

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

