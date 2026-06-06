<template>
  <div class="professor-layout">
    <Sidebar :user="user" :comment-count="3" />
    <div class="main-content">
      <Topbar title="Recommandations" />

      <div class="page-content">
        <!-- Header actions -->
        <div class="page-header">
          <div class="header-left">
            <h2 class="page-title">Mes recommandations</h2>
            <p class="page-subtitle">Gérez les recommandations que vous avez rédigées pour vos étudiants</p>
          </div>
          <button class="btn-primary" @click="showModal = true">
            <Plus size="16" />
            Ajouter une recommandation
          </button>
        </div>

        <!-- Stats row -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon teal"><Clipboard size="20" /></div>
            <div>
              <p class="stat-label">Total rédigées</p>
              <p class="stat-value">31</p>
              <p class="stat-trend positive"><TrendingUp size="12" /> +5 ce mois</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><CheckCircle size="20" /></div>
            <div>
              <p class="stat-label">Publiées</p>
              <p class="stat-value">{{ published.length }}</p>
              <p class="stat-trend positive"><TrendingUp size="12" /> +3 cette semaine</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon yellow"><Clock size="20" /></div>
            <div>
              <p class="stat-label">En attente</p>
              <p class="stat-value">{{ pending.length }}</p>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="filters-bar">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-btn"
            :class="{ active: activeFilter === f.value }"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
          <div class="search-box">
            <Search size="18" />
            <input v-model="search" type="text" placeholder="Rechercher un étudiant..." />
          </div>
        </div>

        <!-- Recommendations list -->
        <div class="reco-list">
          <div
            v-for="reco in filteredRecos"
            :key="reco.id"
            class="reco-card"
          >
            <div class="reco-avatar" :style="{ background: reco.color }">
              {{ reco.initials }}
            </div>
            <div class="reco-body">
              <div class="reco-top">
                <div>
                  <span class="reco-name">{{ reco.student }}</span>
                  <span class="reco-meta"> — {{ reco.text }}</span>
                </div>
                <StatusBadge :status="reco.status" />
              </div>
              <div class="reco-footer">
                <span class="reco-type">{{ reco.type }}</span>
                <span class="reco-date">{{ reco.date }}</span>
              </div>
            </div>
            <div class="reco-actions">
              <button class="action-btn edit" @click="editReco(reco)" title="Modifier">
                <Edit size="16" />
              </button>
              <button class="action-btn delete" @click="deleteReco(reco.id)" title="Supprimer">
                <Trash2 size="16" />
              </button>
            </div>
          </div>

          <div v-if="filteredRecos.length === 0" class="empty-state">
            <p>Aucune recommandation trouvée.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editMode ? 'Modifier' : 'Nouvelle' }} recommandation</h3>
          <button @click="showModal = false">
            <X size="20" />
          </button>
        </div>
        <div class="modal-body">
          <label>Étudiant</label>
          <input v-model="form.student" type="text" placeholder="Nom de l'étudiant" />
          <label>Contenu</label>
          <textarea v-model="form.text" rows="4" placeholder="Rédigez votre recommandation..."></textarea>
          <label>Type</label>
          <select v-model="form.type">
            <option>Portfolio</option>
            <option>Stage</option>
            <option>Projet</option>
          </select>
          <label>Statut</label>
          <select v-model="form.status">
            <option value="published">Publiée</option>
            <option value="pending">En attente</option>
          </select>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showModal = false">Annuler</button>
          <button class="btn-primary" @click="saveReco">{{ editMode ? 'Enregistrer' : 'Publier' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '../../components/professor/Sidebar.vue'
import Topbar from '../../components/professor/Topbar.vue'
import StatusBadge from '../../components/professor/StatusBadge.vue'
import { Eye, Star, MessageCircle, Search, Edit, Trash2, Plus, TrendingUp, X, CheckCircle, Clock, Clipboard } from 'lucide-vue-next'

const user = { name: 'M. Ghailani', role: 'Professeur · ENSAT', verified: true }

const recommendations = ref([
  { id: 1, student: 'Ahmed Alami', initials: 'AA', color: '#4f46e5', text: 'Très bon niveau technique, autonome et rigoureux.', type: 'Portfolio', date: '12 mars 2026', status: 'published' },
  { id: 2, student: 'Sara Benali', initials: 'SB', color: '#7c3aed', text: 'Excellente en data, livrable de qualité professionnelle.', type: 'Portfolio', date: '6 fév. 2026', status: 'published' },
  { id: 3, student: 'Leila Moussaoui', initials: 'LM', color: '#059669', text: 'Profil rare en cybersécurité, hautement recommandée.', type: 'Portfolio', date: '20 jan. 2026', status: 'pending' },
  { id: 4, student: 'Youssef Khalil', initials: 'YK', color: '#d97706', text: 'Maîtrise solide de React et Node.js, très impliqué.', type: 'Stage', date: '5 jan. 2026', status: 'published' },
  { id: 5, student: 'Omar Mellouki', initials: 'OM', color: '#0891b2', text: 'Bon profil backend, progresse rapidement.', type: 'Projet', date: '15 déc. 2025', status: 'pending' },
])

const activeFilter = ref('all')
const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const form = ref({ student: '', text: '', type: 'Portfolio', status: 'published' })
const editId = ref(null)

const filters = [
  { label: 'Toutes', value: 'all' },
  { label: 'Publiées', value: 'published' },
  { label: 'En attente', value: 'pending' },
]

const published = computed(() => recommendations.value.filter(r => r.status === 'published'))
const pending = computed(() => recommendations.value.filter(r => r.status === 'pending'))

const filteredRecos = computed(() => {
  return recommendations.value.filter(r => {
    const matchFilter = activeFilter.value === 'all' || r.status === activeFilter.value
    const matchSearch = r.student.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })
})

function editReco(reco) {
  editMode.value = true
  editId.value = reco.id
  form.value = { student: reco.student, text: reco.text, type: reco.type, status: reco.status }
  showModal.value = true
}

function deleteReco(id) {
  recommendations.value = recommendations.value.filter(r => r.id !== id)
}

function saveReco() {
  if (editMode.value) {
    const idx = recommendations.value.findIndex(r => r.id === editId.value)
    if (idx !== -1) {
      recommendations.value[idx] = { ...recommendations.value[idx], ...form.value }
    }
  } else {
    recommendations.value.unshift({
      id: Date.now(),
      student: form.value.student,
      initials: form.value.student.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(),
      color: '#4f46e5',
      text: form.value.text,
      type: form.value.type,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: form.value.status,
    })
  }
  showModal.value = false
  editMode.value = false
  form.value = { student: '', text: '', type: 'Portfolio', status: 'published' }
}
</script>

<style scoped>
.professor-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fb;
  font-family: 'Inter', sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-content {
  padding: 24px 32px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 4px 0 0;
}

.btn-primary {
  background: #e5b230;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background .2s;
}

.btn-primary:hover {
  background: #e09610;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #fff;
}

.stat-icon.teal {
  background: #e0f2f1;
  color: #00897b;
}

.stat-icon.green {
  background: #dcfce7;
  color: #16a34a;
}

.stat-icon.yellow {
  background: #fef9c3;
  color: #92400e;
}

.stat-label {
  color: #64748b;
  font-size: 0.8rem;
  margin: 0;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.stat-trend {
  font-size: 0.75rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.positive {
  color: #16a34a;
}

.filters-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 7px 16px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all .2s;
}

.filter-btn.active {
  background: #1e293b;
  color: #fff;
  border-color: #1e293b;
}

.search-box {
  margin-left: auto;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 12px;
  gap: 8px;
}

.search-box input {
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #0f172a;
  width: 200px;
}

.reco-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reco-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  transition: box-shadow .2s;
}

.reco-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,.08);
}

.reco-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.reco-body {
  flex: 1;
}

.reco-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.reco-name {
  font-weight: 600;
  color: #0f172a;
}

.reco-meta {
  color: #64748b;
  font-size: 0.875rem;
}

.reco-footer {
  display: flex;
  gap: 12px;
  margin-top: 6px;
}

.reco-type {
  font-size: 0.75rem;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
}

.reco-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.reco-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  transition: background .2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.action-btn:hover {
  background: #f1f5f9;
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #94a3b8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 480px;
  max-width: 95vw;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.modal-header button {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-body label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.modal-body input,
.modal-body textarea,
.modal-body select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
}

.modal-body textarea {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
}

:deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}
</style>