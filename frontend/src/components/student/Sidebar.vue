<template>
  <aside :class="['sidebar', { closed: !isOpen }]">
    <!-- Logo + Toggle -->
    <div class="sidebar-header">
      <div class="sidebar-logo" v-if="isOpen">
        <img src="../../assets/logo.png" alt="Portfy Logo" class="logo-img" />
        <span class="logo-text">Portfy</span>
      </div>
      <button class="toggle-btn" @click="toggleSidebar">
        <ChevronLeft v-if="isOpen" size="18" />
        <ChevronRight v-else size="18" />
      </button>
    </div>

    <!-- Profile -->
    <div v-if="isOpen" class="sidebar-profile">
      <div class="avatar">{{ initials }}</div>
      <div class="profile-info">
        <span class="profile-name">Ahmed Alami</span>
        <span class="profile-role">Étudiant · ENSAT</span>
      </div>
    </div>

    <!-- Score -->
    <div v-if="isOpen" class="score-badge">
      Score: <strong>82/100</strong>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <p v-if="isOpen" class="nav-label">Home</p>
      <RouterLink to="/student/dashboard" class="nav-item" active-class="active">
        <Home size="18" />
        <span v-if="isOpen">Dashboard</span>
      </RouterLink>
      <RouterLink to="/student/projects" class="nav-item" active-class="active">
        <Briefcase size="18" />
        <span v-if="isOpen">Projects</span>
      </RouterLink>
      <RouterLink to="/student/stages" class="nav-item" active-class="active">
        <Zap size="18" />
        <span v-if="isOpen">Stages</span>
      </RouterLink>

      <p v-if="isOpen" class="nav-label">Portfolio</p>
      <RouterLink to="/student/portfolio" class="nav-item" active-class="active">
        <Folder size="18" />
        <span v-if="isOpen">Portfolio</span>
      </RouterLink>
      <RouterLink to="/student/activites" class="nav-item" active-class="active">
        <Activity size="18" />
        <span v-if="isOpen">Activités</span>
      </RouterLink>
      <RouterLink to="/student/formations" class="nav-item" active-class="active">
        <BookOpen size="18" />
        <span v-if="isOpen">Formations</span>
      </RouterLink>
      <RouterLink to="/student/competences" class="nav-item" active-class="active">
        <Target size="18" />
        <span v-if="isOpen">Compétences</span>
      </RouterLink>
      <RouterLink to="/student/lettres" class="nav-item" active-class="active">
        <Mail size="18" />
        <span v-if="isOpen">Lettres</span>
      </RouterLink>
      <RouterLink to="/student/badges" class="nav-item" active-class="active">
        <Award size="18" />
        <span v-if="isOpen">Badges</span>
      </RouterLink>
      <RouterLink to="/student/reseau" class="nav-item" active-class="active">
        <Users size="18" />
        <span v-if="isOpen">Réseau</span>
      </RouterLink>


      <p v-if="isOpen" class="nav-label">Support</p>
      <RouterLink to="/student/commentaires" class="nav-item" active-class="active">
        <MessageCircle size="18" />
        <span v-if="isOpen">Commentaires</span>
        <span v-if="isOpen" class="badge">3</span>
      </RouterLink>
      <RouterLink to="/student/historique" class="nav-item" active-class="active">
        <Clock size="18" />
        <span v-if="isOpen">Historique</span>
      </RouterLink>
      <RouterLink to="/student/notifications" class="nav-item" active-class="active">
        <Bell size="18" />
        <span v-if="isOpen">Notifications</span>
      </RouterLink>
      <RouterLink to="/student/parametres" class="nav-item" active-class="active">
        <Settings size="18" />
        <span v-if="isOpen">Paramètres</span>
      </RouterLink>
      <RouterLink to="/student/aide" class="nav-item" active-class="active">
        <HelpCircle size="18" />
        <span v-if="isOpen">Aide & Support</span>
      </RouterLink>
    </nav>

    <!-- Logout -->
    <button v-if="isOpen" class="logout-btn" @click="logout">
      <LogOut size="18" />
      Déconnexion
    </button>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Home, Briefcase, Zap, Folder, Activity, BookOpen, Target, Mail, Award, Users, Star, MessageCircle, Clock, Bell, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const isOpen = ref(true)
const userName = "Ahmed Alami"

const initials = computed(() => {
  return userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #0f3a4f;
  color: #fff;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1a4f5f;
  font-family: 'Inter', sans-serif;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.closed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  border-bottom: 1px solid #1a4f5f;
  gap: 8px;
}

.sidebar.closed .sidebar-header {
  justify-content: center;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-img {
  width: 70px;
  height: 60px;
  object-fit: contain;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: rgba(245, 166, 35, 0.1);
  color: #e5b230;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toggle-btn:hover {
  background: rgba(245, 166, 35, 0.2);
}

.toggle-btn :deep(svg) {
  stroke-width: 2;
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin-bottom: 8px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5b230;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-role {
  display: block;
  font-size: 0.7rem;
  color: #94b3c7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.score-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin: 0 16px 12px;
  background: rgba(245, 166, 35, 0.1);
  border: 1px solid #e5b230;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #e5b230;
}

.score-badge strong {
  font-weight: 700;
  color: #f5a623;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94b3c7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 12px 6px;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 4px;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(245, 166, 35, 0.08);
  color: #fff;
}

.nav-item.active {
  background: #e5b230;
  color: #0f3a4f;
  font-weight: 600;
}

.sidebar.closed .nav-item {
  justify-content: center;
  padding: 10px;
}

.nav-item :deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}

.badge {
  margin-left: auto;
  background: #e5b230;
  color: #0f3a4f;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 700;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: calc(100% - 16px);
  padding: 10px 8px;
  margin: 16px 8px 16px;
  background: rgba(245, 166, 35, 0.1);
  border: 1px solid #e5b230;
  color: #e5b230;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #f5a623;
  color: #0f3a4f;
}

.logout-btn :deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}
</style>