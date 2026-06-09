<template>
  <div class="dashboard">

    <!-- Welcome Banner -->
    <div class="welcome-card">
      <div class="welcome-text">
        <h1>Bonjour, {{ user?.name ? 'M. ' + user.name : 'M. Ghailani' }}</h1>
        <p>Ajoutez vos projets, stages et compétences pour obtenir un portfolio validé par votre institution. Impressionnez les recruteurs avec des preuves vérifiables.</p>
        <div class="header-actions">
          <button class="btn-primary"><Eye size="14" /> Parcourir les portfolios</button>
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
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-top">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-icon-box" :style="{ background: stat.iconBg }">
            <component :is="stat.icon" :size="16" :color="stat.iconColor" />
          </div>
        </div>
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-trend" :class="stat.trendColor">{{ stat.trend }}</div>
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
          <div class="project-list">
            <div class="project-item" v-for="p in pendingProjects" :key="p.id">
              <div class="project-avatar" :style="{ background: p.color }">{{ p.initials }}</div>
              <div class="project-info">
                <div class="project-name">
                  <strong>{{ p.student }}</strong> – {{ p.title }}
                </div>
                <div class="project-meta">{{ p.stack }} · soumis {{ p.date }}</div>
                <div class="project-tags">
                  <span class="tag" v-for="tag in p.tags" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
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
          <div class="reco-list">
            <div class="reco-item" v-for="r in recommendations" :key="r.id">
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
          <div class="activity-list">
            <div class="activity-item" v-for="a in recentActivity" :key="a.id">
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
import { computed } from 'vue'
import { useAuthStore } from '../../store/authStore'
import { Eye, Mail, MessageCircle, Star, PlusCircle, CheckCircle } from 'lucide-vue-next'

const auth = useAuthStore()
const user = computed(() => auth.user)

const stats = [
  { label: 'Projet soumis',             value: 12, icon: PlusCircle,    iconBg: '#eef0ff', iconColor: '#6c63ff', trend: '+4 cette semaine', trendColor: 'trend-green' },
  { label: 'Projets validés',            value: 31, icon: CheckCircle,   iconBg: '#e6f7f3', iconColor: '#43b89c', trend: '+5 ce mois',       trendColor: 'trend-green' },
  { label: 'Lettres de recommandations', value: 15, icon: Mail,          iconBg: '#fff3e0', iconColor: '#f9a825', trend: '+3 cette semaine', trendColor: 'trend-green' },
  { label: 'Commentaires écrits',        value: 57, icon: MessageCircle, iconBg: '#f0f4ff', iconColor: '#6c63ff', trend: '+3 cette semaine', trendColor: 'trend-green' },
  { label: 'Recommandation données',     value: 31, icon: Star,          iconBg: '#fffbe6', iconColor: '#e5b230', trend: '+5 ce mois',       trendColor: 'trend-green' },
]

const pendingProjects = [
  { id: 1, initials: 'AA', color: '#6c63ff', student: 'Ahmed Alami',     title: "Système d'authentification sécurisé", stack: 'Java · Spring Boot · PostgreSQL', date: 'hier',      tags: ['Projet personnel'] },
  { id: 2, initials: 'SB', color: '#ff6584', student: 'Sara Benali',     title: "Dashboard d'analyse des données",    stack: 'Vue.js · Node.js · MongoDB',     date: 'il y a 3h', tags: ['Python', 'Machine Learning', 'Projet validé'] },
  { id: 3, initials: 'YK', color: '#43b89c', student: 'Youssef Khalil',  title: 'Game Logiciel · FST Fès',            stack: 'React · Node.js',                date: 'il y a 5h', tags: ['React', 'Node.js', 'Stage en cours'] },
  { id: 4, initials: 'LM', color: '#f9a825', student: 'Leila Moussaoui', title: 'Cybersécurité – INSEA Rabat',        stack: 'Linux · Pentest',                date: 'il y a 1j', tags: ['Linux', 'Pentest', 'Projet validé'] },
]

const recommendations = [
  { id: 1, initials: 'AA', color: '#6c63ff', student: 'Ahmed Alami',     text: 'Très bon niveau technique, autonome et rigoureux.',        date: '12 mars 2026', status: 'published', statusLabel: 'Publiée' },
  { id: 2, initials: 'SB', color: '#ff6584', student: 'Sara Benali',     text: 'Excellente en data, livrable de qualité professionnelle.', date: '5 fév. 2026',  status: 'published', statusLabel: 'Publiée' },
  { id: 3, initials: 'LM', color: '#f9a825', student: 'Leila Moussaoui', text: 'Profil rare en cybersécurité, hautement recommandée.',     date: '30 jan. 2026', status: 'pending',   statusLabel: 'En attente' },
]

const recentActivity = [
  { id: 1, color: '#6c63ff', text: 'Portfolio <strong>Omar Mellouki</strong> consulté', time: 'il y a 20 min' },
  { id: 2, color: '#43b89c', text: 'Commentaire sur <strong>Sara Benali</strong>',      time: 'il y a 1h' },
  { id: 3, color: '#f9a825', text: 'Recommandation <strong>Ahmed Alami</strong>',        time: 'il y a 3h' },
]

function tagClass(tag) {
  if (tag === 'Projet validé')    return 'tag-validated'
  if (tag === 'Stage en cours')   return 'tag-stage'
  if (tag === 'Projet personnel') return 'tag-personal'
  return 'tag-tech'
}
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background: #f4f6fa;
  min-height: calc(100vh - 60px);
  font-family: 'Segoe UI', sans-serif;
}

/* Welcome */
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

.welcome-text h1 {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
}

.welcome-text p {
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  max-width: 440px;
  line-height: 1.6;
  margin: 0 0 18px;
}

.header-actions { display: flex; gap: 10px; }

.btn-primary {
  background: #e5b230;
  color: #0f3a4f;
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-outline {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 13px;
  cursor: pointer;
}

.welcome-illustration {
  position: relative;
  width: 200px;
  height: 160px;
  flex-shrink: 0;
}

.deco-circle { position: absolute; border-radius: 50%; }
.deco-1 { 
  width: 160px; 
  height: 160px; 
  background: rgba(67,184,156,0.5); 
  top: -20px; 
  right: -20px; 
}
.deco-2 { 
  width: 110px; 
  height: 110px; 
  background: rgba(80,50,40,0.6);  
  bottom: -30px;  
   right: 40px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.stat-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1f36;
  line-height: 1;
}

.stat-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.stat-label {
  font-size: 11px;
  color: #888;
  margin-bottom: 4px;
  line-height: 1.3;
}

.stat-trend { font-size: 11px; }
.trend-green { color: #43b89c; }
.trend-red   { color: #e05260; }

/* Layout */
.dashboard-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

.left-col, .right-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Cards */
.card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-header h2 {
  font-size: 14px;
  font-weight: 700;
  color: #1a1f36;
  margin: 0;
}

.btn-add {
  background: none;
  border: none;
  color: #f9a825;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* Projects */
.project-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.project-item:last-child { border-bottom: none; }

.project-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.project-info { flex: 1; }
.project-name { font-size: 13px; color: #1a1f36; margin-bottom: 2px; }
.project-meta { font-size: 11px; color: #aaa; margin-bottom: 6px; }
.project-tags { display: flex; gap: 5px; flex-wrap: wrap; }

.tag { font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
.tag-personal  { background: #e8eaff; color: #6c63ff; }
.tag-validated { background: #e6f7f3; color: #43b89c; }
.tag-stage     { background: #fff3e0; color: #f9a825; }
.tag-tech      { background: #f0f0f0; color: #555; }

/* Recommendations */
.reco-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.reco-item:last-child { border-bottom: none; }

.reco-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.reco-info { flex: 1; font-size: 12px; color: #333; }
.reco-name { margin-bottom: 2px; }
.reco-text { color: #666; }
.reco-date { font-size: 11px; color: #aaa; }

.status-badge {
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.status-badge.published { background: #e6f7f3; color: #43b89c; }
.status-badge.pending   { background: #fff3e0; color: #f9a825; }

/* Activity */
.activity-item {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: flex-start;
}
.activity-item:last-child { border-bottom: none; }

.activity-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.activity-text { font-size: 12px; color: #444; }
.activity-time { font-size: 11px; color: #bbb; margin-top: 2px; }
</style>