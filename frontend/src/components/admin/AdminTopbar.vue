<template>
  <header class="admin-topbar">
    <h1>{{ title }}</h1>

    <div class="topbar-actions">
      <button class="notif-btn" type="button" @click="toggleNotifications">
        <Bell size="18" />
        <span v-if="hasNotification" class="notif-dot"></span>
      </button>

      <button class="profile-btn" type="button" @click="goToSettings">
        {{ userInitials }}
      </button>
    </div>

    <div v-if="showNotifications" class="notif-menu">
      <h3>Notifications</h3>
      <p>Signalements urgents a verifier.</p>
      <button type="button" @click="goToModeration">
        Voir moderation
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Bell } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  },
  userInitials: {
    type: String,
    default: 'AD'
  },
  hasNotification: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const showNotifications = ref(false)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const goToSettings = () => {
  router.push('/admin/settings')
}

const goToModeration = () => {
  showNotifications.value = false
  router.push('/admin/moderation')
}
</script>

<style scoped>
.admin-topbar {
  height: 61px;
  background: #ffffff;
  border-bottom: 1px solid #dde5eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  position: relative;
}

.admin-topbar h1 {
  margin: 0;
  color: #000000;
  font-size: 20px;
  font-weight: 900;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 13px;
}

.notif-btn {
  width: 38px;
  height: 38px;
  border: 1px solid #dce4ea;
  background: #ffffff;
  border-radius: 50%;
  color: #062f4f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.notif-btn:hover {
  background: #f7f9fb;
}

.notif-dot {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 8px;
  height: 8px;
  background: #e52525;
  border-radius: 50%;
}

.profile-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #062f4f;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
}

.profile-btn:hover {
  background: #041f34;
}

.notif-menu {
  position: absolute;
  top: 52px;
  right: 22px;
  width: 260px;
  background: #ffffff;
  border: 1px solid #dce4ea;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.15);
  z-index: 40;
}

.notif-menu h3 {
  margin: 0 0 7px;
  color: #000000;
  font-size: 15px;
  font-weight: 900;
}

.notif-menu p {
  margin: 0 0 12px;
  color: #526b82;
  font-size: 13px;
}

.notif-menu button {
  border: none;
  background: #062f4f;
  color: #ffffff;
  border-radius: 7px;
  padding: 8px 12px;
  font-weight: 800;
  cursor: pointer;
}
</style>