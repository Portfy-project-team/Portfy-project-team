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

.letters-page {
  padding: 32px 38px 60px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 24px;
}

.letters-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.letter-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.letter-card.pending {
  border-left: 4px solid #c77a00;
}

.letter-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}

.avatar-yellow {
  background: #fff2d8;
  color: #f59e0b;
}

.avatar-blue {
  background: #dff2ff;
  color: #1d70b8;
}

.letter-info {
  flex: 1;
}

.letter-info h3 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 800;
  color: #050505;
}

.letter-info p {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 14px;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-pill,
.visibility-pill {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
}

.status-valid {
  background: #d6f7e4;
  color: #078143;
}

.status-pending {
  background: #fff2d8;
  color: #c77a00;
}

.visibility-public {
  background: #dff2ff;
  color: #1d70b8;
}

.visibility-private {
  background: #fde2e2;
  color: #dc2626;
}

.pdf-btn {
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #082a47;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.quote-box {
  background: #f8fafc;
  border-left: 4px solid #f0a91f;
  padding: 18px;
  margin: 20px 0 14px;
  color: #334155;
  font-size: 16px;
  font-style: italic;
  line-height: 1.6;
}

.letter-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #64748b;
  font-size: 15px;
}

.request-text {
  margin: 22px 0 0;
  color: #64748b;
  font-size: 15px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .letter-footer {
    flex-direction: column;
  }
}

@media (max-width: 700px) {
  .letters-page {
    padding: 22px;
  }

  .page-header {
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }

  .letter-top {
    flex-direction: column;
  }
}
</style>
