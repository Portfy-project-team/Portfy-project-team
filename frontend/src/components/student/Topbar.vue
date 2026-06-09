<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  },
  userInitials: {
    type: String,
    default: 'AA'
  }
})

const router = useRouter()

function goToNotifications() {
  router.push('/student/notifications')
}

function goToParametres() {
  router.push('/student/parametres')
}
</script>

<template>
  <header class="topbar">
    <h1 class="topbar-title">
      {{ title }}
    </h1>

    <div class="topbar-actions">
      <div class="search-box">
        <input type="text" placeholder="Rechercher..." />
      </div>

      <button
        class="notification-btn"
        type="button"
        aria-label="Notifications"
        @click="goToNotifications"
      >
        <span class="notification-dot"></span>
      </button>

      <button
        class="profile-btn"
        type="button"
        @click="goToParametres"
      >
        {{ userInitials }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 88px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 36px;
  width: 100%;
}

.topbar-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #050505;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.search-box {
  width: 330px;
  height: 44px;
  border: 1px solid #e1e5ea;
  border-radius: 999px;
  background: #f8f9fb;
  display: flex;
  align-items: center;
  padding: 0 22px;
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #333;
}

.search-box input::placeholder {
  color: #6b7280;
}

.notification-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #e1e5ea;
  background: #ffffff;
  position: relative;
  cursor: pointer;
}

.notification-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #f0a91f;
  position: absolute;
  top: 12px;
  right: 12px;
}

.profile-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: #082a47;
  color: white;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

@media (max-width: 900px) {
  .topbar {
    padding: 0 18px;
  }

  .search-box {
    width: 220px;
  }
}

@media (max-width: 600px) {
  .topbar {
    height: auto;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .topbar-actions {
    width: 100%;
  }

  .search-box {
    flex: 1;
    width: auto;
  }
}
</style>