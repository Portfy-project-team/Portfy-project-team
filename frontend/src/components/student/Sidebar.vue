<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const homeLinks = [
  { label: 'Dashboard', to: '/student/dashboard' },
  { label: 'Projects', to: '/student/projects' },
  { label: 'Stages', to: '/student/stages' },
]

const portfolioLinks = [
  { label: 'Activites', to: '/student/activites' },
  { label: 'Formations', to: '/student/formations' },
  { label: 'Competences', to: '/student/competences' },
  { label: 'Mon Portfolio', to: '/student/portfolio' },
  { label: 'Lettres', to: '/student/lettres' },
  { label: 'Badges', to: '/student/badges' },
  { label: 'Reseau', to: '/student/reseau' },
  { label: 'Recommendations', to: '/student/recommendations' },
]

const supportLinks = [
  { label: 'Commentaires', to: '/student/commentaires' },
  { label: 'Historique', to: '/student/historique' },
  { label: 'Notifications', to: '/student/notifications' },
  { label: 'Parametres', to: '/student/parametres' },
  { label: 'Aide', to: '/student/aide' },
]
</script>

<template>
  <aside :class="['student-sidebar', { closed: !isOpen }]">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo-box">
        <div class="logo-icon">P</div>
        <span v-if="isOpen" class="logo-text">Portfy</span>
      </div>

      <button class="toggle-btn" @click="toggleSidebar">
        {{ isOpen ? '‹' : '›' }}
      </button>
    </div>

    <!-- User Card -->
    <div class="user-card">
      <div class="avatar">AA</div>

      <div v-if="isOpen" class="user-info">
        <h3>Ahmed Alami</h3>
        <p>ENSA Tanger</p>
      </div>
    </div>

    <!-- Score -->
    <div class="score-card">
      <span v-if="isOpen">Score</span>
      <strong>82/100</strong>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <p v-if="isOpen" class="section-title">HOME</p>

        <RouterLink
          v-for="link in homeLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          active-class="active"
        >
          <span v-if="isOpen">{{ link.label }}</span>
          <span v-else>{{ link.label.charAt(0) }}</span>
        </RouterLink>
      </div>

      <div class="nav-section">
        <p v-if="isOpen" class="section-title">PORTFOLIO</p>

        <RouterLink
          v-for="link in portfolioLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          active-class="active"
        >
          <span v-if="isOpen">{{ link.label }}</span>
          <span v-else>{{ link.label.charAt(0) }}</span>
        </RouterLink>
      </div>

      <div class="nav-section">
        <p v-if="isOpen" class="section-title">SUPPORT</p>

        <RouterLink
          v-for="link in supportLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          active-class="active"
        >
          <span v-if="isOpen">{{ link.label }}</span>
          <span v-else>{{ link.label.charAt(0) }}</span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

