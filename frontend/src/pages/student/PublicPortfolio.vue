<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { portfolioData, networkStudents } from '../../data/mockData.js'

const route = useRoute()

function createSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const student = computed(() => {
  const slug = route.params.slug

  if (slug === 'Insaf Hamdane') {
    return null
  }

  return networkStudents.find((item) => createSlug(item.name) === slug)
})

const publicProfile = computed(() => {
  if (!student.value) {
    return {
      initials: portfolioData.profile.initials,
      name: portfolioData.profile.name,
      title: portfolioData.profile.title,
      school: portfolioData.profile.school,
      about: portfolioData.profile.about,
      projects: portfolioData.validatedProjects,
      badges: portfolioData.badges.map((badge) => badge.label)
    }
  }

  return {
    initials: student.value.initials,
    name: student.value.name,
    title: `${student.value.level} - ${student.value.field}`,
    school: `${student.value.school} - ${student.value.year}`,
    about: `${student.value.name} est un etudiant en ${student.value.field}. Son portfolio presente ses competences, ses badges et son parcours academique.`,
    projects: [
      {
        id: 1,
        title: 'Portfolio academique',
        meta: student.value.school,
        tags: student.value.badges
      }
    ],
    badges: student.value.badges
  }
})
</script>

<template>
  <main class="public-page">
    <section class="public-card">
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

      <section class="section-block">
        <h3>Projets valides</h3>

        <div
          v-for="project in publicProfile.projects"
          :key="project.id"
          class="project-box"
        >
          <h4>{{ project.title }}</h4>
          <p>{{ project.meta }}</p>

          <div class="tags">
            <span
              v-for="tag in project.tags"
              :key="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </section>

      <section class="section-block">
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
    </section>
  </main>
</template>

<style scoped>
.public-page {
  min-height: 100vh;
  background: #f4f1ec;
  padding: 40px;
}

.public-card {
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 32px;
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
}

.section-block {
  margin-bottom: 26px;
}

.section-block h3 {
  color: #082a47;
  font-size: 17px;
  font-weight: 900;
  text-transform: uppercase;
}

.project-box {
  background: #f8fafc;
  border-left: 4px solid #10b981;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
}

.project-box h4 {
  margin: 0 0 6px;
  font-size: 18px;
}

.tags,
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tags span,
.badges span {
  background: #eaf3f8;
  color: #082a47;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}
</style>