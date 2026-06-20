<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import html2pdf from 'html2pdf.js'
import { api } from '@/store/authStore.js'

import Sidebar from '../../components/student/Sidebar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'

const router = useRouter()

const activeObjective = ref('')
const activeTemplate = ref('Modern')
const copied = ref(false)
const portfolioRef = ref(null)
const loading = ref(true)

// DONNÉES DU PORTFOLIO DEPUIS L'API
const student = ref(null)
const portfolio = ref(null)

const avatarPreview = ref(localStorage.getItem('studentAvatar') || '')

const updateAvatar = () => {
  avatarPreview.value = localStorage.getItem('studentAvatar') || ''
}

onMounted(() => {
  window.addEventListener('student-avatar-updated', updateAvatar)
  loadPortfolioData()
})

onUnmounted(() => {
  window.removeEventListener('student-avatar-updated', updateAvatar)
})

// CHARGER LES DONNÉES DU PORTFOLIO
async function loadPortfolioData() {
  try {
    const res = await api.get('/portfolio/me')
    
    const data = res.data
    student.value = data.portfolio
    portfolio.value = data.portfolio.portfolio
    activeObjective.value = portfolio.value?.objective || ''
    
    loading.value = false
  } catch (err) {
    console.error('Erreur chargement portfolio:', err)
    loading.value = false
  }
}

function getPublicPortfolioUrl() {
  if (!student.value) return ''
  const slug = `${student.value.prenom}-${student.value.nom}`.toLowerCase().replace(/\s+/g, '-')
  return `${window.location.origin}/portfolio/${student.value.id}`
}

function openPublicPreview() {
  window.open(getPublicPortfolioUrl(), '_blank')
}

async function copyPublicLink() {
  const link = getPublicPortfolioUrl()

  try {
    await navigator.clipboard.writeText(link)
    copied.value = true

    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    const input = document.createElement('input')
    input.value = link
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)

    copied.value = true

    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

async function updateObjective() {
  try {
    await api.put('/portfolio/settings', {
      objective: activeObjective.value
    })
  } catch (err) {
    console.error('Erreur mise à jour objectif:', err)
  }
}

async function updateVisibility(newVisibility) {
  try {
    await api.put('/portfolio/settings', {
      visibilite: newVisibility
    })
    if (portfolio.value) {
      portfolio.value.visibilite = newVisibility
    }
  } catch (err) {
    console.error('Erreur mise à jour visibilité:', err)
  }
}

function exportPDF() {
  const element = portfolioRef.value

  if (!element) {
    alert('Portfolio introuvable')
    return
  }

  const options = {
    margin: 10,
    filename: `portfolio-${student.value.prenom}-${student.value.nom}.pdf`,
    image: {
      type: 'jpeg',
      quality: 0.98
    },
    html2canvas: {
      scale: 2
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  }

  html2pdf().set(options).from(element).save()
}

function badgeClass(color) {
  if (color === 'yellow') return 'badge-yellow'
  if (color === 'green') return 'badge-green'
  if (color === 'blue') return 'badge-blue'
  return 'badge-default'
}

const objectives = ['Développeur Web', 'Développeur Mobile', 'Data Scientist', 'DevOps']
const templates = ['Modern', 'Classic', 'Minimal']
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <header class="portfolio-header">
        <div>
          <h1>Mon Portfolio</h1>
          <p>Editez et personnalisez votre portfolio professionnel</p>
        </div>

        <div class="header-actions">
          <button class="export-btn" @click="exportPDF">Export PDF</button>
          <button
            type="button"
            class="preview-btn"
            @click="openPublicPreview"
          >
            Apercu public
          </button>
        </div>
      </header>

      <main class="portfolio-page" v-if="!loading">
        <section class="objective-card">
          <h2>Objectif professionnel</h2>
          <p>Adaptez votre portfolio selon votre profil cible</p>

          <div class="objectives-grid">
            <button
              v-for="objective in objectives"
              :key="objective"
              :class="['objective-btn', { active: activeObjective === objective }]"
              @click="activeObjective = objective; updateObjective()"
            >
              {{ objective }}
            </button>
          </div>
        </section>

        <section class="portfolio-grid">
          <article class="main-card" ref="portfolioRef" v-if="student">
            <div class="profile-header">
              <div class="avatar">
                <img
                  v-if="avatarPreview"
                  :src="avatarPreview"
                  alt="Photo de profil"
                  class="avatar-img"
                />

                <span v-else>
                  {{ student.prenom?.charAt(0) }}{{ student.nom?.charAt(0) }}
                </span>
              </div>

              <div class="profile-info">
                <h2>{{ student.prenom }} {{ student.nom }}</h2>
                <h3>{{ student.filiere || 'Étudiant' }}</h3>
                <p>{{ student.etablissement }}</p>
              </div>

              <StatusBadge status="VALIDATED" />
            </div>

            <div class="separator"></div>

            <section class="portfolio-section">
              <h3>A PROPOS</h3>
              <p>{{ student.bio || 'Aucune biographie pour le moment' }}</p>
            </section>

            <section class="portfolio-section" v-if="student.portfolio?.projets?.length">
              <h3>PROJETS VALIDES ({{ student.portfolio.projets.filter(p => p.statusV === 'VALIDATED').length }})</h3>

              <div class="projects-list">
                <div
                  v-for="project in student.portfolio.projets.filter(p => p.statusV === 'VALIDATED')"
                  :key="project.id"
                  class="project-box"
                >
                  <h4>{{ project.titre }}</h4>
                  <p>{{ project.type }}</p>

                  <div class="tags">
                    <span
                      v-for="tag in (project.skills?.map(s => s.skill.nom) || [])"
                      :key="tag"
                      class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section class="portfolio-section" v-if="student.Stage?.length">
              <h3>STAGES EFFECTUES ({{ student.Stage.length }})</h3>

              <div class="projects-list">
                <div
                  v-for="stage in student.Stage"
                  :key="stage.id"
                  class="project-box"
                >
                  <h4>{{ stage.entreprise }}</h4>
                  <p>{{ stage.mission }}</p>

                  <div class="tags">
                    <span class="tag">{{ stage.duree }} mois</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="portfolio-section" v-if="student.skills?.length">
              <h3>COMPETENCES</h3>

              <div class="badges-list">
                <span
                  v-for="skill in student.skills"
                  :key="skill.skill.id"
                  class="portfolio-badge badge-blue"
                >
                  {{ skill.skill.nom }}
                </span>
              </div>
            </section>
          </article>

          <aside class="side-panel">
            <div class="side-card">
              <h3>Visibilite</h3>

              <div class="visibility-selector">
                <button 
                  v-for="v in ['PUBLIC', 'LINK_ONLY', 'PRIVATE']" 
                  :key="v"
                  :class="['visibility-btn', { active: portfolio?.visibilite === v }]"
                  @click="updateVisibility(v)"
                >
                  <template v-if="v === 'PUBLIC'">🌐 Public</template>
                  <template v-else-if="v === 'LINK_ONLY'">🔗 Lien uniquement</template>
                  <template v-else>🔒 Privé</template>
                </button>
              </div>
            </div>

            <div class="side-card">
              <h3>Template</h3>

              <div class="template-list">
                <button
                  v-for="template in templates"
                  :key="template"
                  :class="['template-btn', { active: activeTemplate === template }]"
                  @click="activeTemplate = template"
                >
                  {{ template }}
                </button>
              </div>
            </div>

            <div class="side-card">
              <h3>Lien public</h3>

              <input type="text" :value="getPublicPortfolioUrl()" readonly/>

              <button
                type="button"
                class="copy-btn"
                @click="copyPublicLink"
              >
                {{ copied ? 'Lien copie !' : 'Copier le lien' }}
              </button>
            </div>
          </aside>
        </section>
      </main>

      <div v-else class="loading">
        Chargement du portfolio...
      </div>
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

.avatar {
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.portfolio-header {
  height: 92px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.portfolio-header h1 {
  margin: 0 0 6px;
  font-size: 30px;
  font-weight: 800;
  color: #050505;
}

.portfolio-header p {
  margin: 0;
  color: #64748b;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.export-btn,
.preview-btn {
  border-radius: 9px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.export-btn {
  background: #ffffff;
  color:  #0f3a4f;
  border: 1px solid #e5e7eb;
}

.preview-btn {
  background:  #0f3a4f;
  color: #ffffff;
  border: 1px solid  #0f3a4f;
}

.portfolio-page {
  padding: 22px 36px 60px;
}

.objective-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}

.objective-card h2 {
  margin: 0 0 6px;
  font-size: 21px;
  font-weight: 800;
  color: #050505;
}

.objective-card p {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 15px;
}

.objectives-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.objective-btn {
  height: 66px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 10px;
  color: #082a47;
  font-size: 16px;
  cursor: pointer;
}

.objective-btn.active {
  background: #fff2d8;
  border: 2px solid #f0a91f;
  font-weight: 800;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
}

.main-card,
.side-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.main-card {
  padding: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 18px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background:  #0f3a4f;
  color: #f0a91f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 900;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  color: #050505;
}

.profile-info h3 {
  margin: 0 0 6px;
  color: #f59e0b;
  font-size: 18px;
  font-weight: 700;
}

.profile-info p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.separator {
  height: 1px;
  background: #e5e7eb;
  margin: 22px 0;
}

.portfolio-section {
  margin-bottom: 24px;
}

.portfolio-section h3 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 900;
  color: #082a47;
}

.portfolio-section p {
  margin: 0;
  color: #334155;
  font-size: 16px;
  line-height: 1.6;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-box {
  background: #f8fafc;
  border-left: 4px solid #10b981;
  border-radius: 8px;
  padding: 16px;
}

.project-box h4 {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 800;
  color: #050505;
}

.project-box p {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 14px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #eaf3f8;
  color:  #0f3a4f;
  padding: 6px 9px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
}

.badges-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.portfolio-badge {
  padding: 10px 18px;
  border-radius: 9px;
  font-weight: 800;
  font-size: 14px;
}

.badge-yellow {
  background: #fff2d8;
  color:  #0f3a4f;
}

.badge-green {
  background: #d6f7e4;
  color:  #0f3a4f;
}

.badge-blue {
  background: #dff2ff;
  color:  #0f3a4f;
}

.badge-default {
  background: #eef2f7;
  color:  #0f3a4f;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visibility-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visibility-btn {
  height: 46px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px;
  text-align: left;
  padding: 0 14px;
  font-size: 15px;
  color: #334155;
  cursor: pointer;
}

.visibility-btn.active {
  background: #dff2ff;
  border: 2px solid #0b78ff;
  font-weight: 800;
  color: #082a47;
}

.side-card {
  padding: 20px;
}

.side-card h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 800;
  color: #050505;
}

.visibility-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.visibility-list li {
  color: #334155;
  margin-bottom: 12px;
  font-size: 15px;
}

.visibility-list li::before {
  content: '◦';
  color: #64748b;
  margin-right: 10px;
}

.visibility-list li:first-child::before {
  content: '·';
  color: #0b78ff;
  font-weight: 900;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.template-btn {
  height: 46px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px;
  text-align: left;
  padding: 0 14px;
  font-size: 15px;
  color: #334155;
  cursor: pointer;
}

.template-btn.active {
  background: #fff2d8;
  border: 2px solid #f0a91f;
  font-weight: 800;
  color:  #0f3a4f;
}

.side-card input {
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  border-radius: 8px;
  padding: 0 12px;
  color:  #0f3a4f;
  font-size: 14px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.copy-btn {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 8px;
  background:  #0f3a4f;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.copy-btn:hover {
  background:  #0f3a4f;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

@media (max-width: 1100px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
  }

  .objectives-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .portfolio-header {
    height: auto;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
  }

  .export-btn,
  .preview-btn {
    flex: 1;
  }

  .portfolio-page {
    padding: 22px;
  }

  .objectives-grid {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>