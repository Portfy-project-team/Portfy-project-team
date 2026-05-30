<script setup>
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'

import { formations } from '../../data/mockData.js'
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Formations & Certifications" user-initials="AA" />

      <main class="formations-page">
        <section class="page-header">
          <div>
            <h2>Mes formations</h2>
            <p>Cours en ligne, certifications et formations continues</p>
          </div>

          <button class="primary-btn">
            Nouvelle formation
          </button>
        </section>

        <section class="formations-grid">
          <article
            v-for="formation in formations"
            :key="formation.id"
            class="formation-card"
          >
            <div class="formation-top">
              <div :class="['formation-icon', formation.iconColor]"></div>

              <div class="formation-info">
                <h3>{{ formation.title }}</h3>
                <p>{{ formation.provider }}</p>
              </div>

              <StatusBadge :status="formation.status" />
            </div>

            <div class="progress-block">
              <div class="progress-label">
                <span>Progression</span>
                <strong>{{ formation.progress }}%</strong>
              </div>

              <div class="progress-bar">
                <span
                  :class="formation.progressColor"
                  :style="{ width: formation.progress + '%' }"
                ></span>
              </div>
            </div>

            <div class="formation-meta">
              <strong>{{ formation.label }}:</strong>
              <span>{{ formation.date }}</span>
            </div>

            <div class="tags">
              <span
                v-for="tag in formation.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>

            <div class="card-footer">
              <div class="links">
                <button
                  v-for="link in formation.links"
                  :key="link"
                  :class="['link-btn', { orange: link === 'Certificat' }]"
                >
                  {{ link }}
                </button>
              </div>

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

