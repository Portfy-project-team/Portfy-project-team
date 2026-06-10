<script setup>
import { computed, reactive, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatCard from '../../components/student/StatCard.vue'

import { recommendationLetters } from '../../data/mockData.js'

const letterList = ref([...recommendationLetters])
const showLetterModal = ref(false)

const form = reactive({
  professor: '',
  subject: '',
  purpose: '',
  visibility: 'Privee',
  message: ''
})

const totalLetters = computed(() => letterList.value.length)

const validatedLetters = computed(() => {
  return letterList.value.filter((letter) => {
    return normalize(letter.status).includes('validee')
  }).length
})

const pendingLetters = computed(() => {
  return letterList.value.filter((letter) => {
    return normalize(letter.status).includes('attente')
  }).length
})

const isFormValid = computed(() => {
  return (
    form.professor.trim() !== '' &&
    form.subject.trim() !== '' &&
    form.purpose.trim() !== ''
  )
})

function normalize(text) {
  return String(text || '')
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

  return 'visibility-default'
}

function avatarClass(color) {
  if (color === 'blue') return 'avatar-blue'
  if (color === 'yellow') return 'avatar-yellow'

  return 'avatar-default'
}

function openLetterModal() {
  resetForm()
  showLetterModal.value = true
}

function closeLetterModal() {
  showLetterModal.value = false
  resetForm()
}

function resetForm() {
  form.professor = ''
  form.subject = ''
  form.purpose = ''
  form.visibility = 'Privee'
  form.message = ''
}

function addLetter() {
  if (!isFormValid.value) return

  const initials = form.professor
    .replace('Pr.', '')
    .trim()
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const newLetter = {
    id: Date.now(),
    initials: initials || 'PR',
    professor: form.professor,
    meta: 'ENSA Tanger',
    status: 'En attente',
    visibility: form.visibility,
    quote: '',
    object: form.subject,
    date: '',
    requestText: "Demande envoyee aujourd'hui - En attente de redaction",
    avatarColor: 'yellow',
    purpose: form.purpose,
    message: form.message
  }

  letterList.value.unshift(newLetter)
  closeLetterModal()
}

function openLetterPdf(letter) {
  if (normalize(letter.status).includes('attente')) {
    alert('Cette lettre est encore en attente de validation.')
    return
  }

  const content = `
    <html>
      <head>
        <title>Lettre de recommandation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 50px;
            color: #082a47;
            line-height: 1.7;
          }

          .letter-container {
            max-width: 800px;
            margin: 0 auto;
          }

          h1 {
            text-align: center;
            color: #082a47;
            margin-bottom: 40px;
          }

          h2 {
            margin-bottom: 6px;
            color: #050505;
          }

          .meta {
            color: #64748b;
            margin-bottom: 30px;
          }

          .quote {
            margin: 30px 0;
            padding: 24px;
            border-left: 5px solid #f0a91f;
            background: #f8fafc;
            font-style: italic;
            color: #334155;
          }

          .info {
            margin-top: 18px;
            color: #334155;
          }

          .signature {
            margin-top: 60px;
            text-align: right;
          }
        </style>
      </head>

      <body>
        <div class="letter-container">
          <h1>Lettre de recommandation</h1>

          <h2>${letter.professor}</h2>
          <p class="meta">${letter.meta}</p>

          <div class="quote">
            "${letter.quote}"
          </div>

          <p class="info"><strong>Objet :</strong> ${letter.object}</p>
          <p class="info"><strong>Date :</strong> ${letter.date}</p>

          <div class="signature">
            <p>${letter.professor}</p>
            <p>Signature</p>
          </div>
        </div>

        <script>
          window.print()
        <\/script>
      </body>
    </html>
  `

  const win = window.open('', '_blank')

  if (!win) {
    alert('Impossible d’ouvrir le PDF. Autorisez les pop-ups dans le navigateur.')
    return
  }

  win.document.write(content)
  win.document.close()
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

          <button
            type="button"
            class="primary-btn"
            @click="openLetterModal"
          >
            Demander une lettre
          </button>
        </section>

        <section class="stats-grid">
          <StatCard title="Total" :value="totalLetters" color="cream" subtitle="" />
          <StatCard title="Validees" :value="validatedLetters" color="green" subtitle="" />
          <StatCard title="En attente" :value="pendingLetters" color="yellow" subtitle="" />
        </section>

        <section class="letters-list">
          <article
            v-for="letter in letterList"
            :key="letter.id"
            class="letter-card"
            :class="{ pending: normalize(letter.status).includes('attente') }"
          >
            <div class="letter-top">
              <div :class="['letter-avatar', avatarClass(letter.avatarColor)]">
                {{ letter.initials }}
              </div>

              <div class="letter-info">
                <h3>{{ letter.professor }}</h3>
                <p>{{ letter.meta }}</p>

                <div class="badges-row">
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
                type="button"
                class="pdf-btn"
                @click="openLetterPdf(letter)"
              >
                PDF
              </button>
            </div>

            <div v-if="letter.quote" class="quote-box">
              "{{ letter.quote }}"
            </div>

            <div v-if="letter.object || letter.date" class="letter-footer">
              <span>Objet : {{ letter.object }}</span>
              <span>{{ letter.date }}</span>
            </div>

            <p v-if="letter.requestText" class="request-text">
              {{ letter.requestText }}
            </p>
          </article>
        </section>
      </main>
    </div>

    <div
      v-if="showLetterModal"
      class="modal-overlay"
      @click.self="closeLetterModal"
    >
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>Demander une lettre</h2>
            <p>Envoyez une demande de recommandation a un enseignant</p>
          </div>

          <button type="button" class="close-btn" @click="closeLetterModal">
            ×
          </button>
        </div>

        <div class="form-group">
          <label>Enseignant</label>
          <input
            v-model="form.professor"
            type="text"
            placeholder="Ex: Pr. Mohamed Benali"
          />
        </div>

        <div class="form-group">
          <label>Objet de la lettre</label>
          <input
            v-model="form.subject"
            type="text"
            placeholder="Ex: Candidature Master"
          />
        </div>

        <div class="form-group">
          <label>Objectif</label>
          <select v-model="form.purpose">
            <option value="">Selectionner...</option>
            <option>Candidature Master</option>
            <option>Stage</option>
            <option>Double diplomation</option>
            <option>Bourse</option>
            <option>Emploi</option>
          </select>
        </div>

        <div class="form-group">
          <label>Visibilite</label>
          <select v-model="form.visibility">
            <option>Privee</option>
            <option>Publique</option>
          </select>
        </div>

        <div class="form-group">
          <label>Message</label>
          <textarea
            v-model="form.message"
            placeholder="Expliquez rapidement pourquoi vous demandez cette lettre..."
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeLetterModal">
            Annuler
          </button>

          <button
            type="button"
            class="submit-btn"
            :disabled="!isFormValid"
            @click="addLetter"
          >
            Envoyer la demande
          </button>
        </div>
      </div>
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
  padding: 34px 38px 60px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.page-header h2 {
  margin: 0 0 8px;
  font-size: 34px;
  font-weight: 900;
  color: #050505;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 17px;
}

.primary-btn {
  min-width: 220px;
  height: 54px;
  border: none;
  border-radius: 9px;
  background: #082a47;
  color: #ffffff;
  font-size: 16px;
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
  gap: 18px;
}

.letter-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.letter-card.pending {
  border-left: 4px solid #f0a91f;
}

.letter-top {
  display: flex;
  align-items: flex-start;
  gap: 18px;
}

.letter-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px dashed #cfe0ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  flex-shrink: 0;
}

.avatar-yellow {
  background: #fff2d8;
  color: #f59e0b;
}

.avatar-blue {
  background: #dff2ff;
  color: #0b78ff;
}

.avatar-default {
  background: #eef2f7;
  color: #082a47;
}

.letter-info {
  flex: 1;
}

.letter-info h3 {
  margin: 0 0 6px;
  font-size: 21px;
  font-weight: 900;
  color: #050505;
}

.letter-info p {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 15px;
}

.badges-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.status-pill,
.visibility-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.status-default {
  background: #eef2f7;
  color: #475569;
}

.visibility-public {
  background: #dff2ff;
  color: #0b78ff;
}

.visibility-private {
  background: #fee2e2;
  color: #dc2626;
}

.visibility-default {
  background: #eef2f7;
  color: #475569;
}

.pdf-btn {
  min-width: 70px;
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  background: #ffffff;
  color: #082a47;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
}

.pdf-btn:hover {
  border-color: #082a47;
}

.quote-box {
  margin-top: 24px;
  padding: 18px 22px;
  background: #f8fafc;
  border-left: 4px solid #f0a91f;
  color: #334155;
  font-size: 16px;
  font-style: italic;
  line-height: 1.6;
}

.letter-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  color: #64748b;
  font-size: 15px;
}

.request-text {
  margin: 24px 0 0;
  color: #64748b;
  font-size: 15px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 42, 71, 0.62);
  backdrop-filter: blur(2px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  width: 100%;
  max-width: 560px;
  background: #ffffff;
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 24px 60px rgba(8, 42, 71, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  color: #050505;
}

.modal-header p {
  margin: 0;
  color: #64748b;
}

.close-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 30px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #082a47;
  font-weight: 800;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  padding: 12px 14px;
  font-size: 15px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #f0a91f;
  box-shadow: 0 0 0 3px rgba(240, 169, 31, 0.18);
}

.form-group textarea {
  min-height: 90px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.submit-btn {
  border-radius: 9px;
  padding: 13px 18px;
  font-weight: 800;
  cursor: pointer;
}

.cancel-btn {
  background: #ffffff;
  color: #64748b;
  border: 1px solid #e5e7eb;
}

.submit-btn {
  background: #082a47;
  color: #ffffff;
  border: 1px solid #082a47;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .letters-page {
    padding: 24px 20px;
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

  .pdf-btn {
    width: 100%;
  }

  .letter-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>