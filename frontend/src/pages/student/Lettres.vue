<script setup>
import { computed } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatCard from '../../components/student/StatCard.vue'

import { recommendationLetters } from '../../data/mockData.js'

const totalLetters = computed(() => recommendationLetters.length)

const validatedLetters = computed(() => {
  return recommendationLetters.filter((letter) => {
    return normalize(letter.status).includes('validee')
  }).length
})

const pendingLetters = computed(() => {
  return recommendationLetters.filter((letter) => {
    return normalize(letter.status).includes('attente')
  }).length
})

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function statusClass(status) {
  const s = normalize(status)

  if (s.includes('validee')) return 'status-valid'
  if (s.includes('attente')) return 'status-pending'

  return 'status-default'
}

function visibilityClass(visibility) {
  const v = normalize(visibility)

  if (v.includes('publique')) return 'visibility-public'
  if (v.includes('privee')) return 'visibility-private'

  return ''
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Lettres de recommandation" user-initials="AA" />

      <main class="letters-page">
        <section class="page-header">
          <div>
            <h2>Mes lettres</h2>
            <p>Gerez vos lettres pour vos candidatures</p>
          </div>

          <button class="primary-btn">
            Demander une lettre
          </button>
        </section>

        <section class="stats-grid">
          <StatCard
            title="Total"
            :value="totalLetters"
            color="cream"
            subtitle=""
          />

          <StatCard
            title="Validees"
            :value="validatedLetters"
            color="green"
            subtitle=""
          />

          <StatCard
            title="En attente"
            :value="pendingLetters"
            color="yellow"
            subtitle=""
          />
        </section>

        <section class="letters-list">
          <article
            v-for="letter in recommendationLetters"
            :key="letter.id"
            :class="['letter-card', { pending: normalize(letter.status).includes('attente') }]"
          >
            <div class="letter-top">
              <div :class="['avatar', letter.avatarColor]">
                {{ letter.initials }}
              </div>

              <div class="letter-info">
                <h3>{{ letter.professor }}</h3>
                <p>{{ letter.meta }}</p>

                <div class="badges">
                  <span :class="['status-pill', statusClass(letter.status)]">
                    {{ letter.status }}
                  </span>

                  <span
                    v-if="letter.visibility"
                    :class="['visibility-pill', visibilityClass(letter.visibility)]"
                  >
                    {{ letter.visibility }}
                  </span>
                </div>
              </div>

              <button
                v-if="!normalize(letter.status).includes('attente')"
                class="pdf-btn"
              >
                PDF
              </button>
            </div>

            <div
              v-if="letter.quote"
              class="quote-box"
            >
              "{{ letter.quote }}"
            </div>

            <div
              v-if="letter.object"
              class="letter-footer"
            >
              <span>Objet : {{ letter.object }}</span>
              <span>{{ letter.date }}</span>
            </div>

            <p
              v-if="letter.requestText"
              class="request-text"
            >
              {{ letter.requestText }}
            </p>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

