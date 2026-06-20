<script setup>
import { computed, ref, onMounted } from 'vue'
import { api } from '@/store/authStore.js'
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Github, 
  ExternalLink, 
  Edit3, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import ProjectModal from '../../components/student/modals/ProjectModal.vue'
import Toast from '../../components/common/Toast.vue'
import ConfirmModal from '../../components/common/ConfirmModal.vue'

const activeFilter = ref('Tous')
const searchQuery = ref('')
const showProjectModal = ref(false)
const showConfirmModal = ref(false)
const projectToDelete = ref(null)
const selectedProject = ref(null)
const projectList = ref([])
const loading = ref(true)
const notifications = ref([])

function showNotification(message, type = 'success') {
  const id = Date.now()
  notifications.value.push({ id, message, type })
}

function removeNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function openAddProject() {
  selectedProject.value = null
  showProjectModal.value = true
}

function openEditProject(project) {
  selectedProject.value = project
  showProjectModal.value = true
}

function closeProjectModal() {
  showProjectModal.value = false
  selectedProject.value = null
}

function confirmDelete(id) {
  projectToDelete.value = id
  showConfirmModal.value = true
}

async function removeProject() {
  if (!projectToDelete.value) return
  try {
    await api.delete(`/projects/${projectToDelete.value}`)
    await loadProjects()
    showNotification('Projet supprimé avec succès')
  } catch (err) {
    console.error('Erreur suppression projet:', err)
    showNotification('Erreur lors de la suppression', 'error')
  } finally {
    showConfirmModal.value = false
    projectToDelete.value = null
  }
}

async function saveProject(projectData) {
  try {
    const payload = {
      titre: projectData.title,
      type: projectData.type,
      description: projectData.description,
      technologie: projectData.tags?.join(', ') || '',
      profId: projectData.profId,
      github: projectData.github,
      demo: projectData.demo
    }

    let projectId = selectedProject.value?.id
    const isUpdating = !!selectedProject.value
    
    if (isUpdating) {
      await api.put(`/projects/${projectId}`, payload)
    } else {
      const createRes = await api.post('/projects', payload)
      projectId = createRes.data.project.id
    }
    
    // Si l'utilisateur clique sur "Soumettre a validation"
    if (projectData.status === 'En attente') {
      await api.post(`/projects/${projectId}/submit`)
    }
    
    // Recharger la liste
    await loadProjects()
    
    closeProjectModal()
    
    if (isUpdating) {
      showNotification('Modifications enregistrées avec succès !')
    } else {
      showNotification(
        projectData.status === 'En attente' 
          ? 'Projet créé et soumis pour validation !' 
          : 'Brouillon créé avec succès.'
      )
    }
  } catch (err) {
    console.error('Erreur sauvegarde projet:', err)
    showNotification('Erreur lors de la sauvegarde du projet', 'error')
  }
}

async function loadProjects() {
  loading.value = true
  try {
    const res = await api.get('/projects/me')
    const json = res.data

    projectList.value = json.projects.map(p => {
      let displayStatus = 'En attente'
      if (p.statusV === 'VALIDATED') displayStatus = 'Valide'
      if (p.statusV === 'REJECTED') displayStatus = 'Refuse'
      if (p.statusV === 'PENDING' && !p.dateSoumission) displayStatus = 'Brouillon'

      return {
        id: p.id,
        title: p.titre,
        type: p.type || 'Sans type',
        description: p.description || '',
        status: displayStatus,
        statutV: p.statusV,
        dateSoumission: p.dateSoumission,
        tags: p.skills?.map(s => s.skill.nom) || [],
        date: p.dateSoumission 
          ? new Date(p.dateSoumission).toLocaleDateString('fr-FR')
          : 'Non soumis',
        supervisor: p.Prof 
          ? `${p.Prof.prenom} ${p.Prof.nom}`
          : 'Aucun prof',
        profId: p.profId,
        github: p.github || p.githubLink,
        demo: p.demo || p.youtubeLink,
        screenshotUrl: p.screenshots
      }
    })
  } catch (err) {
    console.error('Erreur chargement projets:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadProjects)

const filters = computed(() => [
  { label: 'Tous', count: projectList.value.length },
  { label: 'Valides', count: projectList.value.filter(p => p.status === 'Valide').length },
  { label: 'En attente', count: projectList.value.filter(p => p.status === 'En attente').length },
  { label: 'Brouillons', count: projectList.value.filter(p => p.status === 'Brouillon').length },
  { label: 'Rejetés', count: projectList.value.filter(p => p.status === 'Refuse').length }
])

function normalizeText(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const filteredProjects = computed(() => {
  let list = projectList.value

  if (activeFilter.value === 'Valides') list = list.filter(p => p.status === 'Valide')
  else if (activeFilter.value === 'En attente') list = list.filter(p => p.status === 'En attente')
  else if (activeFilter.value === 'Brouillons') list = list.filter(p => p.status === 'Brouillon')
  else if (activeFilter.value === 'Rejetés') list = list.filter(p => p.status === 'Refuse')

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = normalizeText(searchQuery.value.trim())
    list = list.filter(p => normalizeText(p.title).includes(q))
  }

  return list
})
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar 
        title="Projets" 
        search-placeholder="Rechercher par nom de projet..."
        disable-global-search
        @search="searchQuery = $event"
      />

      <main class="projects-page">
        <section class="page-header">
          <div>
            <h2>Mes projets</h2>
            <p>Gerez vos projets academiques et personnels</p>
          </div>

          <button class="primary-btn" @click="openAddProject">
            <Plus size="20" style="margin-right: 8px" />
            Nouveau projet
          </button>
        </section>

        <section class="controls-row">
          <section class="filters">
            <button
              v-for="filter in filters"
              :key="filter.label"
              :class="['filter-btn', { active: activeFilter === filter.label }]"
              @click="activeFilter = filter.label"
            >
              {{ filter.label }}
              <span class="filter-count">{{ filter.count }}</span>
            </button>
          </section>
        </section>

        <section class="projects-grid" v-if="!loading">
          <article
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
          >
            <div class="project-content">
              <div class="project-header">
                <div class="header-left">
                  <span class="project-type">{{ project.type }}</span>
                  <h3>{{ project.title }}</h3>
                </div>
                <StatusBadge :status="project.status" />
              </div>

              <p class="project-description">
                {{ project.description }}
              </p>

              <div class="tags" v-if="project.tags && project.tags.length">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="card-footer">
              <div class="footer-meta">
                <div class="meta-item">
                  <Calendar size="14" />
                  <span>{{ project.date }}</span>
                </div>
                <div class="meta-item" v-if="project.supervisor">
                  <User size="14" />
                  <span>{{ project.supervisor }}</span>
                </div>
              </div>

              <div class="card-actions">
                <div class="external-links">
                  <a v-if="project.github" :href="project.github" target="_blank" class="icon-link github" title="GitHub">
                    <Github size="18" />
                  </a>
                  <a v-if="project.demo" :href="project.demo" target="_blank" class="icon-link demo" title="Démo">
                    <ExternalLink size="18" />
                  </a>
                </div>
                
                <div class="admin-actions">
                  <button class="action-btn edit" @click="openEditProject(project)" title="Modifier">
                    <Edit3 size="18" />
                  </button>
                  <button class="action-btn delete" @click="confirmDelete(project.id)" title="Supprimer">
                    <Trash2 size="18" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section v-else class="loading">
          <div class="spinner"></div>
          <p>Chargement des projets...</p>
        </section>

        <section v-if="!loading && filteredProjects.length === 0" class="empty-state">
          <div class="empty-icon">
            <Search size="48" />
          </div>
          <h3>Aucun projet trouvé</h3>
          <p v-if="searchQuery">Aucun résultat ne correspond à votre recherche "{{ searchQuery }}"</p>
          <p v-else>Vous n'avez pas encore de projet dans cette catégorie.</p>
        </section>
      </main>
    </div>

    <!-- Notifications -->
    <Toast 
      v-for="n in notifications" 
      :key="n.id" 
      :message="n.message" 
      :type="n.type" 
      @close="removeNotification(n.id)" 
    />

    <!-- Modal de Confirmation -->
    <ConfirmModal
      v-if="showConfirmModal"
      title="Supprimer le projet"
      message="Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible."
      confirm-text="Supprimer"
      type="danger"
      @confirm="removeProject"
      @cancel="showConfirmModal = false"
    />
  </div>

  <ProjectModal
    v-if="showProjectModal"
    :project-to-edit="selectedProject"
    @close="closeProjectModal"
    @save="saveProject"
  />
</template>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f8fafc;
}

.projects-page {
  padding: 32px 40px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-header h2 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.page-header p {
  color: #64748b;
  font-size: 16px;
}

.controls-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 20px;
  width: 100%;
  max-width: 500px;
  transition: all 0.2s;
}

.search-bar:focus-within {
  border-color: #0f3a4f;
  box-shadow: 0 0 0 4px rgba(15, 58, 79, 0.1);
}

.search-bar svg {
  color: #64748b;
}

.search-bar input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 15px;
  color: #0f172a;
  outline: none;
}

.primary-btn {
  display: flex;
  align-items: center;
  background: #0f3a4f;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(15, 58, 79, 0.2);
}

.primary-btn:hover {
  background: #0b3558;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(15, 58, 79, 0.3);
}

.filters {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 9999px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.filter-btn.active {
  background: #0f3a4f;
  color: #ffffff;
  border-color: #0f3a4f;
}

.filter-count {
  font-size: 12px;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 999px;
}

.filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.project-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  border-color: #0f3a4f33;
}

.project-content {
  padding: 24px;
  flex: 1;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.project-type {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #0f3a4f;
  background: #0f3a4f10;
  padding: 4px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
  display: inline-block;
}

.header-left h3 {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.project-description {
  color: #475569;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 8px;
}

.card-footer {
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 13px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.external-links, .admin-actions {
  display: flex;
  gap: 8px;
}

.icon-link, .action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  text-decoration: none;
}

.icon-link:hover {
  background: #0f3a4f;
  color: #ffffff;
  border-color: #0f3a4f;
}

.action-btn.edit:hover {
  background: #f59e0b10;
  color: #f59e0b;
  border-color: #f59e0b;
}

.action-btn.delete:hover {
  background: #ef444410;
  color: #ef4444;
  border-color: #ef4444;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #0f3a4f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  color: #94a3b8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  max-width: 400px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .card-actions {
    justify-content: space-between;
  }

  .controls-row {
    flex-direction: column;
  }
}
</style>