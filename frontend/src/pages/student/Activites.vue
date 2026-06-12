<script setup>
import { computed, ref, onMounted } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import StatCard from '../../components/student/StatCard.vue'
import ActivityModal from '../../components/student/modals/ActivityModal.vue'
import { api } from '@/store/authStore.js'

// ─── API ──────────────────────────────────────────────────────────────────────

async function apiFetchMyActivities() {
  const res = await api.get('/activities/me')
  return res.data.activities
}

async function apiCreateActivity(payload) {
  const res = await api.post('/activities', payload)
  return res.data.activity
}

async function apiUpdateActivity(id, payload) {
  const res = await api.put(`/activities/${id}`, payload)
  return res.data.activity
}

async function apiDeleteActivity(id) {
  const res = await api.delete(`/activities/${id}`)
  return res.data
}

// ─── Mapping back → UI ────────────────────────────────────────────────────────

const TYPE_CLASS_MAP = {
  Hackathon: 'type-hackathon',
  Club: 'type-club',
  Evenement: 'type-event',
  Compétition: 'type-competition',
  Association: 'type-association',
}

function mapActivity(raw) {
  return {
    id: raw.id,
    title: raw.nom,
    role: raw.description ?? '',
    type: raw.type ?? '',
    typeClass: TYPE_CLASS_MAP[raw.type] ?? 'type-club',
    organisation: raw.type ?? '',
    periode: '',
    status: raw.statutV === 'VALIDATED'
      ? 'Verifiee'
      : raw.statutV === 'REJECTED'
        ? 'Rejetee'
        : 'En attente',
    statutV: raw.statutV,
    attestationUrl: raw.attestationUrl ?? null,
    nom: raw.nom,
    description: raw.description,
  }
}

// ─── État ─────────────────────────────────────────────────────────────────────

const activityList = ref([])
const loading = ref(false)
const error = ref(null)
const showActivityModal = ref(false)
const selectedActivity = ref(null)

// ─── Stats ────────────────────────────────────────────────────────────────────

const totalActivities = computed(() => activityList.value.length)

const verifiedActivities = computed(() =>
  activityList.value.filter((a) => a.statutV === 'VALIDATED').length,
)

const pendingActivities = computed(() =>
  activityList.value.filter((a) => a.statutV === 'PENDING').length,
)

// ─── Chargement ───────────────────────────────────────────────────────────────

async function loadActivities() {
  loading.value = true
  error.value = null
  try {
    const raw = await apiFetchMyActivities()
    activityList.value = raw.map(mapActivity)
  } catch (err) {
    error.value = err.message || 'Impossible de charger les activités.'
  } finally {
    loading.value = false
  }
}

onMounted(loadActivities)

// ─── Modal ────────────────────────────────────────────────────────────────────

function openAddActivity() {
  selectedActivity.value = null
  showActivityModal.value = true
}

function openEditActivity(activity) {
  selectedActivity.value = activity
  showActivityModal.value = true
}

function closeActivityModal() {
  showActivityModal.value = false
  selectedActivity.value = null
}

async function saveActivity(activityData) {
  error.value = null
  try {
    const payload = {
      nom: activityData.nom,
      description: activityData.description || '',
      type: activityData.type || 'Autre',
      attestationUrl: activityData.attestationUrl || undefined,
    }

    if (selectedActivity.value) {
      const updated = await apiUpdateActivity(selectedActivity.value.id, payload)
      const idx = activityList.value.findIndex((a) => a.id === selectedActivity.value.id)
      if (idx !== -1) activityList.value[idx] = mapActivity(updated)
    } else {
      const created = await apiCreateActivity(payload)
      activityList.value.unshift(mapActivity(created))
    }
    closeActivityModal()
    alert('Activite enregistree.')
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Une erreur est survenue.'
  }
}

// ─── Suppression ──────────────────────────────────────────────────────────────

async function removeActivity(activity) {
  if (!confirm(`Supprimer « ${activity.title} » ?`)) return
  error.value = null
  try {
    await apiDeleteActivity(activity.id)
    activityList.value = activityList.value.filter((a) => a.id !== activity.id)
  } catch (err) {
    error.value = err.message || "Impossible de supprimer l'activité."
  }
}

// ─── Attestation ──────────────────────────────────────────────────────────────

function viewAttestation(activity) {
  if (activity.attestationUrl) {
    window.open(activity.attestationUrl, '_blank')
    return
  }
  alert('Aucune attestation disponible pour cette activité.')
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Activites parascolaires" user-initials="AA" />

      <main class="activities-page">
        <section class="page-header">
          <div>
            <h2>Mes activites</h2>
            <p>Clubs, evenements, hackathons et engagements associatifs</p>
          </div>

          <button type="button" class="primary-btn" @click="openAddActivity">
            Nouvelle activite
          </button>
        </section>

        <div v-if="error" class="error-banner">
          {{ error }}
        </div>

        <div v-if="loading" class="loading-state">
          Chargement des activités…
        </div>

        <template v-else>
          <section class="stats-grid">
            <StatCard title="Total activites" :value="totalActivities" color="cream" subtitle="" />
            <StatCard title="Verifiees" :value="verifiedActivities" color="green" subtitle="" />
            <StatCard title="En attente" :value="pendingActivities" color="yellow" subtitle="" />
          </section>

          <section class="table-card">
            <div v-if="activityList.length === 0" class="empty-state">
              Aucune activité pour le moment. Ajoutez-en une !
            </div>

            <table v-else class="activities-table">
              <thead>
                <tr>
                  <th>ACTIVITE</th>
                  <th>TYPE</th>
                  <th>ORGANISATION</th>
                  <th>PERIODE</th>
                  <th>STATUT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="activity in activityList" :key="activity.id">
                  <td>
                    <div class="activity-name">{{ activity.title }}</div>
                    <div class="activity-role">{{ activity.role }}</div>
                  </td>

                  <td>
                    <span :class="['type-badge', activity.typeClass]">
                      {{ activity.type }}
                    </span>
                  </td>

                  <td>{{ activity.organisation }}</td>
                  <td>{{ activity.periode }}</td>

                  <td>
                    <StatusBadge :status="activity.status" />
                  </td>

                  <td>
                    <div class="actions">
                      <button
                        v-if="activity.statutV === 'VALIDATED'"
                        type="button"
                        class="action-btn"
                        @click="viewAttestation(activity)"
                      >
                        Attestation
                      </button>

                      <button
                        v-if="activity.statutV !== 'VALIDATED'"
                        type="button"
                        class="action-btn"
                        @click="openEditActivity(activity)"
                      >
                        Modifier
                      </button>

                      <button
                        v-if="activity.statutV !== 'VALIDATED'"
                        type="button"
                        class="action-btn action-btn--danger"
                        @click="removeActivity(activity)"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </template>
      </main>
    </div>

    <ActivityModal
      v-if="showActivityModal"
      :activity-to-edit="selectedActivity"
      @close="closeActivityModal"
      @save="saveActivity"
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

.activities-page {
  padding: 32px 38px;
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
  font-size: 30px;
  font-weight: 800;
  color: #050505;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 17px;
}

.error-banner {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 600;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-size: 16px;
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
  margin-bottom: 26px;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
}

.activities-table thead {
  background: #f8fafc;
}

.activities-table th {
  text-align: left;
  padding: 20px 26px;
  font-size: 14px;
  font-weight: 800;
  color: #64748b;
}

.activities-table td {
  padding: 20px 26px;
  border-top: 1px solid #e5e7eb;
  color: #334155;
  font-size: 16px;
  vertical-align: middle;
}

.activity-name {
  font-size: 16px;
  font-weight: 800;
  color: #050505;
  margin-bottom: 4px;
}

.activity-role {
  font-size: 14px;
  color: #64748b;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.type-hackathon   { background: #fff1cc; color: #c77a00; }
.type-club        { background: #dff2ff; color: #1d4ed8; }
.type-event       { background: #ebe7ff; color: #6d5dfc; }
.type-competition { background: #fee2e2; color: #dc2626; }
.type-association { background: #d6f7e4; color: #078143; }

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}

.action-btn {
  background: transparent;
  border: none;
  color: #f59e0b;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.action-btn:hover { text-decoration: underline; }

.action-btn--danger {
  color: #dc2626;
}

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: 1fr; }
  .table-card { overflow-x: auto; }
  .activities-table { min-width: 950px; }
}

@media (max-width: 700px) {
  .activities-page { padding: 22px; }
  .page-header { flex-direction: column; }
  .primary-btn { width: 100%; }
}
</style>