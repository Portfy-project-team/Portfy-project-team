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

<style scoped>
.student-sidebar {
  width: 295px;
  min-height: 100vh;
  background: #082a47;
  color: white;
  transition: width 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

.student-sidebar.closed {
  width: 82px;
}

.sidebar-header {
  height: 82px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid white;
  color: #f3aa1c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
}

.logo-text {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.toggle-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #173b5c;
  color: white;
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-card {
  margin: 0 14px 14px;
  padding: 16px;
  border-radius: 12px;
  background: #1c405f;
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0a91f;
  color: #082a47;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 17px;
  flex-shrink: 0;
}

.user-info h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
}

.user-info p {
  margin: 4px 0 0;
  color: #b9c7d5;
  font-size: 14px;
}

.score-card {
  margin: 0 14px 28px;
  padding: 14px 18px;
  border-radius: 9px;
  background: #1c405f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #c9d6e2;
  font-size: 15px;
}

.score-card strong {
  color: #f0a91f;
  font-size: 17px;
}

.sidebar-nav {
  padding-bottom: 30px;
}

.nav-section {
  margin-bottom: 28px;
}

.section-title {
  margin: 0 0 10px;
  padding: 0 24px;
  color: #9eb2c5;
  font-size: 13px;
  font-weight: 700;
}

.nav-link {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0 40px;
  color: white;
  text-decoration: none;
  font-size: 17px;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
}

.nav-link.active {
  background: #f0a91f;
  color: #000;
  font-weight: 700;
}

.student-sidebar.closed .sidebar-header {
  padding: 18px 14px;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: auto;
}

.student-sidebar.closed .user-card {
  justify-content: center;
  padding: 12px;
}

.student-sidebar.closed .score-card {
  justify-content: center;
  padding: 12px 8px;
}

.student-sidebar.closed .score-card strong {
  font-size: 12px;
}

.student-sidebar.closed .nav-link {
  justify-content: center;
  padding: 0;
  font-weight: 700;
}

@media (max-width: 768px) {
  .student-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
  }

  .student-sidebar.closed {
    width: 0;
  }

  .student-sidebar.closed * {
    display: none;
  }
}
</style>