<template>
  <div class="dashboard">

    <!-- Loading -->
    <div v-if="store.loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Error -->
    <div v-if="store.error" class="error-banner">
      ⚠️ {{ store.error }}
      <button @click="store.loadDashboard()">Réessayer</button>
    </div>

    <!-- Welcome Banner -->
    <div class="welcome-card">
      <div class="welcome-text">
        <h1>Bonjour, {{ store.user?.name ? 'M. ' + store.user.name : 'M. Ghailani' }}</h1>
        <p>Ajoutez vos projets, stages et compétences pour obtenir un portfolio validé par votre institution. Impressionnez les recruteurs avec des preuves vérifiables.</p>
        <div class="header-actions">
          <button class="btn-primary"><Eye :size="14" /> Parcourir les portfolios</button>
          <button class="btn-outline">Voir mon portfolio</button>
        </div>
      </div>
      <div class="welcome-illustration">
        <div class="deco-circle deco-1"></div>
        <div class="deco-circle deco-2"></div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat, i) in store.stats" :key="stat.key">
        <div class="stat-top">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-icon-box" :style="{ background: statsMeta[i]?.iconBg }">
            <component :is="statsMeta[i]?.icon" :size="16" :color="statsMeta[i]?.iconColor" />
          </div>
        </div>
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-trend trend-green">{{ stat.trend }}</div>
      </div>
    </div>

    <!-- Body -->
    <div class="dashboard-body">

      <!-- Left -->
      <div class="left-col">

        <!-- Projets en attente -->
        <div class="card">
          <div class="card-header">
            <h2>Projets en attente de validation</h2>
          </div>
          <div v-if="store.pendingProjects.length === 0" class="empty-state">
            Aucun projet en attente.
          </div>
          <div class="project-list">
            <div class="project-item" v-for="p in store.pendingProjects" :key="p.id">
              <div class="project-avatar" :style="{ background: p.color }">{{ p.initials }}</div>
              <div class="project-info">
                <div class="project-name">
                  <strong>{{ p.student }}</strong> – {{ p.title }}
                </div>
                <div class="project-meta">{{ p.stack }} · soumis {{ p.date }}</div>
                <div class="project-tags">
                  <span class="tag" v-for="tag in p.tags" :key="tag.label" :class="tag.class">
                    {{ tag.label }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mes recommandations -->
        <div class="card">
          <div class="card-header">
            <h2>Mes recommandations</h2>
            <button class="btn-add">+ Ajouter</button>
          </div>
          <div v-if="store.recommendations.length === 0" class="empty-state">
            Aucune recommandation.
          </div>
          <div class="reco-list">
            <div class="reco-item" v-for="r in store.recommendations" :key="r.id">
              <div class="reco-avatar" :style="{ background: r.color }">{{ r.initials }}</div>
              <div class="reco-info">
                <div class="reco-name">
                  <strong>{{ r.student }}</strong> —
                  <span class="reco-text">{{ r.text }}</span>
                </div>
                <div class="reco-date">Portfolio · {{ r.date }}</div>
              </div>
              <span class="status-badge" :class="r.status">{{ r.statusLabel }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Right -->
      <div class="right-col">

        <!-- Activité récente -->
        <div class="card">
          <div class="card-header"><h2>Activité récente</h2></div>
          <div v-if="store.recentActivity.length === 0" class="empty-state">
            Aucune activité récente.
          </div>
          <div class="activity-list">
            <div
              class="activity-item"
              v-for="a in store.recentActivity"
              :key="a.id"
              :class="{ unread: !a.is_read }"
            >
              <div class="activity-dot" :style="{ background: a.color }"></div>
              <div class="activity-text">
                <span v-html="a.text"></span>
                <div class="activity-time">{{ a.time }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Eye, Mail, MessageCircle, Star, PlusCircle, CheckCircle } from 'lucide-vue-next'
import { useDashboardStore } from '@/store/dashboardStore.js'

const store = useDashboardStore()

const statsMeta = [
  { icon: PlusCircle,    iconBg: '#eef0ff', iconColor: '#6c63ff' },
  { icon: CheckCircle,   iconBg: '#e6f7f3', iconColor: '#43b89c' },
  { icon: Mail,          iconBg: '#fff3e0', iconColor: '#f9a825' },
  { icon: MessageCircle, iconBg: '#f0f4ff', iconColor: '#6c63ff' },
  { icon: Star,          iconBg: '#fffbe6', iconColor: '#e5b230' },
]

onMounted(() => {
  store.loadDashboard()
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background: #f4f6fa;
  min-height: calc(100vh - 60px);
  font-family: 'Segoe UI', sans-serif;
  position: relative;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(244, 246, 250, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e0e0e0;
  border-top-color: #6c63ff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-banner {
  background: #fff0f0;
  border: 1px solid #f5c6c6;
  border-radius: 10px;
  color: #c0392b;
  padding: 10px 16px;
  font-size: 13px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-banner button {
  background: #e05260;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
}

.empty-state {
  font-size: 12px;
  color: #aaa;
  padding: 12px 0;
  text-align: center;
}

.activity-item.unread .activity-text { font-weight: 600; }

.welcome-card {
  background: linear-gradient(135deg, #0f3a4f 0%, #1a5568 100%);
  border-radius: 16px;
  padding: 15px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
}

.welcome-text h1 { color: #fff; font-size: 20px; font-weight: 700; margin: 0 0 8px; }
.welcome-text p  { color: rgba(255,255,255,0.6); font-size: 13px; max-width: 440px; line-height: 1.6; margin: 0 0 18px; }
.header-actions  { display: flex; gap: 10px; }

.btn-primary {
  background: #e5b230; color: #0f3a4f; border: none;
  border-radius: 8px; padding: 9px 18px; font-size: 13px;
  font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;
}

.btn-outline {
  background: transparent; color: #fff;
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 8px; padding: 9px 18px; font-size: 13px; cursor: pointer;
}

.welcome-illustration { position: relative; width: 200px; height: 160px; flex-shrink: 0; }
.deco-circle { position: absolute; border-radius: 50%; }
.deco-1 { width: 160px; height: 160px; background: rgba(67,184,156,0.5); top: -20px; right: -20px; }
.deco-2 { width: 110px; height: 110px; background: rgba(80,50,40,0.6); bottom: -30px; right: 40px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.stat-card { background: #fff; border-radius: 14px; padding: 16px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.stat-top  { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
.stat-value { font-size: 28px; font-weight: 700; color: #1a1f36; line-height: 1; }
.stat-icon-box { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.stat-label { font-size: 11px; color: #888; margin-bottom: 4px; line-height: 1.3; }
.stat-trend { font-size: 11px; }
.trend-green { color: #43b89c; }

.dashboard-body { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
.left-col, .right-col { display: flex; flex-direction: column; gap: 20px; }

.card { background: #fff; border-radius: 14px; padding: 20px 22px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-header h2 { font-size: 14px; font-weight: 700; color: #1a1f36; margin: 0; }
.btn-add { background: none; border: none; color: #f9a825; font-size: 13px; font-weight: 600; cursor: pointer; }

.project-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.project-item:last-child { border-bottom: none; }
.project-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.project-info { flex: 1; }
.project-name { font-size: 13px; color: #1a1f36; margin-bottom: 2px; }
.project-meta { font-size: 11px; color: #aaa; margin-bottom: 6px; }
.project-tags { display: flex; gap: 5px; flex-wrap: wrap; }

.tag { font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
.tag-personal  { background: #e8eaff; color: #6c63ff; }
.tag-validated { background: #e6f7f3; color: #43b89c; }
.tag-stage     { background: #fff3e0; color: #f9a825; }
.tag-tech      { background: #f0f0f0; color: #555; }

.reco-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.reco-item:last-child { border-bottom: none; }
.reco-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.reco-info { flex: 1; font-size: 12px; color: #333; }
.reco-name { margin-bottom: 2px; }
.reco-text { color: #666; }
.reco-date { font-size: 11px; color: #aaa; }

.status-badge { font-size: 10px; padding: 3px 10px; border-radius: 20px; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
.status-badge.published { background: #e6f7f3; color: #43b89c; }
.status-badge.pending   { background: #fff3e0; color: #f9a825; }

.activity-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; align-items: flex-start; }
.activity-item:last-child { border-bottom: none; }
.activity-dot { width: 9px; height: 9px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.activity-text { font-size: 12px; color: #444; }
.activity-time { font-size: 11px; color: #bbb; margin-top: 2px; }
</style>