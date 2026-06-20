<script setup>
import { computed, ref, onMounted } from 'vue'
import { api } from '@/store/authStore.js'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

const obtainedBadges = ref([])
const lockedBadges = ref([])
const loading = ref(true)

async function loadBadges() {
  loading.value = true
  try {
    const res = await api.get('/badges/me')
    obtainedBadges.value = res.data.obtained.map(b => ({
      title: b.nom,
      subtitle: b.description,
      color: b.couleur || 'gold',
      date: 'Obtenu'
    }))
    lockedBadges.value = res.data.locked.map(b => ({
      title: b.nom,
      subtitle: b.description
    }))
  } catch (e) {
    console.error('Erreur chargement badges', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadBadges)

const unlockedBadgesCount = computed(() => obtainedBadges.value.length)
const totalBadgesCount = computed(() => obtainedBadges.value.length + lockedBadges.value.length)
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Badges" />

      <main class="badges-page" v-if="!loading">
        <section class="page-title">
          <h2>Badges de competences</h2>
          <p>
            {{ unlockedBadgesCount }} badges debloque sur {{ totalBadgesCount }} disponibles
          </p>
        </section>

        <section class="level-card">
          <div class="level-icon"></div>

          <div class="level-info">
            <h3>Niveau actuel : {{ unlockedBadgesCount > 5 ? 'Expert' : 'Intermediaire' }}</h3>
            <p>Continuez a valider vos competences pour gagner plus de badges</p>

            <div class="level-progress">
              <span :style="{ width: (unlockedBadgesCount / Math.max(1, totalBadgesCount) * 100) + '%' }"></span>
            </div>
          </div>
        </section>

        <section class="badges-section" v-if="obtainedBadges.length > 0">
          <h3>Badges obtenus ({{ unlockedBadgesCount }})</h3>

          <div class="badges-grid">
            <div
              v-for="badge in obtainedBadges"
              :key="badge.title"
              class="badge-card"
            >
              <div :class="['badge-circle', badge.color]"></div>

              <h4>{{ badge.title }}</h4>
              <p>{{ badge.subtitle }}</p>

              <span class="badge-date gold">
                {{ badge.date }}
              </span>
            </div>
          </div>
        </section>

        <section class="badges-section" v-if="lockedBadges.length > 0">
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
      
      <div v-else class="loading">Chargement des badges...</div>
    </div>
  </div>
</template>

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

.badges-page {
  padding: 32px 38px 60px;
}

.page-title {
  margin-bottom: 22px;
}

.page-title h2 {
  margin: 0 0 8px;
  font-size: 30px;
  font-weight: 800;
  color: #050505;
}

.page-title p {
  margin: 0;
  color: #64748b;
  font-size: 17px;
}

.level-card {
  background: linear-gradient(90deg, #0f3a4f, #123f4b);
  border-radius: 16px;
  padding: 22px 26px;
  display: flex;
  align-items: center;
  gap: 24px;
  color: #ffffff;
  margin-bottom: 26px;
}

.level-icon {
  width: 84px;
  height: 84px;
  border-radius: 14px;
  background: #f0a91f;
  flex-shrink: 0;
}

.level-info {
  width: 100%;
}

.level-info h3 {
  margin: 0 0 8px;
  font-size: 23px;
  font-weight: 800;
}

.level-info p {
  margin: 0 0 12px;
  font-size: 16px;
  color: #ffffff;
}

.level-progress {
  width: 55%;
  height: 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.level-progress span {
  display: block;
  width: 60%;
  height: 100%;
  background: #f0a91f;
}

.badges-section {
  margin-bottom: 28px;
}

.badges-section h3 {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 800;
  color: #050505;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.badge-card {
  min-height: 205px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 22px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.badge-card.small {
  min-height: 140px;
}

.badge-circle {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  margin-bottom: 18px;
}

.badge-circle.gold {
  background: linear-gradient(135deg, #ffe5aa, #f0a91f);
}

.badge-circle.green {
  background: linear-gradient(135deg, #bdebdc, #078143);
}

.badge-circle.blue {
  background: linear-gradient(135deg, #cde7ff, #1d70b8);
}

.badge-circle.gray {
  background: #eeeeee;
}

.badge-card h4 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 800;
  color: #050505;
}

.badge-card p {
  margin: 0 0 12px;
  color: #64748b;
  font-size: 14px;
}

.badge-date {
  font-size: 13px;
  font-weight: 700;
}

.badge-date.gold {
  color: #f59e0b;
}

.badge-date.green {
  color: #078143;
}

.badge-date.blue {
  color: #1d4ed8;
}

.locked h4,
.locked p,
.locked .progress-text {
  color: #a3a3a3;
}

.small-progress {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
  margin: 6px 0 8px;
}

.small-progress span {
  display: block;
  height: 100%;
  background: #f2c56b;
}

.progress-text {
  font-size: 13px;
  color: #a3a3a3;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .level-progress {
    width: 80%;
  }
}

@media (max-width: 700px) {
  .badges-page {
    padding: 22px;
  }

  .level-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .level-progress {
    width: 100%;
  }

  .badges-grid {
    grid-template-columns: 1fr;
  }
}
</style>