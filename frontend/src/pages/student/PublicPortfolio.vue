<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/store/authStore.js'

const route = useRoute()
const loading = ref(true)
const portfolioData = ref(null)
const error = ref(null)

async function fetchPortfolio() {
  loading.value = true
  try {
    const studentId = route.params.studentId 
    const res = await api.get(`/portfolio/public/${studentId}`)
    portfolioData.value = res.data.portfolio
  } catch (err) {
    console.error('Erreur chargement portfolio public', err)
    error.value = 'Impossible de charger ce portfolio.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPortfolio)

const publicProfile = computed(() => {
  if (!portfolioData.value) return null

  const s = portfolioData.value
  const p = s.portfolio || {}

  return {
    initials: (s.prenom?.[0] || '') + (s.nom?.[0] || ''),
    name: `${s.prenom} ${s.nom}`,
    title: p.objective || 'Étudiant',
    school: s.etablissement || 'N/A',
    about: p.bio || `Découvrez le parcours de ${s.prenom} ${s.nom}.`,
    projects: s.portfolio?.projets?.filter(proj => proj.statusV === 'VALIDATED') || [],
    badges: s.portfolio?.PortfolioBadge?.map(pb => pb.Badge.nom) || []
  }
})
</script>

<template>
  <main class="public-page">
    <div v-if="loading" class="loading-state">Chargement du portfolio...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    
    <section class="public-card" v-else-if="publicProfile">
      <div class="profile-header">
        <div class="avatar">
          {{ publicProfile.initials }}
        </div>

        <div>
          <h1>{{ publicProfile.name }}</h1>
          <h2>{{ publicProfile.title }}</h2>
          <p>{{ publicProfile.school }}</p>
        </div>
      </div>

      <section class="section-block">
        <h3>A propos</h3>
        <p>{{ publicProfile.about }}</p>
      </section>

      <section class="section-block" v-if="publicProfile.projects.length > 0">
        <h3>Projets valides</h3>

        <div
          v-for="project in publicProfile.projects"
          :key="project.id"
          class="project-box"
        >
          <h4>{{ project.titre }}</h4>
          <p>{{ project.description }}</p>

          <div class="tags" v-if="project.technologie">
            <span
              v-for="tag in project.technologie.split(',')"
              :key="tag"
            >
              {{ tag.trim() }}
            </span>
          </div>
        </div>
      </section>

      <section class="section-block" v-if="publicProfile.badges.length > 0">
        <h3>Badges obtenus</h3>

        <div class="badges">
          <span
            v-for="badge in publicProfile.badges"
            :key="badge"
          >
            {{ badge }}
          </span>
        </div>
      </section>
      
      <div v-if="publicProfile.projects.length === 0 && publicProfile.badges.length === 0" class="empty-notif">
        Ce portfolio est encore en cours de construction.
      </div>
    </section>
  </main>
</template>

<style scoped>
.public-page {
  min-height: 100vh;
  background: #f4f1ec;
  padding: 40px;
}

.loading-state, .error-state {
  text-align: center;
  padding: 100px;
  font-size: 18px;
  color: #64748b;
}

.public-card {
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 24px;
  margin-bottom: 24px;
}

.avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #082a47;
  color: #f0a91f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
}

h1 {
  margin: 0 0 6px;
  font-size: 30px;
  font-weight: 900;
  color: #050505;
}

h2 {
  margin: 0 0 6px;
  font-size: 20px;
  color: #f59e0b;
}

p {
  color: #64748b;
  line-height: 1.6;
}

.section-block {
  margin-bottom: 26px;
}

.section-block h3 {
  color: #082a47;
  font-size: 17px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 15px;
}

.project-box {
  background: #f8fafc;
  border-left: 4px solid #10b981;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
}

.project-box h4 {
  margin: 0 0 8px;
  font-size: 19px;
  color: #0f172a;
}

.tags,
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tags span,
.badges span {
  background: #eaf3f8;
  color: #082a47;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
}

.empty-notif {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 20px;
}
</style>
