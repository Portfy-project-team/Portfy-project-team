<template>
  <div class="dashboard p-6">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-lg">
        <div class="relative z-10 max-w-2xl">
          <h1 class="text-3xl font-bold mb-4">Bonjour, {{ user?.name || 'Professionnel' }}</h1>
          <p class="text-slate-300 text-lg mb-6">
            Bienvenue dans votre espace Portfy. Recherchez les meilleurs talents parmi les profils vérifiés par les institutions académiques.
          </p>
          <div class="flex gap-4">
            <button @click="router.push('/student/reseau')" class="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-2 rounded-lg font-bold transition flex items-center gap-2">
              <Search :size="18" /> Rechercher des talents
            </button>
          </div>
        </div>
        <div class="absolute right-0 top-0 w-64 h-64 bg-yellow-500/10 rounded-full -mr-32 -mt-32"></div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="stat in stats" :key="stat.key" class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="text-slate-500 text-sm font-medium mb-2">{{ stat.label }}</div>
          <div class="text-3xl font-bold text-slate-900">{{ stat.value }}</div>
          <div class="text-xs mt-2 text-green-600 font-medium">{{ stat.trend }}</div>
        </div>
      </div>

      <!-- Quick Search -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
        <div class="max-w-md mx-auto">
          <div class="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search class="text-slate-400" :size="32" />
          </div>
          <h2 class="text-xl font-bold mb-2">Trouvez votre futur stagiaire ou collaborateur</h2>
          <p class="text-slate-500 mb-6">Accédez à des milliers de profils d'étudiants certifiés et visualisez leurs projets validés.</p>
          <button @click="router.push('/student/reseau')" class="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition">
            Accéder à la recherche
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/store/dashboardStore.js'
import { Search, Eye, Star } from 'lucide-vue-next'

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
  background: #f8fafc;
  min-height: calc(100vh - 64px);
}
</style>
