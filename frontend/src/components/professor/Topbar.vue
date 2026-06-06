<template>
  <div class="topbar">
    <h1 class="topbar-title">{{ title }}</h1>
    <div class="topbar-right">
      <div class="search-bar">
        <Search size="18" />
        <input type="text" placeholder="Rechercher" />
      </div>
      <button class="notif-btn">
        <Bell size="18" />
      </button>
      <div class="topbar-avatar">AA</div>
    </div>
  </div>
</template>

<script setup>
import { Search, Bell } from 'lucide-vue-next'

defineProps({ title: String })
</script>

<style scoped>
.topbar { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 16px 32px; 
  background: #fff; 
  border-bottom: 1px solid #f1f5f9; 
}

.topbar-title { 
  font-size: 1.3rem; 
  font-weight: 700; 
  color: #0f172a; 
  margin: 0; 
}

.topbar-right { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.search-bar { 
  display: flex; 
  align-items: center; 
  background: #f8f9fb; 
  border: 1px solid #e2e8f0; 
  border-radius: 8px; 
  padding: 8px 14px; 
  gap: 8px; 
}

.search-bar input { 
  border: none; 
  background: transparent; 
  outline: none; 
  font-size: 0.875rem; 
  width: 180px; 
  color: #0f172a;
}

.notif-btn { 
  background: none; 
  border: none; 
  cursor: pointer;
  color: #64748b;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.notif-btn:hover {
  color: #0f172a;
}

.topbar-avatar { 
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
}

/* Icônes Lucide */
.search-bar :deep(svg),
.notif-btn :deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}
</style>