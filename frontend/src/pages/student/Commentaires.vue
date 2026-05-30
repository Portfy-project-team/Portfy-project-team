<script setup>
import { computed, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

import { competenceGroups } from '../../data/mockData.js'

const activeFilter = ref('Toutes')

const filters = ['Toutes', 'Techniques', 'Soft Skills', 'Langues']

const allCompetences = computed(() => {
  return competenceGroups.flatMap((group) => group.skills)
})

const filteredCompetences = computed(() => {
  if (activeFilter.value === 'Toutes') {
    return allCompetences.value
  }

  if (activeFilter.value === 'Techniques') {
    return allCompetences.value.filter((skill) => skill.category === 'Technique')
  }

  if (activeFilter.value === 'Soft Skills') {
    return allCompetences.value.filter((skill) => skill.category === 'Soft Skill')
  }

  if (activeFilter.value === 'Langues') {
    return allCompetences.value.filter((skill) => skill.category === 'Langue')
  }

  return allCompetences.value
})

function getCategoryClass(category) {
  if (category === 'Technique') return 'category-technique'
  if (category === 'Soft Skill') return 'category-soft'
  if (category === 'Langue') return 'category-langue'
  return 'category-default'
}

function getProgressClass(category) {
  if (category === 'Technique') return 'progress-purple'
  if (category === 'Soft Skill') return 'progress-green'
  if (category === 'Langue') return 'progress-orange'
  return 'progress-purple'
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Competences" user-initials="AA" />

      <main class="competences-page">
        <section class="page-header">
          <div>
            <h2>Mes competences</h2>
            <p>Competences techniques, soft skills et langues</p>
          </div>

          <button class="primary-btn">
            Ajouter une competence
          </button>
        </section>

        <section class="groups-grid">
          <article
            v-for="group in competenceGroups"
            :key="group.id"
            class="group-card"
          >
            <h3>{{ group.title }}</h3>
            <p class="group-subtitle">{{ group.subtitle }}</p>

            <div class="skills-list">
              <div
                v-for="skill in group.skills"
                :key="skill.name"
                class="skill-item"
              >
                <div class="skill-header">
                  <span>{{ skill.name }}</span>
                  <strong>{{ skill.level }}%</strong>
                </div>

                <div class="progress-bar">
                  <span
                    :class="`progress-${group.color}`"
                    :style="{ width: skill.level + '%' }"
                  ></span>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section class="table-card">
          <div class="filters">
            <button
              v-for="filter in filters"
              :key="filter"
              :class="['filter-btn', { active: activeFilter === filter }]"
              @click="activeFilter = filter"
            >
              {{ filter }}
            </button>
          </div>

          <table class="competences-table">
            <thead>
              <tr>
                <th>COMPETENCE</th>
                <th>CATEGORIE</th>
                <th>NIVEAU</th>
                <th>SOURCE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="skill in filteredCompetences"
                :key="skill.name"
              >
                <td class="skill-name">
                  {{ skill.name }}
                </td>

                <td>
                  <span :class="['category-badge', getCategoryClass(skill.category)]">
                    {{ skill.category }}
                  </span>
                </td>

                <td>
                  <div class="level-cell">
                    <div class="mini-progress">
                      <span
                        :class="getProgressClass(skill.category)"
                        :style="{ width: skill.level + '%' }"
                      ></span>
                    </div>
                    <span>{{ skill.level }}%</span>
                  </div>
                </td>

                <td>
                  {{ skill.source }}
                </td>

                <td>
                  <button class="action-btn">
                    Modifier
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </div>
</template>

