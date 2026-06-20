<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  PlusCircle, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-vue-next'
import { api } from '../../store/authStore.js'
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatCard from '../../components/student/StatCard.vue'

const stats = ref(null)
const prenom = ref('Utilisateur')
const activities = ref([])
const loading = ref(true)

const dashboardStats = computed(() => {
  if (!stats.value) return []

  return [
    {
      id: 1,
      title: 'Score Global',
      value: stats.value.score || 0,
      unit: '/100',
      subtitle: stats.value.level || 'N/A',
      color: 'blue',
      subtitleColor: 'blue'
    },
    {
      id: 2,
      title: 'Projets',
      value: stats.value.projets || 0,
      unit: '',
      subtitle: `${stats.value.projetsValidés || 0} validés`,
      color: 'green',
      subtitleColor: 'green'
    },
    {
      id: 3,
      title: 'Stages',
      value: stats.value.stages || 0,
      unit: '',
      subtitle: `${stats.value.stagesEnCours || 0} en cours`,
      color: 'orange',
      subtitleColor: 'orange'
    }
  ]
})

function getActivityIcon(type) {
  switch (type) {
    case 'PROJECT_VALIDATED': return CheckCircle2
    case 'PROJECT_SUBMITTED': return PlusCircle
    case 'COMMENT_RECEIVED': return MessageSquare
    case 'RECOMMENDATION': return Award
    default: return Clock
  }
}

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const scoreDetails = computed(() => {
  return stats.value?.details || []
})

onMounted(async () => {
  try {
    const res = await api.get('/dashboard')
    const data = res.data.data

    stats.value = data.stats
    prenom.value = data.prenom
    activities.value = data.activities || []
  } catch (e) {
    console.error('Erreur dashboard', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Dashboard" :show-search="false" />

      <main class="dashboard-page">
        <section class="welcome-section">
          <h2>Bonjour, {{ prenom }} 👋</h2>
          <p>Voici un aperçu de votre activité et progression sur Portfy</p>
        </section>

        <section class="stats-grid">
          <StatCard
            v-for="stat in dashboardStats"
            :key="stat.id"
            :title="stat.title"
            :value="stat.value"
            :unit="stat.unit"
            :subtitle="stat.subtitle"
            :color="stat.color"
            :subtitle-color="stat.subtitleColor"
          />
        </section>

        <section class="dashboard-grid">
          <div class="score-card">
            <div class="card-title">
              <div class="title-with-icon">
                <TrendingUp size="20" />
                <h3>Score de crédibilité</h3>
              </div>
              <p>Détail de votre influence et validation sur la plateforme</p>
            </div>

            <div class="score-content">
              <div class="score-circle-wrapper">
                <div class="score-circle">
                  <div>
                    <strong>{{ stats?.score || 0 }}</strong>
                    <span>{{ stats?.level || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <div class="score-lines">
                <div
                  v-for="item in scoreDetails"
                  :key="item.label"
                  class="score-line"
                >
                  <div class="score-line-header">
                    <span>{{ item.label }}</span>
                    <strong>{{ item.percent }}%</strong>
                  </div>

                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" :style="{ width: item.percent + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="recent-card">
            <div class="card-title">
              <div class="title-with-icon">
                <Clock size="20" />
                <h3>Activité récente</h3>
              </div>
              <p>Suivez vos dernières interactions</p>
            </div>

            <div class="recent-list">
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="recent-item"
              >
                <div :class="['activity-icon-box', activity.color || 'blue']">
                  <component :is="getActivityIcon(activity.type)" size="18" />
                </div>

                <div class="activity-info">
                  <p>{{ activity.message }}</p>
                  <small>{{ formatDate(activity.createdAt) }}</small>
                </div>
              </div>

              <div v-if="activities.length === 0" class="empty-activities">
                <AlertCircle size="32" />
                <p>Aucune activité récente à afficher.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f8fafc;
}

.dashboard-page {
  padding: 32px 40px;
}

.welcome-section {
  margin-bottom: 32px;
}

.welcome-section h2 {
  margin: 0 0 4px;
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
}

.welcome-section p {
  margin: 0;
  color: #64748b;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

.score-card,
.recent-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-title {
  margin-bottom: 24px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.title-with-icon svg {
  color: #0f3a4f;
}

.card-title h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

.card-title p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.score-content {
  display: flex;
  align-items: center;
  gap: 40px;
}

.score-circle-wrapper {
  flex-shrink: 0;
}

.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #0f3a4f;
  border: 8px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(15, 58, 79, 0.3);
}

.score-circle strong {
  display: block;
  font-size: 42px;
  font-weight: 900;
  line-height: 1;
}

.score-circle span {
  color: #f0a91f;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
}

.score-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-line-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
}

.score-line-header strong {
  color: #0f3a4f;
}

.progress-bar-bg {
  height: 10px;
  width: 100%;
  border-radius: 999px;
  background: #f1f5f9;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f3a4f 0%, #0b78a8 100%);
  border-radius: 999px;
  transition: width 1s ease-out;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recent-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.activity-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon-box.green { background: #f0fdf4; color: #10b981; }
.activity-icon-box.blue { background: #eff6ff; color: #3b82f6; }
.activity-icon-box.orange { background: #fffbeb; color: #f59e0b; }
.activity-icon-box.purple { background: #f5f3ff; color: #8b5cf6; }

.activity-info p {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.activity-info small {
  color: #94a3b8;
  font-size: 13px;
}

.empty-activities {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #94a3b8;
  text-align: center;
}

.empty-activities p {
  margin-top: 12px;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 750px) {
  .dashboard-page { padding: 24px; }
  .stats-grid { grid-template-columns: 1fr; }
  .score-content { flex-direction: column; gap: 32px; }
  .score-circle { margin: 0 auto; }
}
</style>
