<template>
  <div class="app-layout">
    <Sidebar />
    <div class="main-content">
      <Topbar />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Topbar  from './Topbar.vue'
</script>

<style scoped>
.app-layout { display: flex; min-height: 100vh; }
.main-content {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
  background: var(--bg-app);
  overflow: hidden;
  transition: background 0.3s;
}
</style>