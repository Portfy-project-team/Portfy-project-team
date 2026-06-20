<script setup>
import { ref, onMounted, computed } from 'vue'
import { Plus, Edit3, Trash2, Search, GraduationCap, School, Calendar, Award } from 'lucide-vue-next'
import { api } from '@/store/authStore.js'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import FormationModal from '../../components/student/modals/FormationModal.vue'
import Toast from '../../components/common/Toast.vue'
import ConfirmModal from '../../components/common/ConfirmModal.vue'

// --- État ---
const formationList = ref([])
const loading = ref(true)
const showFormationModal = ref(false)
const showConfirmModal = ref(false)
const selectedFormation = ref(null)
const formationToDelete = ref(null)
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

// --- Computed ---
const filteredFormations = computed(() => {
  if (!searchQuery.value || searchQuery.value.trim() === '') return formationList.value
  const q = normalizeText(searchQuery.value.trim())
  return formationList.value.filter(f => 
    normalizeText(f.title).includes(q) || normalizeText(f.provider).includes(q)
  )
})

// --- API ---
async function loadFormations() {
  loading.value = true
  try {
    const res = await api.get('/formations/me')
    formationList.value = res.data.map(f => ({
      id: f.id,
      title: f.diplome,
      provider: f.etablissement,
      status: 'Terminée', 
      progress: 100,
      label: 'Obtenu le',
      date: f.dateFin ? new Date(f.dateFin).toLocaleDateString('fr-FR') : 'N/A',
      tags: [f.specialite],
    }))
  } catch (e) {
    console.error('Erreur chargement formations', e)
    showNotification('Impossible de charger les formations', 'error')
  } finally {
    loading.value = false
  }
}

async function saveFormation(formationData) {
  try {
    const payload = {
      etablissement: formationData.provider,
      diplome: formationData.title,
      specialite: formationData.tags?.[0] || 'Général',
      dateFin: new Date().toISOString()
    }

    const isUpdating = !!selectedFormation.value
    if (isUpdating) {
      await api.put(`/formations/${selectedFormation.value.id}`, payload)
      showNotification('Formation mise à jour avec succès !')
    } else {
      await api.post('/formations', payload)
      showNotification('Formation ajoutée avec succès !')
    }
    await loadFormations()
    closeFormationModal()
  } catch (e) {
    console.error('Erreur sauvegarde formation', e)
    showNotification('Erreur lors de l\'enregistrement', 'error')
  }
}

function confirmDelete(formation) {
  formationToDelete.value = formation
  showConfirmModal.value = true
}

async function removeFormation() {
  if (!formationToDelete.value) return
  try {
    await api.delete(`/formations/${formationToDelete.value.id}`)
    showNotification('Formation supprimée avec succès')
    await loadFormations()
  } catch (e) {
    console.error('Erreur suppression formation', e)
    showNotification('Impossible de supprimer la formation', 'error')
  } finally {
    showConfirmModal.value = false
    formationToDelete.value = null
  }
}

// --- Modal handlers ---
function openAddFormation() {
  selectedFormation.value = null
  showFormationModal.value = true
}

function openEditFormation(formation) {
  selectedFormation.value = formation
  showFormationModal.value = true
}

function closeFormationModal() {
  showFormationModal.value = false
  selectedFormation.value = null
}

onMounted(loadFormations)
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar 
        title="Formations & Diplômes" 
        search-placeholder="Rechercher par diplôme ou établissement..."
        disable-global-search
        @search="searchQuery = $event"
      />

      <main class="formations-page">
        <section class="page-header">
          <div>
            <h2>Mon parcours académique</h2>
            <p>Gérez vos diplômes, certifications et formations continues</p>
          </div>

          <button type="button" class="primary-btn" @click="openAddFormation">
            <Plus size="20" style="margin-right: 8px" />
            Nouvelle formation
          </button>
        </section>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Chargement de vos formations…</p>
        </div>

        <template v-else>
          <div v-if="filteredFormations.length === 0" class="empty-state">
            <div class="empty-icon"><Search size="48" /></div>
            <h3>Aucune formation trouvée</h3>
            <p v-if="searchQuery">Aucun résultat ne correspond à votre recherche "{{ searchQuery }}"</p>
            <p v-else>Vous n'avez pas encore enregistré de formation ou diplôme.</p>
          </div>

          <section v-else class="formations-grid">
            <article
              v-for="formation in filteredFormations"
              :key="formation.id"
              class="formation-card"
            >
              <div class="formation-header">
                <div class="formation-icon">
                  <GraduationCap size="24" />
                </div>
                <div class="formation-main-info">
                  <h3>{{ formation.title }}</h3>
                  <div class="provider-info">
                    <School size="14" />
                    <span>{{ formation.provider }}</span>
                  </div>
                </div>
                <StatusBadge :status="formation.status" />
              </div>

              <div class="formation-details">
                <div class="detail-item">
                  <Calendar size="14" />
                  <span><strong>{{ formation.label }}:</strong> {{ formation.date }}</span>
                </div>
                
                <div class="tags" v-if="formation.tags.length">
                  <span v-for="tag in formation.tags" :key="tag" class="tag-badge">
                    <Award size="12" />
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="footer-actions">
                  <button class="icon-btn edit-btn" @click="openEditFormation(formation)" title="Modifier">
                    <Edit3 size="18" />
                  </button>
                  <button class="icon-btn delete-btn" @click="confirmDelete(formation)" title="Supprimer">
                    <Trash2 size="18" />
                  </button>
                </div>
              </div>
            </article>
          </section>
        </template>
      </main>
    </div>

    <!-- Modals & Notifications -->
    <FormationModal
      v-if="showFormationModal"
      :formation-to-edit="selectedFormation"
      @close="closeFormationModal"
      @save="saveFormation"
    />

    <ConfirmModal
      v-if="showConfirmModal"
      title="Supprimer la formation"
      :message="`Voulez-vous vraiment supprimer la formation « ${formationToDelete?.title} » ? Cette action est irréversible.`"
      confirm-text="Supprimer"
      type="danger"
      @confirm="removeFormation"
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

.formations-page {
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

.formations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.formation-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.formation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border-color: #0f3a4f22;
}

.formation-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.formation-icon {
  width: 52px;
  height: 52px;
  background: #f1f5f9;
  color: #0f3a4f;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.formation-main-info {
  flex: 1;
  min-width: 0;
}

.formation-main-info h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}

.provider-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
}

.formation-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.detail-item strong { color: #334155; }

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #0f3a4f;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.card-footer {
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

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
}

.icon-btn:hover { background: #f8fafc; color: #0f172a; }
.edit-btn:hover { border-color: #fcd34d; color: #f59e0b; background: #fffbeb; }
.delete-btn:hover { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }

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
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  border: 1px dashed #cbd5e1;
}

.empty-icon {
  margin-bottom: 20px;
  color: #cbd5e1;
}

@media (max-width: 640px) {
  .formations-grid { grid-template-columns: 1fr; }
}

@media (max-width: 700px) {
  .formations-page { padding: 24px; }
  .page-header { flex-direction: column; align-items: stretch; gap: 16px; }
  .primary-btn { justify-content: center; }
}
</style>
