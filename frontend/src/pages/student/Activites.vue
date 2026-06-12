<script setup>
import { computed, ref, onMounted } from 'vue'
import { Plus, Edit3, Trash2, Search, Calendar, Building2, Tag, FileText } from 'lucide-vue-next'
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import StatCard from '../../components/student/StatCard.vue'
import ActivityModal from '../../components/student/modals/ActivityModal.vue'
import Toast from '../../components/common/Toast.vue'
import ConfirmModal from '../../components/common/ConfirmModal.vue'
import { api } from '@/store/authStore.js'

// --- État ---
const activityList = ref([])
const loading = ref(false)
const error = ref(null)
const showActivityModal = ref(false)
const showConfirmModal = ref(false)
const selectedActivity = ref(null)
const activityToDelete = ref(null)
const searchQuery = ref('')
const notifications = ref([])

// --- Helpers ---
function showNotification(message, type = 'success') {
  const id = Date.now()
  notifications.value.push({ id, message, type })
}

function removeNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function normalizeText(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

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
    organisation: raw.organisation ?? '',
    periode: raw.periode ?? '',
    status: raw.statutV === 'VALIDATED'
      ? 'Valide'
      : raw.statutV === 'REJECTED'
        ? 'Refuse'
        : 'En attente',
    statutV: raw.statutV,
    attestationUrl: raw.attestationUrl ?? null,
    nom: raw.nom,
    description: raw.description,
  }
}

// --- Computed ---
const filteredActivities = computed(() => {
  if (!searchQuery.value || searchQuery.value.trim() === '') return activityList.value
  const q = normalizeText(searchQuery.value.trim())
  return activityList.value.filter(a => 
    normalizeText(a.title).includes(q) || 
    normalizeText(a.type).includes(q) || 
    normalizeText(a.organisation).includes(q)
  )
})

const totalActivities = computed(() => activityList.value.length)
const verifiedActivities = computed(() =>
  activityList.value.filter((a) => a.statutV === 'VALIDATED').length,
)
const pendingActivities = computed(() =>
  activityList.value.filter((a) => a.statutV === 'PENDING').length,
)

// --- API ---
async function loadActivities() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get('/activities/me')
    const raw = res.data.activities
    activityList.value = raw.map(mapActivity)
  } catch (err) {
    console.error('Erreur load activities:', err)
    showNotification('Impossible de charger les activités', 'error')
  } finally {
    loading.value = false
  }
}

async function saveActivity(activityData) {
  try {
    const payload = {
      nom: activityData.nom,
      description: activityData.description || '',
      type: activityData.type || 'Autre',
      organisation: activityData.organisation || '',
      periode: activityData.periode || '',
    }

    const isUpdating = !!selectedActivity.value
    if (isUpdating) {
      await api.put(`/activities/${selectedActivity.value.id}`, payload)
      showNotification('Activité mise à jour avec succès !')
    } else {
      await api.post('/activities', payload)
      showNotification('Activité ajoutée avec succès !')
    }
    
    await loadActivities()
    closeActivityModal()
  } catch (err) {
    console.error('Erreur save activity:', err)
    showNotification('Erreur lors de la sauvegarde', 'error')
  }
}

function confirmDelete(activity) {
  activityToDelete.value = activity
  showConfirmModal.value = true
}

async function removeActivity() {
  if (!activityToDelete.value) return
  try {
    await api.delete(`/activities/${activityToDelete.value.id}`)
    showNotification('Activité supprimée avec succès')
    await loadActivities()
  } catch (err) {
    console.error('Erreur delete activity:', err)
    showNotification('Erreur lors de la suppression', 'error')
  } finally {
    showConfirmModal.value = false
    activityToDelete.value = null
  }
}

function viewAttestation(activity) {
  if (activity.attestationUrl) {
    window.open(activity.attestationUrl, '_blank')
    return
  }
  showNotification('Aucune attestation disponible', 'info')
}

// --- Modal handlers ---
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

onMounted(loadActivities)
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar 
        title="Activités parascolaires" 
        search-placeholder="Rechercher par activité, type..."
        disable-global-search
        @search="searchQuery = $event"
      />

      <main class="activities-page">
        <section class="page-header">
          <div>
            <h2>Mes activités</h2>
            <p>Clubs, événements, hackathons et engagements associatifs</p>
          </div>

          <button type="button" class="primary-btn" @click="openAddActivity">
            <Plus size="20" style="margin-right: 8px" />
            Nouvelle activité
          </button>
        </section>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des activités…</p>
        </div>

        <template v-else>
          <section class="stats-grid">
            <StatCard title="Total activités" :value="totalActivities" color="blue" subtitle="" />
            <StatCard title="Vérifiées" :value="verifiedActivities" color="green" subtitle="" />
            <StatCard title="En attente" :value="pendingActivities" color="yellow" subtitle="" />
          </section>

          <section class="table-card">
            <div v-if="filteredActivities.length === 0" class="empty-state">
              <div class="empty-icon"><Search size="48" /></div>
              <h3>Aucune activité trouvée</h3>
              <p v-if="searchQuery">Aucun résultat ne correspond à votre recherche "{{ searchQuery }}"</p>
              <p v-else>Vous n'avez pas encore ajouté d'activité parascolaire.</p>
              <button v-if="!searchQuery" class="secondary-btn" @click="openAddActivity" style="margin-top: 20px">Ajouter ma première activité</button>
            </div>

            <div v-else class="table-responsive">
              <table class="activities-table">
                <thead>
                  <tr>
                    <th>ACTIVITÉ</th>
                    <th>TYPE</th>
                    <th>ORGANISATION</th>
                    <th>PÉRIODE</th>
                    <th>STATUT</th>
                    <th class="actions-th">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="activity in filteredActivities" :key="activity.id">
                    <td>
                      <div class="activity-cell-info">
                        <span class="activity-name">{{ activity.title }}</span>
                        <span class="activity-role" v-if="activity.role">{{ activity.role }}</span>
                      </div>
                    </td>
                    <td>
                      <span :class="['type-badge', activity.typeClass]">
                        <Tag size="14" style="margin-right: 6px" />
                        {{ activity.type }}
                      </span>
                    </td>
                    <td>
                      <div class="info-with-icon">
                        <Building2 size="14" />
                        {{ activity.organisation || 'N/A' }}
                      </div>
                    </td>
                    <td>
                      <div class="info-with-icon">
                        <Calendar size="14" />
                        {{ activity.periode || 'N/A' }}
                      </div>
                    </td>
                    <td>
                      <StatusBadge :status="activity.status" />
                    </td>
                    <td class="action-cell">
                      <button
                        v-if="activity.attestationUrl"
                        class="icon-btn attestation-btn"
                        @click="viewAttestation(activity)"
                        title="Voir l'attestation"
                      >
                        <FileText size="18" />
                      </button>

                      <button
                        v-if="activity.statutV !== 'VALIDATED'"
                        class="icon-btn edit-btn"
                        @click="openEditActivity(activity)"
                        title="Modifier"
                      >
                        <Edit3 size="18" />
                      </button>

                      <button
                        v-if="activity.statutV !== 'VALIDATED'"
                        class="icon-btn delete-btn"
                        @click="confirmDelete(activity)"
                        title="Supprimer"
                      >
                        <Trash2 size="18" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>
      </main>
    </div>

    <!-- Modals & Notifications -->
    <ActivityModal
      v-if="showActivityModal"
      :activity-to-edit="selectedActivity"
      @close="closeActivityModal"
      @save="saveActivity"
    />

    <ConfirmModal
      v-if="showConfirmModal"
      title="Supprimer l'activité"
      :message="`Voulez-vous vraiment supprimer l'activité « ${activityToDelete?.title } » ? Cette action est irréversible.`"
      confirm-text="Supprimer"
      type="danger"
      @confirm="removeActivity"
      @cancel="showConfirmModal = false"
    />

    <Toast 
      v-for="n in notifications" 
      :key="n.id" 
      :message="n.message" 
      :type="n.type" 
      @close="removeNotification(n.id)" 
    />
  </div>
</template>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f8fafc;
}

.activities-page {
  padding: 32px 40px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-header h2 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.page-header p {
  color: #64748b;
  font-size: 16px;
}

.primary-btn {
  display: flex;
  align-items: center;
  background: #0f3a4f;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(15, 58, 79, 0.2);
}

.primary-btn:hover {
  background: #0b3558;
  transform: translateY(-1px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.table-responsive {
  overflow-x: auto;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.activities-table thead {
  background: #f8fafc;
}

.activities-table th {
  text-align: left;
  padding: 16px 24px;
  border-bottom: 2px solid #f1f5f9;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.activities-table td {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 15px;
  vertical-align: middle;
}

.activity-cell-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-name {
  font-weight: 700;
  color: #0f172a;
}

.activity-role {
  font-size: 13px;
  color: #64748b;
}

.info-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.info-with-icon svg {
  color: #94a3b8;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.type-hackathon   { background: #fff1cc; color: #c77a00; }
.type-club        { background: #dff2ff; color: #1d4ed8; }
.type-event       { background: #ebe7ff; color: #6d5dfc; }
.type-competition { background: #fee2e2; color: #dc2626; }
.type-association { background: #d6f7e4; color: #078143; }

.actions-th { text-align: right !important; padding-right: 24px !important; }
.action-cell { text-align: right; padding-right: 24px !important; white-space: nowrap; }

.icon-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 8px;
}

.icon-btn:hover { background: #f8fafc; color: #0f172a; }
.edit-btn:hover { border-color: #fcd34d; color: #f59e0b; background: #fffbeb; }
.delete-btn:hover { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }
.attestation-btn:hover { border-color: #93c5fd; color: #2563eb; background: #eff6ff; }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #0f3a4f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  color: #94a3b8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  max-width: 400px;
}

.secondary-btn {
  background: white;
  border: 1px solid #e2e8f0;
  color: #0f3a4f;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: 1fr; }
}

@media (max-width: 700px) {
  .activities-page { padding: 24px; }
  .page-header { flex-direction: column; align-items: stretch; gap: 16px; }
  .primary-btn { justify-content: center; }
}
</style>
