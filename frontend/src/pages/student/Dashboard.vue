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
          <h2>Bonjour Ahmed <span>👋</span></h2>
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

