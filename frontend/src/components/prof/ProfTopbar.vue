<template>
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    <div class="topbar-right">
      <div class="search-box">
        <Search size="15" color="#aaa" />
        <input type="text" placeholder="Rechercher" v-model="searchQuery" />
      </div>
      <button class="notif-btn">
        <Bell size="20" />
        <span class="notif-dot"></span>
      </button>
      <div class="topbar-avatar">{{ initials }}</div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { Search, Bell } from 'lucide-vue-next'

const auth  = useAuthStore()
const route = useRoute()

const searchQuery = ref('')

const initials = computed(() => {
  if (!auth.user) return 'AA'
  const n = auth.user.name?.[0] || ''
  const p = auth.user.prenom?.[0] || ''
  return (n + p).toUpperCase() || 'AA'
})

const pageTitles = {
  'prof-dashboard':     'Dashboard',
  'prof-portfolios':    'Portfolios consultés',
  'prof-recommandations':'Recommandations',
  'prof-commentaires':  'Commentaires',
  'prof-parametres':    'Paramètres',
  'prof-aide':          'Aide & Support',
}

const pageTitle = computed(() => pageTitles[route.name] || 'Dashboard')
</script>

<style scoped>
.topbar {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;        
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1f36;
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f4f6fa;
  border-radius: 10px;
  padding: 8px 14px;
  width: 200px;
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  font-size: 13px;
  color: #333;
  width: 100%;
}

.search-box input::placeholder { color: #aaa; }

.notif-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.notif-dot {
  position: absolute;
  top: 4px; right: 4px;
  width: 7px; height: 7px;
  background: #e05260;
  border-radius: 50%;
  border: 1.5px solid #fff;
}

.topbar-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #6c63ff;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>