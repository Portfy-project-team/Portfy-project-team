<template>
  <aside :class="['admin-sidebar', { closed: !isOpen }]">
    <div class="sidebar-header">
      <div v-if="isOpen" class="brand">
        <div class="brand-logo">P</div>
        <span>Portfy</span>
      </div>

      <button class="toggle-btn" type="button" @click="toggleSidebar">
        <ChevronLeft v-if="isOpen" size="18" />
        <ChevronRight v-else size="18" />
      </button>
    </div>

    <div v-if="isOpen" class="admin-profile">
      <div class="avatar">AD</div>
      <div>
        <h3>Admin Portfy</h3>
        <p>Super-Administrateur</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <p v-if="isOpen" class="nav-label">PRINCIPAL</p>

      <RouterLink to="/admin/dashboard" class="nav-item" active-class="active">
        <LayoutDashboard size="18" />
        <span v-if="isOpen">Dashboard</span>
      </RouterLink>

      <RouterLink to="/admin/users" class="nav-item" active-class="active">
        <Users size="18" />
        <span v-if="isOpen">Utilisateurs</span>
      </RouterLink>

      <RouterLink to="/admin/establishments" class="nav-item" active-class="active">
        <Building2 size="18" />
        <span v-if="isOpen">Etablissements</span>
      </RouterLink>

      <p v-if="isOpen" class="nav-label">VALIDATION</p>

      <RouterLink to="/admin/attestations" class="nav-item" active-class="active">
        <FileCheck2 size="18" />
        <span v-if="isOpen">Attestations</span>
      </RouterLink>

      <RouterLink to="/admin/moderation" class="nav-item" active-class="active">
        <ShieldAlert size="18" />
        <span v-if="isOpen">Moderation</span>
      </RouterLink>

      <p v-if="isOpen" class="nav-label">ANALYTICS</p>

      <RouterLink to="/admin/statistics" class="nav-item" active-class="active">
        <BarChart3 size="18" />
        <span v-if="isOpen">Statistiques</span>
      </RouterLink>

      <RouterLink to="/admin/settings" class="nav-item" active-class="active">
        <Settings size="18" />
        <span v-if="isOpen">Parametres</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Building2,
  FileCheck2,
  ShieldAlert,
  BarChart3,
  Settings
} from 'lucide-vue-next'

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.admin-sidebar {
  width: 255px;
  min-height: 100vh;
  background: #062f4f;
  color: #ffffff;
  flex-shrink: 0;
  padding: 18px 8px;
  transition: width 0.25s ease;
  overflow: hidden;
}

.admin-sidebar.closed {
  width: 76px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 21px;
  font-weight: 900;
}

.brand-logo {
  width: 34px;
  height: 34px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  color: #f9b31b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.toggle-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 11px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 9px;
  padding: 13px 12px;
  margin: 0 6px 26px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #f9b31b;
  color: #062f4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.admin-profile h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 900;
}

.admin-profile p {
  margin: 2px 0 0;
  font-size: 11px;
  color: #d9e6f0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.nav-label {
  color: #9ec3df;
  font-size: 11px;
  font-weight: 900;
  margin: 18px 18px 8px;
}

.nav-item {
  min-height: 37px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 18px;
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
  border-radius: 0;
}

.admin-sidebar.closed .nav-item {
  justify-content: center;
  padding: 0;
}

.nav-item:hover,
.nav-item.active {
  background: #f9b31b;
  color: #000000;
}

.nav-item :deep(svg) {
  flex-shrink: 0;
}
</style>