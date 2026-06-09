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

.notifications-page {
  padding: 32px 38px 60px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
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

.read-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #082a47;
  border-radius: 9px;
  padding: 14px 26px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
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
  font-size: 16px;
  cursor: pointer;
}

.filter-btn.active {
  background: #082a47;
  color: #ffffff;
  font-weight: 800;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-left: 4px solid transparent;
  border-radius: 12px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-card.green {
  border-left-color: #10b981;
}

.notification-card.orange {
  border-left-color: #f59e0b;
}

.notification-card.purple {
  border-left-color: #6366f1;
}

.notification-card.blue {
  border-left-color: #dff2ff;
}

.notification-card.pink {
  border-left-color: #ffe0d6;
}

.notification-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  flex-shrink: 0;
}

.notification-icon.green {
  background: #d6f7e4;
}

.notification-icon.orange {
  background: #fff2d8;
}

.notification-icon.purple {
  background: #ebe7ff;
}

.notification-icon.blue {
  background: #dff2ff;
}

.notification-icon.pink {
  background: #ffe0d6;
}

.notification-content {
  flex: 1;
}

.notification-content h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  color: #050505;
}

.notification-content p {
  margin: 0;
  color: #334155;
  font-size: 15px;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #64748b;
  font-size: 14px;
}

.unread-dot {
  width: 10px;
  height: 10px;
  background: #f0a91f;
  border-radius: 50%;
}

@media (max-width: 700px) {
  .notifications-page {
    padding: 22px;
  }

  .page-header {
    flex-direction: column;
  }

  .notification-card {
    align-items: flex-start;
  }

  .notification-meta {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
}
</style>