<script setup>
import { computed } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

import { obtainedBadges, lockedBadges } from '../../data/mockData.js'

const unlockedBadges = computed(() => {
  return obtainedBadges.filter((badge) => !badge.locked).length
})

const totalBadges = computed(() => {
  return obtainedBadges.length + lockedBadges.length
})
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Badges" user-initials="AA" />

      <main class="badges-page">
        <section class="page-title">
          <h2>Badges de competences</h2>
          <p>
            {{ unlockedBadges }} badges debloque sur {{ totalBadges }} disponibles
          </p>
        </section>

        <section class="level-card">
          <div class="level-icon"></div>

          <div class="level-info">
            <h3>Niveau actuel : Avance</h3>
            <p>Plus que 2 badges pour atteindre le niveau Expert</p>

            <div class="level-progress">
              <span></span>
            </div>
          </div>
        </section>

        <section class="badges-section">
          <h3>Badges obtenus ({{ unlockedBadges }})</h3>

          <div class="badges-grid">
            <div
              v-for="badge in obtainedBadges"
              :key="badge.title"
              :class="['badge-card', { locked: badge.locked }]"
            >
              <div :class="['badge-circle', badge.color]"></div>

              <h4>{{ badge.title }}</h4>
              <p>{{ badge.subtitle }}</p>

              <span
                v-if="badge.date"
                :class="['badge-date', badge.color]"
              >
                {{ badge.date }}
              </span>

              <div v-if="badge.locked" class="small-progress">
                <span :style="{ width: badge.progressValue + '%' }"></span>
              </div>

              <span v-if="badge.progress" class="progress-text">
                {{ badge.progress }}
              </span>
            </div>
          </div>
        </section>

        <section class="badges-section">
          <h3>A debloquer ({{ lockedBadges.length }})</h3>

          <div class="badges-grid">
            <div
              v-for="badge in lockedBadges"
              :key="badge.title"
              class="badge-card locked small"
            >
              <div class="badge-circle gray"></div>

              <h4>{{ badge.title }}</h4>
              <p>{{ badge.subtitle }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

