<template>
  <div class="admin-statistics-page">
    <AdminSidebar />

    <div class="admin-main">
      <AdminTopbar title="Statistiques avancees" />

      <main class="admin-content">
        <section class="page-header">
          <div>
            <h1>Analytics de la plateforme</h1>
          </div>

          <select v-model="selectedPeriod" class="period-select">
            <option value="30">30 derniers jours</option>
            <option value="90">3 mois</option>
            <option value="365">Annee</option>
          </select>
        </section>

        <section class="stats-grid">
          <div
            v-for="stat in currentStats"
            :key="stat.label"
            class="stat-card"
          >
            <p>{{ stat.label }}</p>
            <h2>{{ stat.value }}</h2>
            <span>+{{ stat.growth }}% vs mois precedent</span>
          </div>
        </section>

        <section class="chart-card">
          <div class="card-header">
            <h2>Evolution des inscriptions ({{ periodLabel }})</h2>
            <p>Nouvelles inscriptions par jour</p>
          </div>

          <div class="chart-wrapper">
            <svg viewBox="0 0 900 250" class="line-chart" preserveAspectRatio="none">
              <line x1="80" y1="35" x2="820" y2="35" class="grid-line" />
              <line x1="80" y1="90" x2="820" y2="90" class="grid-line" />
              <line x1="80" y1="145" x2="820" y2="145" class="grid-line" />
              <line x1="80" y1="200" x2="820" y2="200" class="grid-line" />

              <text x="55" y="40" class="axis-text">50</text>
              <text x="55" y="95" class="axis-text">40</text>
              <text x="55" y="150" class="axis-text">20</text>
              <text x="60" y="205" class="axis-text">0</text>

              <polygon :points="areaPoints" class="chart-area" />
              <polyline :points="linePoints" class="chart-line" />

              <circle
                v-for="point in chartPoints"
                :key="point.x"
                :cx="point.x"
                :cy="point.y"
                r="4"
                class="chart-dot"
              />

              <circle
                :cx="highlightPoint.x"
                :cy="highlightPoint.y"
                r="6"
                class="highlight-dot"
              />

              <text x="80" y="235" class="axis-text">{{ chartLabels[0] }}</text>
              <text x="370" y="235" class="axis-text">{{ chartLabels[1] }}</text>
              <text x="585" y="235" class="axis-text">{{ chartLabels[2] }}</text>
              <text x="770" y="235" class="axis-text">{{ chartLabels[3] }}</text>
            </svg>
          </div>
        </section>

        <section class="bottom-grid">
          <div class="panel">
            <h2>Top 5 ecoles actives</h2>

            <div class="schools-list">
              <div
                v-for="school in topSchools"
                :key="school.name"
                class="school-row"
              >
                <div class="school-header">
                  <span>{{ school.name }}</span>
                  <strong>{{ school.students }}</strong>
                </div>

                <div class="progress">
                  <div
                    class="progress-fill"
                    :class="school.color"
                    :style="{ width: school.percent + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel repartition-panel">
            <h2>Repartition par filiere</h2>

            <div class="donut-section">
              <div class="donut"></div>

              <div class="legend">
                <div
                  v-for="field in fields"
                  :key="field.name"
                  class="legend-row"
                >
                  <div class="legend-left">
                    <span class="legend-color" :class="field.color"></span>
                    <span>{{ field.name }}</span>
                  </div>

                  <strong>{{ field.percent }}%</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { useEstablishmentStore } from '@/store/admin/establishmentsStore'
import { useAdminStatsStore } from '@/store/admin/adminStatsStore'

const establishmentStore = useEstablishmentStore()
const statsStore = useAdminStatsStore()

onMounted(async () => {
  await Promise.all([
    establishmentStore.fetchEstablishments(),
    statsStore.fetchStats()
  ])
})

const selectedPeriod = ref('30')

const chartValuesByPeriod = {
  30: [5, 10, 15, 25, 20, 38, 34, 40, 43, 39, 46, 41, 49, 44, 48],
  90: [18, 22, 29, 35, 31, 42, 48, 44, 52, 58, 54, 61, 66, 63, 70],
  365: [35, 42, 50, 58, 55, 68, 72, 78, 82, 88, 92, 98, 105, 112, 118]
}

const chartLabelsByPeriod = {
  30: ['1 juin', '8 juin', '15 juin', '22 juin'],
  90: ['Mars', 'Avr', 'Mai', 'Juin'],
  365: ['2025', '2026', '2026', '2026']
}

const currentStats = computed(() => {
  return statsStore.stats
})

const periodLabel = computed(() => {
  if (selectedPeriod.value === '30') return '30 jours'
  if (selectedPeriod.value === '90') return '3 mois'
  return 'annee'
})

const chartLabels = computed(() => {
  return chartLabelsByPeriod[selectedPeriod.value]
})

const chartPoints = computed(() => {
  const values = chartValuesByPeriod[selectedPeriod.value]
  const maxValue = Math.max(...values)
  const minValue = 0
  const startX = 80
  const endX = 820
  const topY = 35
  const bottomY = 200
  const stepX = (endX - startX) / (values.length - 1)

  return values.map((value, index) => {
    const x = startX + index * stepX
    const percent = (value - minValue) / (maxValue - minValue)
    const y = bottomY - percent * (bottomY - topY)

    return {
      x,
      y
    }
  })
})

const linePoints = computed(() => {
  return chartPoints.value.map((point) => `${point.x},${point.y}`).join(' ')
})

const areaPoints = computed(() => {
  const points = chartPoints.value.map((point) => `${point.x},${point.y}`).join(' ')
  return `80,200 ${points} 820,200`
})

const highlightPoint = computed(() => {
  return chartPoints.value[12] || chartPoints.value[chartPoints.value.length - 1]
})

const topSchools = computed(() => {
  const schools = [...establishmentStore.establishments]
    .sort((a, b) => b.students - a.students)
    .slice(0, 5)

  const maxStudents = schools[0]?.students || 1
  const colors = ['dark', 'orange', 'green', 'purple', 'red']

  return schools.map((school, index) => ({
    ...school,
    percent: Math.round((school.students / maxStudents) * 100),
    color: colors[index]
  }))
})

const fields = computed(() => {
  const colors = ['dark', 'orange', 'green', 'purple', 'red']
  return statsStore.branches.map((b, index) => ({
    ...b,
    color: colors[index % colors.length]
  }))
})
</script>

<style scoped>
.admin-statistics-page {
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
  padding: 20px 22px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.page-header h1 {
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 900;
}

.period-select {
  height: 36px;
  min-width: 155px;
  border: 1px solid #dce4ea;
  border-radius: 7px;
  background: #fff;
  color: #000;
  padding: 0 13px;
  outline: none;
  font-weight: 500;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 13px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 8px;
  padding: 16px;
  min-height: 92px;
}

.stat-card p {
  margin: 0;
  color: #4f6780;
  font-size: 12px;
}

.stat-card h2 {
  margin: 5px 0 0;
  color: #000;
  font-size: 28px;
  font-weight: 900;
}

.stat-card span {
  color: #00a862;
  font-size: 12px;
}

.chart-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 18px;
  margin-bottom: 16px;
}

.card-header h2 {
  margin: 0;
  color: #000;
  font-size: 17px;
  font-weight: 900;
}

.card-header p {
  margin: 5px 0 0;
  color: #526b82;
  font-size: 12px;
}

.chart-wrapper {
  height: 235px;
  margin-top: 12px;
}

.line-chart {
  width: 100%;
  height: 100%;
}

.grid-line {
  stroke: #edf0f3;
  stroke-width: 1;
}

.axis-text {
  fill: #6a7b8d;
  font-size: 11px;
}

.chart-area {
  fill: rgba(249, 179, 27, 0.12);
}

.chart-line {
  fill: none;
  stroke: #f5a400;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-dot {
  fill: #f5a400;
}

.highlight-dot {
  fill: #062f4f;
  stroke: #f5a400;
  stroke-width: 3;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.panel {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 20px 18px;
  min-height: 255px;
}

.panel h2 {
  margin: 0 0 15px;
  color: #000;
  font-size: 17px;
  font-weight: 900;
}

.schools-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.school-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: #000;
  font-size: 14px;
}

.school-header strong {
  color: #000;
  font-weight: 900;
}

.progress {
  height: 6px;
  background: #e3e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
}

.progress-fill.dark {
  background: #062f4f;
}

.progress-fill.orange {
  background: #f9b31b;
}

.progress-fill.green {
  background: #22c47b;
}

.progress-fill.purple {
  background: #6266f1;
}

.progress-fill.red {
  background: #e52525;
}

.repartition-panel {
  display: flex;
  flex-direction: column;
}

.donut-section {
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
}

.donut {
  width: 105px;
  height: 105px;
  border-radius: 50%;
  background: conic-gradient(
    #062f4f 0% 40%,
    #f9b31b 40% 70%,
    #22c47b 70% 90%,
    #6266f1 90% 100%
  );
  position: relative;
  flex-shrink: 0;
}

.donut::after {
  content: "";
  position: absolute;
  inset: 22px;
  background: #fff;
  border-radius: 50%;
}

.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #000;
  font-size: 14px;
}

.legend-left {
  display: flex;
  align-items: center;
  gap: 9px;
}

.legend-color {
  width: 11px;
  height: 11px;
  border-radius: 3px;
}

.legend-color.dark {
  background: #062f4f;
}

.legend-color.orange {
  background: #f9b31b;
}

.legend-color.green {
  background: #22c47b;
}

.legend-color.purple {
  background: #6266f1;
}

.legend-row strong {
  color: #000;
  font-weight: 900;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .admin-statistics-page {
    flex-direction: column;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .donut-section {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
