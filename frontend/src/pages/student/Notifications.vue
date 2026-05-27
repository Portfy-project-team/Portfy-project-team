<script setup>
import { computed, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

import { notifications } from '../../data/mockData.js'

const notificationList = ref([...notifications])
const activeFilter = ref('Toutes')

const filters = computed(() => [
  {
    label: 'Toutes',
    count: notificationList.value.length
  },
  {
    label: 'Non lues',
    count: notificationList.value.filter((item) => item.unread).length
  },
  {
    label: 'Projets',
    count: null
  },
  {
    label: 'Commentaires',
    count: null
  },
  {
    label: 'Badges',
    count: null
  }
])

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'Toutes') {
    return notificationList.value
  }

  if (activeFilter.value === 'Non lues') {
    return notificationList.value.filter((item) => item.unread)
  }

  return notificationList.value.filter((item) => {
    return item.category === activeFilter.value
  })
})

const unreadCount = computed(() => {
  return notificationList.value.filter((item) => item.unread).length
})

function markAllAsRead() {
  notificationList.value = notificationList.value.map((item) => ({
    ...item,
    unread: false
  }))
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Notifications" user-initials="AA" />

      <main class="notifications-page">
        <section class="page-header">
          <div>
            <h2>Toutes les notifications</h2>
            <p>{{ notificationList.length }} notifications - {{ unreadCount }} non lues</p>
          </div>

          <button class="read-btn" @click="markAllAsRead">
            Tout marquer lu
          </button>
        </section>

        <section class="filters">
          <button
            v-for="filter in filters"
            :key="filter.label"
            :class="['filter-btn', { active: activeFilter === filter.label }]"
            @click="activeFilter = filter.label"
          >
            {{ filter.label }}
            <span v-if="filter.count !== null">({{ filter.count }})</span>
          </button>
        </section>

        <section class="notifications-list">
          <article
            v-for="notification in filteredNotifications"
            :key="notification.id"
            :class="['notification-card', notification.color]"
          >
            <div :class="['notification-icon', notification.color]"></div>

            <div class="notification-content">
              <h3>{{ notification.title }}</h3>
              <p>{{ notification.message }}</p>
            </div>

            <div class="notification-meta">
              <span>{{ notification.time }}</span>
              <span v-if="notification.unread" class="unread-dot"></span>
            </div>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

