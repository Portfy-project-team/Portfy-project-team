<template>
  <div class="app-layout">
    <ProfSidebar />
    <div class="main-content">
      <ProfTopbar />
      <router-view />
    </div>
  </div>
</template>

<script setup>
// AVANT (erreur)
// import ProfSidebar from '../components/prof/ProfSidebar.vue'
// import ProfTopbar  from '../components/prof/ProfTopbar.vue'

// APRÈS (correct — même dossier)
import ProfSidebar from './ProfSidebar.vue'
import ProfTopbar  from './ProfTopbar.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #f4f6fa;
  overflow: hidden;
}
</style>