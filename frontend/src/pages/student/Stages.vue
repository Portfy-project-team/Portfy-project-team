<script setup>
import { ref, onMounted, computed } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import StageModal from '../../components/student/modals/StageModal.vue'
import { api } from '@/store/authStore.js'

// ─── State ────────────────────────────────────────────────────────────────────

const stageList   = ref([])
const profsMap    = ref({})          // encadrantId → { nom, prenom }
const loading     = ref(true)
const errorMsg    = ref(null)

const showStageModal = ref(false)
const selectedStage  = ref(null)

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchStages() {
  loading.value  = true
  errorMsg.value = null
  try {
    const [stagesRes, profsRes] = await Promise.all([
      api.get('/stages/me'),
      api.get('/stages/encadrants'),
    ])
    stageList.value = stagesRes.data
    profsMap.value  = Object.fromEntries(
      profsRes.data.map(p => [p.id, p])
    )
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchStages)

// ─── Computed helpers ─────────────────────────────────────────────────────────

function formatDateRange(dateDebut, dateFin) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  return `${fmt(dateDebut)} – ${fmt(dateFin)}`
}

function formatDuree(duree) {
  if (!duree) return ''
  return `${duree} mois`
}

function encadrantName(encadrantId) {
  const p = profsMap.value[encadrantId]
  if (!p) return '—'
  return `${p.prenom} ${p.nom}`
}

function missionsList(mission) {
  if (!mission) return []
  // Supporte à la fois les missions séparées par \n et par point-virgule
  return mission
    .split(/\n|;/)
    .map(m => m.trim())
    .filter(Boolean)
}

// Mappe statutV → label affiché dans la validation pill
const STATUT_LABEL = {
  PENDING:   null,
  SUBMITTED: 'En attente de validation',
  VALIDATED: '✓ Stage validé par l\'encadrant',
  REJECTED:  null,
}

function validationMessage(stage) {
  return STATUT_LABEL[stage.statutV] ?? null
}

// Couleur de l'icône selon l'index dans la liste
const ICON_COLORS = ['blue', 'cream', 'green', 'purple']
function iconColor(index) {
  return ICON_COLORS[index % ICON_COLORS.length]
}

// ─── Modal handlers ───────────────────────────────────────────────────────────

function openAddStage() {
  selectedStage.value = null
  showStageModal.value = true
}

function openEditStage(stage) {
  selectedStage.value = stage
  showStageModal.value = true
}

/**
 * saveStage reçoit un objet avec les champs du schéma Zod :
 * { entreprise, mission, technologies, dateDebut, dateFin, rapportUrl, encadrantId, id? }
 */
async function saveStage(stageData) {
  errorMsg.value = null
  try {
    const payload = {
      entreprise: stageData.entreprise,
      mission: stageData.mission || '',
      technologies: stageData.technologies || [],
      dateDebut: stageData.dateDebut,
      dateFin: stageData.dateFin,
      encadrantId: Number(stageData.encadrantId)
    }

    if (selectedStage.value) {
      // Mise à jour
      const res = await api.patch(`/stages/${selectedStage.value.id}`, payload)
      const updated = res.data
      const index = stageList.value.findIndex(s => s.id === selectedStage.value.id)
      if (index !== -1) stageList.value[index] = updated
    } else {
      // Création
      const res = await api.post('/stages', payload)
      const created = res.data
      stageList.value.unshift(created)
    }
    showStageModal.value = false
    selectedStage.value  = null
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message
  }
}

function closeStageModal() {
  showStageModal.value = false
  selectedStage.value  = null
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Stages" user-initials="AA" />

      <main class="stages-page">
        <section class="page-header">
          <div>
            <h2>Mes stages</h2>
            <p>Gérez vos expériences professionnelles</p>
          </div>

          <button class="primary-btn" @click="openAddStage">
            Nouveau stage
          </button>
        </section>

        <!-- État de chargement -->
        <div v-if="loading" class="feedback-state">
          <span class="spinner" aria-label="Chargement…" />
          <p>Chargement de vos stages…</p>
        </div>

        <!-- Erreur globale -->
        <div v-else-if="errorMsg" class="feedback-state error">
          <p>{{ errorMsg }}</p>
          <button class="secondary-btn" @click="fetchStages">Réessayer</button>
        </div>

        <!-- Liste vide -->
        <div v-else-if="stageList.length === 0" class="feedback-state empty">
          <p>Vous n'avez pas encore ajouté de stage.</p>
          <button class="primary-btn" @click="openAddStage">
            Ajouter un stage
          </button>
        </div>

        <!-- Liste des stages -->
        <section v-else class="stages-list">
          <article
            v-for="(stage, index) in stageList"
            :key="stage.id"
            class="stage-card"
          >
            <div class="stage-header">
              <div class="stage-left">
                <div :class="['stage-icon', iconColor(index)]"></div>

                <div>
                  <h3>{{ stage.entreprise }}</h3>
                  <!-- Le backend ne stocke pas de poste ; on affiche la durée -->
                  <h4>{{ formatDuree(stage.duree) }}</h4>
                  <p>
                    {{ formatDateRange(stage.dateDebut, stage.dateFin) }}
                  </p>
                </div>
              </div>

              <StatusBadge :status="stage.statutV" />
            </div>

            <div class="stage-body">
              <div class="missions">
                <h5>MISSIONS RÉALISÉES</h5>

                <ul v-if="missionsList(stage.mission).length">
                  <li
                    v-for="mission in missionsList(stage.mission)"
                    :key="mission"
                  >
                    {{ mission }}
                  </li>
                </ul>
                <p v-else class="empty-field">Non renseigné</p>
              </div>

              <div class="technologies">
                <h5>TECHNOLOGIES</h5>

                <div v-if="stage.technologies?.length" class="tags">
                  <span
                    v-for="tech in stage.technologies"
                    :key="tech"
                    class="tag"
                  >
                    {{ tech }}
                  </span>
                </div>
                <p v-else class="empty-field">Non renseigné</p>

                <div class="supervisors">
                  <p>
                    <strong>Encadrant académique :</strong>
                    {{ encadrantName(stage.encadrantId) }}
                  </p>
                  <p v-if="stage.rapportUrl">
                    <strong>Rapport :</strong>
                    <a :href="stage.rapportUrl" target="_blank" rel="noopener">
                      Voir le rapport
                    </a>
                  </p>
                </div>

                <!-- Raison du rejet -->
                <div v-if="stage.statutV === 'REJECTED' && stage.rejectionReason" class="rejection-reason">
                  <strong>Motif du rejet :</strong> {{ stage.rejectionReason }}
                </div>
              </div>
            </div>

            <div class="stage-footer">
              <span
                v-if="validationMessage(stage)"
                class="validation-pill"
              >
                {{ validationMessage(stage) }}
              </span>
              <span v-else></span>

              <!-- On ne peut modifier qu'un stage PENDING -->
              <button
                v-if="stage.statutV === 'PENDING'"
                class="edit-btn"
                @click="openEditStage(stage)"
              >
                Modifier
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>

    <StageModal
      v-if="showStageModal"
      :stage-to-edit="selectedStage"
      :profs="Object.values(profsMap)"
      @close="closeStageModal"
      @save="saveStage"
    />
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

.stages-page {
  padding: 32px 38px 60px;
}

/* ── Page header ── */
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

/* ── Buttons ── */
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

.primary-btn:hover { background: #0b3558; }

.secondary-btn {
  background: transparent;
  color: #082a47;
  border: 2px solid #082a47;
  border-radius: 10px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.secondary-btn:hover { background: #e8f0f7; }

/* ── Feedback states (loading / error / empty) ── */
.feedback-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 20px;
  color: #64748b;
  font-size: 16px;
  text-align: center;
}

.feedback-state.error { color: #b91c1c; }

.spinner {
  display: inline-block;
  width: 36px;
  height: 36px;
  border: 4px solid #e2e8f0;
  border-top-color: #082a47;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Stages list ── */
.stages-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.stage-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 26px;
}

/* ── Stage header ── */
.stage-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e7eb;
}

.stage-left {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.stage-icon {
  width: 56px;
  height: 56px;
  border-radius: 9px;
  flex-shrink: 0;
}

.stage-icon.blue   { background: #dff2ff; }
.stage-icon.cream  { background: #fff2d8; }
.stage-icon.green  { background: #d6f7e4; }
.stage-icon.purple { background: #ede9fe; }

.stage-left h3 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  color: #050505;
}

.stage-left h4 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 800;
  color: #082a47;
}

.stage-left p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

/* ── Stage body ── */
.stage-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 38px;
  padding: 22px 0;
  border-bottom: 1px solid #e5e7eb;
}

.stage-body h5 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 900;
  color: #050505;
}

.missions ul {
  margin: 0;
  padding-left: 18px;
  color: #334155;
}

.missions li {
  margin-bottom: 7px;
  font-size: 15px;
}

.empty-field {
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
  font-style: italic;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.tag {
  background: #eaf3f8;
  color: #082a47;
  padding: 7px 12px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
}

.supervisors {
  margin-top: 12px;
}

.supervisors p {
  margin: 4px 0;
  color: #64748b;
  font-size: 14px;
}

.supervisors strong { color: #050505; }

.supervisors a {
  color: #082a47;
  text-decoration: underline;
}

.rejection-reason {
  margin-top: 12px;
  padding: 10px 14px;
  background: #fef2f2;
  border-left: 3px solid #ef4444;
  border-radius: 6px;
  font-size: 14px;
  color: #b91c1c;
}

/* ── Stage footer ── */
.stage-footer {
  min-height: 52px;
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.validation-pill {
  display: inline-flex;
  align-items: center;
  background: #d6f7e4;
  color: #078143;
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 800;
}

.edit-btn {
  background: #082a47;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-left: auto;
}

.edit-btn:hover { background: #0b3558; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .stage-body { grid-template-columns: 1fr; }
  .stage-header { flex-direction: column; }
}

@media (max-width: 700px) {
  .stages-page { padding: 22px; }
  .page-header { flex-direction: column; }
  .primary-btn { width: 100%; }
  .stage-left { flex-direction: column; }
  .stage-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .edit-btn { width: 100%; margin-left: 0; }
}
</style>