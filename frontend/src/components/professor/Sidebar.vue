<template>
  <aside :class="['sidebar', { closed: !isOpen }]">
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

    <div v-if="isOpen" class="sidebar-profile">
      <div class="avatar">{{ initials }}</div>
      <div class="profile-info">
        <span class="profile-name">{{ displayName }}</span>
        <span class="profile-role">{{ displayRole }}</span>
      </div>
    </div>

    <div v-if="isOpen" class="verified-badge">
      <Star size="16" />
      Compte vérifié
    </div>

    <nav class="sidebar-nav">
      <p v-if="isOpen" class="nav-label">Home</p>
      <router-link to="/professor/dashboard" class="nav-item" active-class="active">
        <Home size="18" /><span v-if="isOpen">Dashboard</span>
      </router-link>
      <router-link to="/professor/portfolios-consultes" class="nav-item" active-class="active">
        <Eye size="18" /><span v-if="isOpen">Portfolios consultés</span>
      </router-link>
      <router-link to="/professor/recommandations" class="nav-item" active-class="active">
        <Star size="18" /><span v-if="isOpen">Recommandations</span>
      </router-link>
      <router-link to="/professor/generer-lettre" class="nav-item ai-btn" active-class="active">
        <Sparkles size="18" /><span v-if="isOpen">Générer une lettre</span>
      </router-link>
      <p v-if="isOpen" class="nav-label">Support</p>
      <router-link to="/professor/commentaires" class="nav-item" active-class="active">
        <MessageCircle size="18" /><span v-if="isOpen">Commentaires</span>
        <span v-if="isOpen" class="badge">3</span>
      </router-link>
      <router-link to="/professor/parametres" class="nav-item" active-class="active">
        <Settings size="18" /><span v-if="isOpen">Paramètres</span>
      </router-link>
      <router-link to="/professor/aide" class="nav-item" active-class="active">
        <HelpCircle size="18" /><span v-if="isOpen">Aide & Support</span>
      </router-link>
    </nav>

    <button v-if="isOpen" class="logout-btn" @click="logout">
      <LogOut size="18" />Déconnexion
    </button>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore.js'
import { Home, Eye, Star, MessageCircle, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const isOpen = ref(true)

// Nom affiché : depuis le store auth
const displayName = computed(() => {
  const user = auth.user
  if (!user) return 'Professeur'
  const name = user.name || user.nom || user.prenom || ''
  return name ? `M. ${name}` : 'Professeur'
})

// Rôle affiché : institution si dispo, sinon rôle générique
const displayRole = computed(() => {
  const user = auth.user
  if (!user) return 'Professeur'
  return user.institution || user.etablissement || `Professeur · ${user.role || 'PROF'}`
})

// Initiales depuis le store
const initials = computed(() => {
  const user = auth.user
  if (!user) return 'PR'
  const n = user.name?.[0] || user.nom?.[0] || ''
  const p = user.prenom?.[0] || ''
  return (n + p).toUpperCase() || 'PR'
})

const toggleSidebar = () => { isOpen.value = !isOpen.value }
const logout = () => {
  auth.logout?.()
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.sidebar { width: 220px; background: #0f3a4f; color: #fff; display: flex; flex-direction: column; border-right: 1px solid #1a4f5f; font-family: 'Inter', sans-serif; transition: width 0.3s ease; overflow: hidden; flex-shrink: 0; }
.sidebar.closed { width: 64px; }
[data-theme="dark"] .sidebar { background: #0a1628; border-right-color: #1a2a3a; }

.sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 8px; border-bottom: 1px solid #1a4f5f; gap: 8px; }
.sidebar.closed .sidebar-header { justify-content: center; }
.sidebar-logo { display: flex; align-items: center; gap: 8px; }
.logo-img { width: 70px; height: 60px; object-fit: contain; }
.logo-text { font-size: 1.1rem; font-weight: 700; color: white; white-space: nowrap; }

.toggle-btn { width: 32px; height: 32px; border: none; border-radius: 6px; background: rgba(245,166,35,0.1); color: #e5b230; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
.toggle-btn:hover { background: rgba(245,166,35,0.2); }

.sidebar-profile { display: flex; align-items: center; gap: 10px; padding: 12px 16px; margin-bottom: 8px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: #e5b230; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0; }
.profile-info { flex: 1; min-width: 0; }
.profile-name { display: block; font-size: 0.85rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.profile-role { display: block; font-size: 0.7rem; color: #94b3c7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.verified-badge { display: flex; align-items: center; gap: 6px; padding: 8px 16px; margin: 0 16px 12px; background: rgba(245,166,35,0.1); border: 1px solid #e5b230; border-radius: 6px; font-size: 0.75rem; color: #e5b230; }

.sidebar-nav { flex: 1; overflow-y: auto; padding: 0 8px; }
.nav-label { font-size: 0.7rem; font-weight: 700; color: #94b3c7; text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 12px 6px; margin: 0; }

.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; margin-bottom: 4px; color: #cbd5e1; text-decoration: none; border-radius: 6px; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
.nav-item:hover { background: rgba(245,166,35,0.08); color: #fff; }
.nav-item.active { background: #e5b230; color: #0f3a4f; font-weight: 600; }
.sidebar.closed .nav-item { justify-content: center; padding: 10px; }
.nav-item :deep(svg) { flex-shrink: 0; stroke-width: 2; color: currentColor; }

.nav-item.ai-btn { background: linear-gradient(135deg, rgba(0,200,255,0.12), rgba(0,120,200,0.08)); border: 1px solid rgba(0,200,255,0.25); color: #e5b230; }
.nav-item.ai-btn:hover { background: linear-gradient(135deg, rgba(0,200,255,0.22), rgba(0,120,200,0.15)); box-shadow: 0 0 12px rgba(0,200,255,0.2); }
.nav-item.ai-btn.active { background: #e5b230; color: #fff; font-weight: 600; border: none; }

.badge { margin-left: auto; background: #e5b230; color: #0f3a4f; padding: 2px 6px; border-radius: 10px; font-size: 0.65rem; font-weight: 700; }

.logout-btn { display: flex; align-items: center; gap: 8px; width: calc(100% - 16px); padding: 10px 8px; margin: 16px 8px; background: rgba(245,166,35,0.1); border: 1px solid #e5b230; color: #e5b230; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.logout-btn:hover { background: #e5b230; color: #0f3a4f; }
</style>