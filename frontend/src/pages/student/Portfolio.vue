<script setup>
import { ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'

import { portfolioData } from '../../data/mockData.js'

const activeObjective = ref('Developpeur Web')
const activeTemplate = ref('Modern')

function badgeClass(color) {
  if (color === 'yellow') return 'badge-yellow'
  if (color === 'green') return 'badge-green'
  if (color === 'blue') return 'badge-blue'
  return 'badge-default'
}
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
          <button class="export-btn">Export PDF</button>
          <button class="preview-btn">Apercu public</button>
        </div>
      </header>

      <main class="portfolio-page">
        <section class="objective-card">
          <h2>Objectif professionnel</h2>
          <p>Adaptez votre portfolio selon votre profil cible</p>

          <div class="objectives-grid">
            <button
              v-for="objective in portfolioData.objectives"
              :key="objective"
              :class="['objective-btn', { active: activeObjective === objective }]"
              @click="activeObjective = objective"
            >
              {{ objective }}
            </button>
          </div>
        </section>

        <section class="portfolio-grid">
          <article class="main-card">
            <div class="profile-header">
              <div class="avatar">
                {{ portfolioData.profile.initials }}
              </div>

              <div class="profile-info">
                <h2>{{ portfolioData.profile.name }}</h2>
                <h3>{{ portfolioData.profile.title }}</h3>
                <p>{{ portfolioData.profile.school }}</p>
              </div>

              <StatusBadge :status="portfolioData.profile.status" />
            </div>

            <div class="separator"></div>

            <section class="portfolio-section">
              <h3>A PROPOS</h3>
              <p>{{ portfolioData.profile.about }}</p>
            </section>

            <section class="portfolio-section">
              <h3>PROJETS VALIDES ({{ portfolioData.validatedProjects.length }})</h3>

              <div class="projects-list">
                <div
                  v-for="project in portfolioData.validatedProjects"
                  :key="project.id"
                  class="project-box"
                >
                  <h4>{{ project.title }}</h4>
                  <p>{{ project.meta }}</p>

                  <div class="tags">
                    <span
                      v-for="tag in project.tags"
                      :key="tag"
                      class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section class="portfolio-section">
              <h3>BADGES OBTENUS</h3>

              <div class="badges-list">
                <span
                  v-for="badge in portfolioData.badges"
                  :key="badge.label"
                  :class="['portfolio-badge', badgeClass(badge.color)]"
                >
                  {{ badge.label }}
                </span>
              </div>
            </section>
          </article>

          <aside class="side-panel">
            <div class="side-card">
              <h3>Visibilite</h3>

              <ul class="visibility-list">
                <li
                  v-for="item in portfolioData.visibility"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </div>

            <div class="side-card">
              <h3>Template</h3>

              <div class="template-list">
                <button
                  v-for="template in portfolioData.templates"
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

              <input
                type="text"
                :value="portfolioData.publicLink"
                readonly
              />

              <button class="copy-btn">
                Copier le lien
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  </div>
</template>

