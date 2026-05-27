<script setup>
import { computed, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'

import { projects } from '../../data/mockData.js'

const activeFilter = ref('Tous')

const filters = computed(() => [
  {
    label: 'Tous',
    count: projects.length
  },
  {
    label: 'Valides',
    count: projects.filter((project) => normalizeStatus(project.status).includes('valide')).length
  },
  {
    label: 'En attente',
    count: projects.filter((project) => normalizeStatus(project.status).includes('attente')).length
  },
  {
    label: 'Correction',
    count: projects.filter((project) => normalizeStatus(project.status).includes('correction')).length
  }
])

const filteredProjects = computed(() => {
  if (activeFilter.value === 'Tous') {
    return projects
  }

  return projects.filter((project) => {
    const status = normalizeStatus(project.status)

    if (activeFilter.value === 'Valides') {
      return status.includes('valide')
    }

    if (activeFilter.value === 'En attente') {
      return status.includes('attente')
    }

    if (activeFilter.value === 'Correction') {
      return status.includes('correction')
    }

    return true
  })
})

function normalizeStatus(status) {
  return status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
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

          <button class="primary-btn">
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

              <button class="edit-btn">
                Modifier
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

