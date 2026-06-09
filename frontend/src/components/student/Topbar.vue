<script setup>
import { Search, Bell } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const props = defineProps({
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
        <Search size="18" />
        <input type="text" placeholder="Rechercher" />
      </div>
      
      <button class="notif-btn" title="Notifications">
        <Bell size="18" />
      </button>  

      <div class="profile-btn">
        {{ userInitials }}
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.topbar-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f8f9fb;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  gap: 8px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  width: 180px;
  color: #0f172a;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.search-box :deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: #64748b;
}

.notif-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  padding: 0;
  border-radius: 6px;
}

.notif-btn:hover {
  color: #0f172a;
}

.notif-btn :deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}

.profile-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2f74b4b4;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}

.profile-btn:hover {
  background: #4338ca;
}
</style>