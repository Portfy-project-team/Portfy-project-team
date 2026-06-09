<script setup>
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatCard from '../../components/student/StatCard.vue'

import {
  dashboardStats,
  scoreDetails,
  recentActivities
} from '../../data/mockData.js'
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Dashboard" user-initials="AA" />

      <main class="dashboard-page">
        <section class="welcome-section">
          <h2>Bonjour Ahmed</h2>
          <p>Voici un apercu de votre activite et progression</p>
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
              <h3>Score de credibilite</h3>
              <p>Detail de votre score sur 100</p>
            </div>

            <div class="score-content">
              <div class="score-circle">
                <div>
                  <strong>82</strong>
                  <span>Avance</span>
                </div>
              </div>

              <div class="score-lines">
                <div
                  v-for="item in scoreDetails"
                  :key="item.label"
                  class="score-line"
                >
                  <div class="score-line-header">
                    <span>{{ item.label }} ({{ item.max }}%)</span>
                    <strong>{{ item.percent }}%</strong>
                  </div>

                  <div class="progress-bar">
                    <span :style="{ width: item.percent * 5 + '%' }"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="recent-card">
            <div class="card-title">
              <h3>Activite recente</h3>
              <p>Vos dernieres actions</p>
            </div>

            <div class="recent-list">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="recent-item"
              >
                <span :class="['recent-dot', activity.color]"></span>

                <div>
                  <p v-html="formatActivity(activity.text)"></p>
                  <small>{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    formatActivity(text) {
      return text
        .replace('API REST', '<strong>API REST</strong>')
        .replace('Pr. Benali', '<strong>Pr. Benali</strong>')
        .replace('Web Developer', '<strong>Web Developer</strong>')
        .replace('OCP Group', '<strong>OCP Group</strong>')
    }
  }
}
</script>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f1ec;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f4f1ec;
}

.dashboard-page {
  padding: 32px 38px 60px;
}

.welcome-section {
  margin-bottom: 24px;
}

.welcome-section h2 {
  margin: 0 0 8px;
  font-size: 30px;
  font-weight: 800;
  color: #050505;
}

.welcome-section p {
  margin: 0;
  color: #64748b;
  font-size: 17px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
  margin-bottom: 26px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 22px;
}

.score-card,
.recent-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 26px;
}

.card-title h3 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 800;
  color: #050505;
}

.card-title p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.score-content {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 34px;
  align-items: center;
  margin-top: 34px;
}

.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #082a47;
  border: 6px solid #f0a91f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.score-circle div {
  text-align: center;
}

.score-circle strong {
  display: block;
  font-size: 38px;
  font-weight: 900;
  line-height: 1;
}

.score-circle span {
  color: #f0a91f;
  font-size: 14px;
  font-weight: 800;
}

.score-lines {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.score-line-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  color: #334155;
  font-size: 15px;
}

.score-line-header strong {
  color: #050505;
}

.progress-bar {
  height: 8px;
  width: 100%;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: #082a47;
  border-radius: 999px;
}

.recent-list {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recent-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.recent-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.recent-dot.green {
  background: #10b981;
}

.recent-dot.orange {
  background: #f59e0b;
}

.recent-dot.purple {
  background: #6366f1;
}

.recent-dot.blue {
  background: #0b78a8;
}

.recent-item p {
  margin: 0 0 4px;
  font-size: 16px;
  color: #050505;
}

.recent-item small {
  color: #64748b;
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
  .dashboard-page {
    padding: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .score-content {
    grid-template-columns: 1fr;
  }
}
</style>
