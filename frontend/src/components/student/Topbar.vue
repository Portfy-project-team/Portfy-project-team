<script setup>
import { Search, Bell, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  },
  userInitials: {
    type: String,
    default: 'AA'
  }
})

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const showResults = ref(false)

async function performSearch() {
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = []
    showResults.value = false
    return
  }

  try {
    isSearching.value = true
    const token = localStorage.getItem('token')
    
    const res = await fetch(
      `http://localhost:3000/api/search?q=${encodeURIComponent(searchQuery.value)}&limit=10`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    )
    
    const json = await res.json()
    searchResults.value = json.data || []
    showResults.value = true
  } catch (err) {
    console.error('Erreur recherche:', err)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

function goToPortfolio(studentId) {
  router.push(`/portfolio/${studentId}`)
  clearSearch()
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
}

function goToNotifications() {
  router.push('/student/notifications')
}

function goToParametres() {
  router.push('/student/parametres')
}

function getScoreColor(score) {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}
</script>

<template>
  <header class="topbar">
    <h1 class="topbar-title">
      {{ title }}
    </h1>

    <div class="topbar-actions">
      <div class="search-wrapper">
        <div class="search-box">
          <Search size="18" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un portfolio..."
            @input="performSearch"
            @focus="showResults = searchResults.length > 0"
          />
          <button
            v-if="searchQuery"
            class="clear-btn"
            @click="clearSearch"
            title="Effacer"
          >
            <X size="16" />
          </button>
        </div>

        <!-- RÉSULTATS DE RECHERCHE -->
        <div v-if="showResults && (searchResults.length > 0 || isSearching)" class="search-results">
          <div v-if="isSearching" class="search-item loading">
            Recherche en cours...
          </div>

          <div
            v-for="result in searchResults"
            :key="result.id"
            class="search-item"
            @click="goToPortfolio(result.studentId)"
          >
            <div
              class="result-avatar"
              :style="{ background: result.color }"
            >
              {{ result.initials }}
            </div>

            <div class="result-info">
              <div class="result-name">{{ result.studentName }}</div>
              <div class="result-meta">
                {{ result.filiere }} • {{ result.school }}
              </div>
              <div class="result-tags">
                <span
                  v-for="tag in result.tags.slice(0, 3)"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="result-score" :style="{ color: getScoreColor(result.scoreCredibilite) }">
              <strong>{{ result.scoreCredibilite.toFixed(0) }}</strong>
            </div>
          </div>

          <div v-if="searchResults.length === 0 && !isSearching" class="search-item empty">
            Aucun résultat trouvé
          </div>
        </div>
      </div>

      <button class="notif-btn" title="Notifications" @click="goToNotifications">
        <Bell size="18" />
      </button>

      <div class="profile-btn" @click="goToParametres" title="Paramètres">
        {{ userInitials }}
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.topbar-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-wrapper {
  position: relative;
  width: 250px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f8f9fb;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  gap: 8px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  width: 100%;
  color: #0f172a;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.search-box :deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: #64748b;
}

.clear-btn {
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  color: #0f172a;
}

/* RÉSULTATS DE RECHERCHE */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-item {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.search-item:hover:not(.loading):not(.empty) {
  background: #f8f9fb;
}

.search-item.loading,
.search-item.empty {
  cursor: default;
  color: #94a3b8;
  font-size: 0.875rem;
}

.result-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-tags {
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.tag {
  background: #f1f5f9;
  color: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.result-score {
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
}

.notif-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  padding: 0;
  border-radius: 6px;
}

.notif-btn:hover {
  color: #0f172a;
}

.notif-btn :deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}

.profile-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2f74b4b4;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}

.profile-btn:hover {
  background: #4338ca;
}

@media (max-width: 900px) {
  .search-wrapper {
    width: 200px;
  }
}

@media (max-width: 700px) {
  .search-wrapper {
    width: 150px;
  }

  .search-box input {
    font-size: 0.75rem;
  }
}
</style>