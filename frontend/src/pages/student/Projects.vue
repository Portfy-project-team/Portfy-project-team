<script setup>
import { computed, ref, onMounted } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import ProjectModal from '../../components/student/modals/ProjectModal.vue'

const activeFilter = ref('Tous')
const showProjectModal = ref(false)
const selectedProject = ref(null)
const projectList = ref([])
const loading = ref(true)

function normalizeStatus(status) {
  return status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function openAddProject() {
  selectedProject.value = null
  showProjectModal.value = true
}

function openEditProject(project) {
  selectedProject.value = project
  showProjectModal.value = true
}

async function saveProject(projectData) {
  try {
    const payload = {
      titre: projectData.title,
      type: projectData.type,
      description: projectData.description,
      technologie: projectData.tags?.join(', ') || '',
      profId: projectData.profId
    }

    let projectId = selectedProject.value?.id
    
    if (selectedProject.value) {
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
    
    showProjectModal.value = false
    selectedProject.value = null
    alert(projectData.status === 'En attente' ? 'Projet soumis pour validation.' : 'Brouillon enregistre.')
  } catch (err) {
    console.error('Erreur sauvegarde projet:', err)
    alert('Erreur lors de la sauvegarde du projet')
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
        github: p.github,
        demo: p.demo,
        screenshotUrl: p.screenshotUrl
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

const filteredProjects = computed(() => {
  if (activeFilter.value === 'Tous') return projectList.value
  if (activeFilter.value === 'Valides') return projectList.value.filter(p => p.status === 'Valide')
  if (activeFilter.value === 'En attente') return projectList.value.filter(p => p.status === 'En attente')
  if (activeFilter.value === 'Brouillons') return projectList.value.filter(p => p.status === 'Brouillon')
  if (activeFilter.value === 'Rejetés') return projectList.value.filter(p => p.status === 'Refuse')
  return projectList.value
})
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Projets" user-initials="AA" />

      <main class="projects-page">
        <section class="page-header">
          <div>
            <h2>Mes projets</h2>
            <p>Gerez vos projets academiques et personnels</p>
          </div>

          <button class="primary-btn" @click="showProjectModal=true">
            Nouveau projet
          </button>
        </section>

        <section class="filters">
          <button
            v-for="filter in filters"
            :key="filter.label"
            :class="['filter-btn', { active: activeFilter === filter.label }]"
            @click="activeFilter = filter.label"
          >
            {{ filter.label }} ({{ filter.count }})
          </button>
        </section>

        <section class="projects-grid" v-if="!loading">
          <article
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
          >
            <div class="project-header">
              <div>
                <h3>{{ project.title }}</h3>
                <p>{{ project.type }}</p>
              </div>

              <StatusBadge :status="project.status" />
            </div>

            <p class="project-description">
              {{ project.description }}
            </p>

            <div class="tags">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>

            <div class="card-footer">
              <span>
                {{ project.date }}
                <template v-if="project.supervisor">
                  - {{ project.supervisor }}
                </template>
              </span>

              <div class="card-actions">
                <button class="edit-btn" @click="openEditProject(project)">
                  Modifier
                </button>
                <button class="delete-btn" @click="removeProject(project.id)">
                  Supprimer
                </button>
              </div>
            </div>
          </article>
        </section>

        <section v-else class="loading">
          Chargement des projets...
        </section>
      </main>
    </div>
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
  background: #f4f1ec;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f4f1ec;
}

.projects-page {
  padding: 32px 38px 60px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.page-header h2 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
  color: #050505;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 17px;
}

.primary-btn {
  background:  #0f3a4f;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 16px 34px;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
}

.primary-btn:hover {
  background: #0b3558;
}

.filters {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-btn {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #334155;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.filter-btn.active {
  background: #082a47;
  color: #ffffff;
  font-weight: 800;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.project-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  min-height: 235px;
}

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.project-header h3 {
  margin: 0 0 6px;
  font-size: 21px;
  font-weight: 800;
  color: #050505;
}

.project-header p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.project-description {
  margin: 0 0 16px;
  color: #334155;
  font-size: 16px;
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  background: #eaf3f8;
  color: #082a47;
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
}

.card-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #64748b;
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 15px;
}

.edit-btn {
  background: transparent;
  border: none;
  color: #f59e0b;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.edit-btn:hover, .delete-btn:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

@media (max-width: 1100px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .projects-page {
    padding: 22px;
  }

  .page-header {
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }

  .project-header {
    flex-direction: column;
  }
}
</style>