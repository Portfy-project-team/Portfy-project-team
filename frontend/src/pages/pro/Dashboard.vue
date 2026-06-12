<template>
  <div class="dashboard">

    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
    </div>

    <div v-else>

      <!-- Bannière -->
      <section class="welcome-banner">
        <div class="welcome-content">
          <span class="badge">
            Professionnel vérifié
          </span>

          <h1>
            Bonjour, {{ user?.name || 'Professionnel' }}
          </h1>

          <p>
            Bienvenue dans votre espace Portfy.
            Découvrez des talents certifiés, consultez leurs projets validés
            et trouvez votre futur stagiaire ou collaborateur.
          </p>

          <div class="banner-actions">
          <button
  class="primary-btn"
  @click="router.push('/pro/recherche-talents')"
>
  Explorer les talents
</button>

          <button
  class="secondary-btn"
  @click="router.push('/pro/recommandations')"
>
  Voir les recommandations
</button>
          </div>
        </div>
      </section>

      <!-- Statistiques -->
      <section class="stats-grid">

        <div
          v-for="stat in stats"
          :key="stat.key"
          class="stat-card"
        >
          <div class="stat-label">
            {{ stat.label }}
          </div>

          <div class="stat-value">
            {{ stat.value }}
          </div>

          <div class="stat-trend">
            {{ stat.trend }}
          </div>
        </div>

      </section>

      <!-- Actions rapides -->
      <section class="quick-actions">

        <div class="action-card">
          <h3>Recherche avancée</h3>

          <p>
            Filtrez les étudiants selon leurs compétences,
            projets et établissements.
          </p>

          <button
            class="link-btn"
            @click="router.push('/student/reseau')"
          >
            Commencer →
          </button>
        </div>

        <div class="action-card">
          <h3>Profils consultés</h3>

          <p>
            Retrouvez rapidement les profils visités.
          </p>

          <button class="link-btn">
            Consulter →
          </button>
        </div>

        <div class="action-card">
          <h3>Recommandations</h3>

          <p>
            Découvrez les talents recommandés pour vous.
          </p>

          <button class="link-btn">
            Découvrir →
          </button>
        </div>

      </section>

      <!-- Bloc principal -->
      <section class="search-banner">

        <div>
          <h2>
            Trouvez votre futur stagiaire ou collaborateur
          </h2>

          <p>
            Accédez à des milliers de profils certifiés et consultez leurs projets validés.
          </p>

          <button
            class="search-btn"
            @click="router.push('/student/reseau')"
          >
            Accéder à la recherche
          </button>
        </div>

      </section>

    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/store/dashboardStore.js'

const router = useRouter()
const store = useDashboardStore()

const loading = computed(() => store.loading)
const user = computed(() => store.user)
const stats = computed(() => store.stats)

onMounted(() => {
  store.loadDashboard()
})
</script>

<style scoped>
.dashboard {
  padding: 30px;
  background: #f4f6f9;
  min-height: 100vh;
}

/* Loading */

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid #ddd;
  border-top: 4px solid #e4b52c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Bannière */

.welcome-banner {
  background: linear-gradient(135deg, #0e3c57, #154766);
  color: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
}

.badge {
  display: inline-block;
  background: #e4b52c;
  color: #123;
  padding: 8px 14px;
  border-radius: 30px;
  font-weight: 600;
  margin-bottom: 20px;
}

.welcome-banner h1 {
  font-size: 42px;
  margin-bottom: 15px;
}

.welcome-banner p {
  font-size: 18px;
  line-height: 1.6;
  color: #d8e0e7;
}

.banner-actions {
  margin-top: 25px;
}

.primary-btn,
.secondary-btn,
.search-btn {
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.primary-btn {
  background: #e4b52c;
  color: #123;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: bold;
  margin-right: 10px;
}

.primary-btn:hover {
  background: #d3a51c;
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 1px solid rgba(255,255,255,0.4);
  padding: 12px 24px;
  border-radius: 10px;
}

/* Stats */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}

.stat-label {
  color: #666;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 34px;
  font-weight: bold;
}

.stat-trend {
  color: #27ae60;
  margin-top: 10px;
}

/* Actions */

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(280px,1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}

.action-card h3 {
  margin-bottom: 15px;
  color: #0e3c57;
}

.action-card p {
  color: #666;
  margin-bottom: 20px;
}

.link-btn {
  background: none;
  border: none;
  color: #e4b52c;
  font-weight: bold;
  cursor: pointer;
}

/* Bloc recherche */

.search-banner {
  background: linear-gradient(135deg, #e4b52c, #f0c84d);
  padding: 40px;
  border-radius: 20px;
}

.search-banner h2 {
  font-size: 32px;
  margin-bottom: 15px;
  color: #0e3c57;
}

.search-banner p {
  margin-bottom: 25px;
  color: #333;
  font-size: 17px;
}

.search-btn {
  background: #0e3c57;
  color: white;
  padding: 14px 30px;
  border-radius: 10px;
}

.search-btn:hover {
  background: #0a3045;
}

/* Responsive */

@media (max-width: 768px) {
  .welcome-banner h1 {
    font-size: 30px;
  }

  .dashboard {
    padding: 15px;
  }

  .search-banner h2 {
    font-size: 24px;
  }
}
</style>