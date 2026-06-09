<script setup>
import { computed, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import ProjectModal from '../../components/student/modals/ProjectModal.vue'
import { projects } from '../../data/mockData.js'

const activeFilter = ref('Tous')
const showProjectModal = ref(false)
const selectedProject = ref(null)
const projectList = ref([...projects])

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

function saveProject(projectData) {
  if (selectedProject.value) {
    const index = projectList.value.findIndex((project) => project.id === projectData.id)

    if (index !== -1) {
      projectList.value[index] = projectData
    }
  } else {
    projectList.value.unshift(projectData)
  }

  showProjectModal.value = false
  selectedProject.value = null
}

function closeProjectModal() {
  showProjectModal.value = false
  selectedProject.value = null
}

const filters = computed(() => [
  {
    label: 'Tous',
    count: projectList.value.length
  },
  {
    label: 'Valides',
    count: projectList.value.filter((project) =>
      normalizeStatus(project.status).includes('valide')
    ).length
  },
  {
    label: 'En attente',
    count: projectList.value.filter((project) =>
      normalizeStatus(project.status).includes('attente')
    ).length
  },
  {
    label: 'Correction',
    count: projectList.value.filter((project) =>
      normalizeStatus(project.status).includes('correction')
    ).length
  }
])

const filteredProjects = computed(() => {
  if (activeFilter.value === 'Tous') {
    return projectList.value
  }

  return projectList.value.filter((project) => {
    const status = normalizeStatus(project.status)

    if (activeFilter.value === 'Valides') return status.includes('valide')
    if (activeFilter.value === 'En attente') return status.includes('attente')
    if (activeFilter.value === 'Correction') return status.includes('correction')

    return true
  })
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

        <section class="projects-grid">
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

            <div
              v-if="project.correction"
              class="correction-box"
            >
              ⚠ {{ project.correction }}
            </div>

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

              <button class="edit-btn" @click="openEditProject(project)">
                Modifier
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
      <ProjectModal
  v-if="showProjectModal"
  :project-to-edit="selectedProject"
  @close="closeProjectModal"
  @save="saveProject"/>
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
  background: #082a47;
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

.correction-box {
  background: #fff4e8;
  border-left: 4px solid #d95b28;
  color: #a23b13;
  padding: 12px 14px;
  border-radius: 0 8px 8px 0;
  font-size: 14px;
  margin-bottom: 14px;
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

.edit-btn {
  background: transparent;
  border: none;
  color: #f59e0b;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.edit-btn:hover {
  text-decoration: underline;
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