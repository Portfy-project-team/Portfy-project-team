<script setup>
import { ref, onMounted, computed, reactive } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatCard from '../../components/student/StatCard.vue'

const letterList = ref([])
const showLetterModal = ref(false)
const loading = ref(true)

const form = reactive({
  professor: '',
  subject: '',
  purpose: '',
  visibility: 'Privee',
  message: ''
})

onMounted(async () => {
  await loadLetters()
})

async function loadLetters() {
  try {
    const token = localStorage.getItem('token')
    
    const res = await fetch('http://localhost:3000/api/letters/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const json = await res.json()
    
    // Transformer les données de l'API au format du frontend
    letterList.value = json.letters.map(letter => ({
      id: letter.id,
      initials: `${letter.Prof.prenom[0] || ''}${letter.Prof.nom[0] || ''}`.toUpperCase(),
      professor: `Pr. ${letter.Prof.prenom} ${letter.Prof.nom}`,
      meta: letter.Prof.departement || 'ENSA Tanger',
      status: letter.visibilite === 'PRIVATE' ? 'En attente' : 'Validee',
      visibility: letter.visibilite === 'PUBLIC' ? 'Publique' : letter.visibilite === 'DOWNLOADABLE' ? 'Telechargeable' : 'Privee',
      quote: letter.contenu?.substring(0, 200) || '',
      object: letter.type || '',
      date: new Date(letter.date).toLocaleDateString('fr-FR'),
      requestText: `Demande reçue le ${new Date(letter.date).toLocaleDateString('fr-FR')}`,
      avatarColor: letter.Prof.specialite ? 'blue' : 'yellow',
      purpose: letter.type || '',
      message: letter.contenu || '',
      profId: letter.Prof.id,
      visibiliteActuelle: letter.visibilite
    }))
    
    loading.value = false
  } catch (err) {
    console.error('Erreur chargement lettres:', err)
    loading.value = false
  }
}

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
  if (v.includes('telechargeable')) return 'visibility-public'
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

async function updateVisibility(letter, newVisibility) {
  try {
    const token = localStorage.getItem('token')
    
    const visibilityMap = {
      'Privee': 'PRIVATE',
      'Publique': 'PUBLIC',
      'Telechargeable': 'DOWNLOADABLE'
    }
    
    await fetch(`http://localhost:3000/api/letters/${letter.id}/visibility`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        visibilite: visibilityMap[newVisibility]
      })
    })
    
    letter.visibility = newVisibility
    letter.status = newVisibility === 'Privee' ? 'En attente' : 'Validee'
    alert('Visibilité mise à jour.')
  } catch (err) {
    console.error('Erreur mise à jour visibilité:', err)
    alert('Erreur lors de la mise à jour')
  }
}

async function deleteLetter(letter) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette lettre ?')) return
  
  try {
    const token = localStorage.getItem('token')
    
    await fetch(`http://localhost:3000/api/letters/${letter.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    letterList.value = letterList.value.filter(l => l.id !== letter.id)
    alert('Lettre supprimée.')
  } catch (err) {
    console.error('Erreur suppression lettre:', err)
    alert('Erreur lors de la suppression')
  }
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
    alert('Impossible d\'ouvrir le PDF. Autorisez les pop-ups dans le navigateur.')
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

      <main class="letters-page" v-if="!loading">
        <section class="page-header">
          <div>
            <h2>Mes lettres</h2>
            <p>Gerez vos lettres pour vos candidatures</p>
          </div>
        </section>

        <section class="stats-grid">
          <StatCard title="Total" :value="totalLetters" color="cream" subtitle="" />
          <StatCard title="Validees" :value="validatedLetters" color="green" subtitle="" />
          <StatCard title="En attente" :value="pendingLetters" color="yellow" subtitle="" />
        </section>

        <section class="letters-list" v-if="letterList.length > 0">
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

              <div class="letter-actions">
                <button
                  v-if="!normalize(letter.status).includes('attente')"
                  type="button"
                  class="pdf-btn"
                  @click="openLetterPdf(letter)"
                  title="Télécharger en PDF"
                >
                  PDF
                </button>

                <button
                  type="button"
                  class="delete-btn"
                  @click="deleteLetter(letter)"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div v-if="letter.quote" class="quote-box">
              "{{ letter.quote.substring(0, 150) }}..."
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

        <section v-else class="empty-state">
          <p>Aucune lettre de recommandation pour le moment.</p>
          <p>Les professeurs peuvent vous envoyer des lettres.</p>
        </section>
      </main>

      <div v-else class="loading">
        Chargement des lettres...
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

.letter-actions {
  display: flex;
  gap: 8px;
}

.pdf-btn,
.delete-btn {
  min-width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #082a47;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-btn:hover {
  border-color: #082a47;
}

.delete-btn {
  color: #dc2626;
  border-color: #fecaca;
}

.delete-btn:hover {
  background: #fef2f2;
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

.empty-state {
  text-align: center;
  padding: 60px 40px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  color: #64748b;
}

.empty-state p {
  margin: 8px 0;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
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

  .letter-top {
    flex-direction: column;
  }

  .letter-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .pdf-btn,
  .delete-btn {
    flex: 1;
  }

  .letter-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>