<template>
  <div class="recommendations-page">

    <div class="page-header">
      <h1>Mes recommandations</h1>
      <p>
        Consultez les recommandations que vous avez envoyées aux étudiants.
      </p>
    </div>

    <div v-if="loading" class="loading">
      Chargement...
    </div>

    <template v-else>

      <div
        v-if="recommendations.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          ⭐
        </div>

        <h2>Aucune recommandation</h2>

        <p>
          Vous n'avez encore envoyé aucune recommandation.
        </p>

        <button
          class="primary-btn"
          @click="goToSearch"
        >
          Explorer les talents
        </button>
      </div>

      <div
        v-else
        class="recommendations-list"
      >
        <div
          v-for="item in recommendations"
          :key="item.id"
          class="recommendation-card"
        >
          <div class="card-header">
            <h3>{{ item.studentName }}</h3>

            <span
              class="status"
              :class="item.status?.toLowerCase()"
            >
              {{ item.status }}
            </span>
          </div>

          <p class="message">
            {{ item.message }}
          </p>

          <div class="date">
            {{ formatDate(item.date) }}
          </div>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)

const recommendations = ref([])

/*
Plus tard :

import { getMyRecommendations }
from '@/services/recommendationApi'

recommendations.value =
await getMyRecommendations()
*/

function goToSearch() {
  router.push('/pro/recherche-talents')
}

function formatDate(date) {

  if (!date) return ''

  return new Date(date).toLocaleDateString('fr-FR')
}

onMounted(async () => {

  loading.value = true

  try {

    // API plus tard

    recommendations.value = []

  } catch (error) {

    console.error(error)

  } finally {

    loading.value = false
  }
})
</script>

<style scoped>

.recommendations-page {
  padding: 30px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #0f3d56;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
}

.loading {
  text-align: center;
  padding: 50px;
}

.empty-state {
  background: white;
  border-radius: 16px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.empty-state h2 {
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.primary-btn {
  background: #eab308;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.recommendations-list {
  display: grid;
  gap: 20px;
}

.recommendation-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.validated {
  background: #dcfce7;
  color: #166534;
}

.status.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.message {
  margin-bottom: 15px;
  color: #444;
}

.date {
  color: #888;
  font-size: 13px;
}

</style>