<template>
  <div class="admin-dashboard-page">
    <AdminSidebar />

    <div class="admin-main">
      <AdminTopbar title="Tableau de bord Administrateur" />

      <main class="admin-content">
        <section class="welcome-section">
          <h1>Bienvenue, Admin Portfy</h1>
          <p>Vue d'ensemble de la plateforme</p>
        </section>

        <section class="stats-grid">
          <button class="stat-card" type="button" @click="goTo('/admin/users')">
            <div>
              <p>Utilisateurs totaux</p>
              <h2>{{ totalUsers }}</h2>
              <span class="success">+12% ce mois</span>
            </div>
            <div class="icon blue"></div>
          </button>

          <button class="stat-card" type="button" @click="goTo('/admin/attestations')">
            <div>
              <p>En attente</p>
              <h2>{{ pendingAttestations }}</h2>
              <span class="warning">A valider</span>
            </div>
            <div class="icon yellow"></div>
          </button>

          <button class="stat-card" type="button" @click="goTo('/admin/establishments')">
            <div>
              <p>Etablissements</p>
              <h2>{{ totalEstablishments }}</h2>
              <span>Ecoles inscrites</span>
            </div>
            <div class="icon green"></div>
          </button>

          <button class="stat-card" type="button" @click="goTo('/admin/moderation')">
            <div>
              <p>Signalements</p>
              <h2>{{ urgentItems }}</h2>
              <span class="danger">Urgents</span>
            </div>
            <div class="icon red"></div>
          </button>
        </section>

        <section class="dashboard-bottom">
          <div class="panel repartition-panel">
            <h3>Repartition des utilisateurs</h3>
            <p>Par role sur la plateforme</p>

            <div class="role-list">
              <div v-for="role in roleStats" :key="role.label" class="role-item">
                <div class="role-header">
                  <span>{{ role.label }}</span>
                  <strong>{{ role.count }} ({{ role.percent }}%)</strong>
                </div>

                <div class="progress">
                  <div
                    class="progress-bar"
                    :class="role.className"
                    :style="{ width: role.percent + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel activity-panel">
            <h3>Activite recente</h3>
            <p>Dernieres actions</p>

            <div class="activity-list">
              <button
                v-for="activity in activities"
                :key="activity.title"
                type="button"
                class="activity-item"
                @click="goTo(activity.path)"
              >
                <span class="dot" :class="activity.color"></span>
                <div>
                  <h4>{{ activity.title }}</h4>
                  <small>{{ activity.time }}</small>
                </div>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'

import { useAdminStore } from '@/store/admin/adminStore'
import { useAttestationStore } from '@/store/admin/attestationsStore'
import { useEstablishmentStore } from '@/store/admin/establishmentsStore'
import { useModerationStore } from '@/store/admin/moderationStore'

const router = useRouter()

const adminStore = useAdminStore()
const attestationStore = useAttestationStore()
const establishmentStore = useEstablishmentStore()
const moderationStore = useModerationStore()

const totalUsers = computed(() => adminStore.users.length.toLocaleString('fr-FR'))
const pendingAttestations = computed(() => attestationStore.pendingAttestations)
const totalEstablishments = computed(() => establishmentStore.totalEstablishments)
const urgentItems = computed(() => moderationStore.urgentItems)

onMounted(() => {
  adminStore.fetchUsers()
})

const roleStats = computed(() => {
  const total = adminStore.users.length || 1

  const roles = [
    {
      label: 'Etudiants',
      count: adminStore.getUsersByRole('STUDENT').length,
      className: 'dark'
    },
    {
      label: 'Professeurs',
      count: adminStore.getUsersByRole('PROF').length,
      className: 'orange'
    },
    {
      label: 'Professionnels',
      count: adminStore.getUsersByRole('PRO').length,
      className: 'green'
    },
    {
      label: 'Administrateurs',
      count: adminStore.getUsersByRole('ADMIN').length,
      className: 'red'
    }
  ]

  return roles.map((role) => ({
    ...role,
    percent: Math.round((role.count / total) * 100)
  }))
})

const activities = [
  {
    title: 'Nouveau Prof valide',
    time: 'Il y a 12 min',
    color: 'success',
    path: '/admin/users'
  },
  {
    title: 'Signalement projet #245',
    time: 'Il y a 1 heure',
    color: 'danger',
    path: '/admin/moderation'
  },
  {
    title: 'Attestation a valider',
    time: 'Il y a 3 heures',
    color: 'warning',
    path: '/admin/attestations'
  },
  {
    title: 'ENSA Fes ajoute',
    time: 'Hier',
    color: 'info',
    path: '/admin/establishments'
  }
]

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.admin-dashboard-page {
  min-height: 100vh;
  display: flex;
  background: #f4f1ed;
  color: #062f4f;
}

.admin-main {
  flex: 1;
  min-width: 0;
}

.admin-content {
  padding: 22px;
}

.welcome-section {
  margin-bottom: 16px;
}

.welcome-section h1 {
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 900;
}

.welcome-section p {
  margin: 4px 0 0;
  color: #587086;
  font-size: 13px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.stat-card {
  min-height: 110px;
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.07);
}

.stat-card p {
  margin: 0;
  font-size: 12px;
  color: #314b62;
}

.stat-card h2 {
  margin: 18px 0 0;
  font-size: 28px;
  color: #000;
  font-weight: 900;
}

.stat-card span {
  font-size: 11px;
  color: #51697e;
}

.success {
  color: #00a862 !important;
}

.warning {
  color: #f5a400 !important;
}

.danger {
  color: #e52525 !important;
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 7px;
}

.icon.blue {
  background: #d9efff;
}

.icon.yellow {
  background: #fff0cd;
}

.icon.green {
  background: #cef7df;
}

.icon.red {
  background: #ffd9d9;
}

.dashboard-bottom {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
  margin-top: 18px;
}

.panel {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 20px 17px;
}

.panel h3 {
  margin: 0;
  color: #000;
  font-size: 17px;
  font-weight: 900;
}

.panel p {
  margin: 4px 0 14px;
  color: #587086;
  font-size: 12px;
}

.role-item {
  margin-bottom: 14px;
}

.role-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
}

.role-header strong {
  color: #000;
}

.progress {
  height: 6px;
  background: #e3e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
}

.progress-bar.dark {
  background: #062f4f;
}

.progress-bar.orange {
  background: #f9b31b;
}

.progress-bar.green {
  background: #22c47b;
}

.progress-bar.red {
  background: #e52525;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: none;
  background: transparent;
  text-align: left;
  padding: 0;
  cursor: pointer;
}

.activity-item:hover h4 {
  text-decoration: underline;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-top: 5px;
}

.dot.success {
  background: #20b875;
}

.dot.danger {
  background: #e52525;
}

.dot.warning {
  background: #f5a400;
}

.dot.info {
  background: #6266f1;
}

.activity-item h4 {
  margin: 0;
  color: #000;
  font-size: 13px;
  font-weight: 500;
}

.activity-item small {
  color: #647585;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .admin-dashboard-page {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>