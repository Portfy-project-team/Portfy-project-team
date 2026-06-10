<template>
  <div class="professor-layout">
    <Sidebar :user="user" :comment-count="3" />
    <div class="main-content">
      <Topbar title="Portfolios consultés" />

      <div class="page-content">
        <div class="page-header">
          <div>
            <h2 class="page-title">Portfolios consultés</h2>
            <p class="page-subtitle">Historique des portfolios que vous avez visités</p>
          </div>
          <div class="header-right">
            <div class="search-box">
              <Search size="18" />
              <input v-model="search" type="text" placeholder="Rechercher..." />
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon blue"><Eye size="20" /></div>
            <div>
              <p class="stat-label">Total consultés</p>
              <p class="stat-value">{{ stats.total ?? 0 }}</p>
              <p class="stat-trend positive"><TrendingUp size="12" /> +{{ stats.weeklyNewVisits ?? 0 }} cette semaine</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple"><Star size="20" /></div>
            <div>
              <p class="stat-label">Recommandés</p>
              <p class="stat-value">{{ stats.recommended ?? 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><MessageCircle size="20" /></div>
            <div>
              <p class="stat-label">Commentés</p>
              <p class="stat-value">{{ stats.commented ?? 0 }}</p>
              <p class="stat-trend positive"><TrendingUp size="12" /> +{{ stats.weeklyNewComments ?? 0 }} cette semaine</p>
            </div>
          </div>
        </div>

        <!-- Filters + Sort -->
        <div class="filters-bar">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-btn"
            :class="{ active: activeFilter === f.value }"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
          <div class="sort-box">
            <select v-model="sortBy">
              <option value="recent">Plus récents</option>
              <option value="name">Nom</option>
              <option value="visits">Nombre de visites</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="empty-state">
          <p>Chargement...</p>
        </div>

        <!-- Portfolio cards grid -->
        <div v-else class="portfolio-grid">
          <div
            v-for="p in portfolios"
            :key="p.id"
            class="portfolio-card"
            @click="openPortfolio(p)"
          >
            <div class="card-header">
              <div class="student-avatar" :style="{ background: p.color }">{{ p.initials }}</div>
              <div class="student-info">
                <span class="student-name">{{ p.studentName }}</span>
                <span class="student-school">{{ p.school }}</span>
              </div>
              <button class="bookmark-btn" :class="{ active: p.bookmarked }" @click.stop="toggleBookmark(p)">
                <Bookmark size="18" :fill="p.bookmarked ? 'currentColor' : 'none'" />
              </button>
            </div>

            <div class="card-tags">
              <span v-for="tag in p.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <div class="card-footer">
              <span class="last-visit">Consulté {{ formatDate(p.lastVisit) }}</span>
              <div class="card-actions">
                <span v-if="p.hasComment" class="action-chip commented"><MessageCircle size="12" /> Commenté</span>
                <span v-if="p.hasReco" class="action-chip recommended"><Star size="12" /> Recommandé</span>
              </div>
            </div>

            <div class="visit-count">
              <Eye size="14" /> {{ p.visits }} visite{{ p.visits > 1 ? 's' : '' }}
            </div>
          </div>
        </div>

        <div v-if="!loading && portfolios.length === 0" class="empty-state">
          <p>Aucun portfolio trouvé.</p>
        </div>
      </div>
    </div>

    <!-- Detail drawer -->
    <div v-if="selectedPortfolio" class="drawer-overlay" @click.self="selectedPortfolio = null">
      <div class="drawer">
        <div class="drawer-header">
          <div class="student-avatar large" :style="{ background: selectedPortfolio.color }">
            {{ selectedPortfolio.initials }}
          </div>
          <div>
            <h3>{{ selectedPortfolio.studentName }}</h3>
            <p>{{ selectedPortfolio.school }}</p>
          </div>
          <button class="close-btn" @click="selectedPortfolio = null">
            <X size="20" />
          </button>
        </div>
        <div class="drawer-body">
          <div class="drawer-tags">
            <span v-for="tag in selectedPortfolio.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <p class="drawer-label">Dernière visite</p>
          <p class="drawer-value">{{ formatDate(selectedPortfolio.lastVisit) }}</p>
          <p class="drawer-label">Nombre de visites</p>
          <p class="drawer-value">{{ selectedPortfolio.visits }}</p>
          <div class="drawer-actions">
            <button class="btn-primary" @click="goToReco(selectedPortfolio)">Rédiger une recommandation</button>
            <button class="btn-outline">Voir le portfolio complet</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../../components/professor/Sidebar.vue'
import Topbar from '../../components/professor/Topbar.vue'
import { Eye, Star, MessageCircle, Search, Bookmark, TrendingUp, X } from 'lucide-vue-next'
import { portfoliosConsultesService } from '../../services/professor/portfoliosConsultes.service.js'

const user = { name: 'M. Ghailani', role: 'Professeur · ENSAT', verified: true }
const router = useRouter()

const portfolios = ref([])
const stats = ref({})
const loading = ref(false)
const activeFilter = ref('all')
const search = ref('')
const sortBy = ref('recent')
const selectedPortfolio = ref(null)

const filters = [
  { label: 'Tous', value: 'all' },
  { label: 'Recommandés', value: 'recommended' },
  { label: 'Commentés', value: 'commented' },
  { label: 'Favoris', value: 'bookmarked' },
]

// Charger les portfolios depuis l'API
async function fetchPortfolios() {
  loading.value = true
  try {
    const res = await portfoliosConsultesService.getAll({
      filter: activeFilter.value,
      sortBy: sortBy.value,
      search: search.value,
    })
    portfolios.value = res.data.data
  } catch (err) {
    console.error('Erreur chargement portfolios:', err)
  } finally {
    loading.value = false
  }
}

// Charger les stats
async function fetchStats() {
  try {
    const res = await portfoliosConsultesService.getStats()
    stats.value = res.data.data
  } catch (err) {
    console.error('Erreur chargement stats:', err)
  }
}

// Recharger quand filter/sort/search change
watch([activeFilter, sortBy, search], fetchPortfolios)

// Chargement initial
onMounted(() => {
  fetchPortfolios()
  fetchStats()
})

// Formater la date
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'il y a quelques secondes'
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`
  if (diff < 172800) return 'hier'
  return `il y a ${Math.floor(diff / 86400)} jours`
}

async function toggleBookmark(p) {
  try {
    await portfoliosConsultesService.toggleBookmark(p.id)
    p.bookmarked = !p.bookmarked
  } catch (err) {
    console.error('Erreur bookmark:', err)
  }
}

async function openPortfolio(p) {
  selectedPortfolio.value = p
  try {
    await portfoliosConsultesService.recordVisit(p.id)
    p.visits += 1
  } catch (err) {
    console.error('Erreur enregistrement visite:', err)
  }
}

function goToReco(p) {
  selectedPortfolio.value = null
  router.push('/professor/recommandations')
}
</script>

<style scoped>

.professor-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fb;
  font-family: 'Inter', sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-content {
  padding: 24px 32px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 4px 0 0;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  gap: 8px;
}

.search-box input {
  border: none;
  outline: none;
  font-size: 0.875rem;
  width: 200px;
  color: #0f172a;
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue { background: #dbeafe; color: #0284c7; }
.stat-icon.purple { background: #ede9fe; color: #7c3aed; }
.stat-icon.orange { background: #ffedd5; color: #ea580c; }

.stat-label { color: #64748b; font-size: 0.8rem; margin: 0; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0; }
.stat-trend { font-size: 0.75rem; margin: 0; display: flex; align-items: center; gap: 4px; }
.stat-trend.positive { color: #16a34a; }

.filters-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 7px 16px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all .2s;
}

.filter-btn.active {
  background: #1e293b;
  color: #fff;
  border-color: #1e293b;
}

.sort-box { margin-left: auto; }
.sort-box select {
  padding: 7px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #475569;
  background: #fff;
  outline: none;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.portfolio-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: box-shadow .2s, transform .2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

.portfolio-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.student-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.student-avatar.large { width: 56px; height: 56px; font-size: 1.2rem; }
.student-name { display: block; font-weight: 600; color: #0f172a; font-size: 0.95rem; }
.student-school { font-size: 0.75rem; color: #64748b; }

.bookmark-btn {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color .2s;
}

.bookmark-btn:hover { color: #0f172a; }
.bookmark-btn.active { color: #f5a623; }

.card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.tag { background: #f1f5f9; color: #475569; font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; }

.card-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.last-visit { font-size: 0.75rem; color: #94a3b8; }
.card-actions { display: flex; gap: 6px; }

.action-chip {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.action-chip.commented { background: #dbeafe; color: #1d4ed8; }
.action-chip.recommended { background: #fef9c3; color: #92400e; }

.visit-count {
  margin-top: 10px;
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-state { text-align: center; padding: 48px; color: #94a3b8; }

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.3);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  background: #fff;
  width: 380px;
  max-width: 95vw;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.drawer-header h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }
.drawer-header p { color: #64748b; font-size: 0.8rem; margin: 0; }

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color .2s;
}

.close-btn:hover { color: #0f172a; }

.drawer-body { display: flex; flex-direction: column; gap: 12px; }
.drawer-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.drawer-label { color: #94a3b8; font-size: 0.75rem; margin: 0; }
.drawer-value { font-weight: 600; color: #0f172a; margin: 0; }

.drawer-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }

.btn-primary {
  background: #f5a623;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
}

.btn-primary:hover { background: #e09610; }

.btn-outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: border .2s;
}

.btn-outline:hover { border-color: #cbd5e1; }

:deep(svg) { flex-shrink: 0; stroke-width: 2; color: currentColor; }
</style>