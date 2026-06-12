<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/store/authStore.js'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'
import FormationModal from '../../components/student/modals/FormationModal.vue'

const formationList = ref([])
const loading = ref(true)
const showFormationModal = ref(false)
const selectedFormation = ref(null)

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
      progressColor: 'green',
      label: 'Obtenu le',
      date: f.dateFin ? new Date(f.dateFin).toLocaleDateString('fr-FR') : 'N/A',
      tags: [f.specialite],
      iconColor: 'blue',
      links: ['Certificat']
    }))
  } catch (e) {
    console.error('Erreur chargement formations', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadFormations)

function openAddFormation() {
  selectedFormation.value = null
  showFormationModal.value = true
}

function openEditFormation(formation) {
  selectedFormation.value = formation
  showFormationModal.value = true
}

async function saveFormation(formationData) {
  try {
    const payload = {
      etablissement: formationData.provider,
      diplome: formationData.title,
      specialite: formationData.tags?.[0] || 'Général',
      dateFin: new Date().toISOString()
    }

    if (selectedFormation.value) {
      await api.put(`/formations/${selectedFormation.value.id}`, payload)
    } else {
      await api.post('/formations', payload)
    }
    await loadFormations()
    alert('Formation enregistree.')
  } catch (e) {
    console.error('Erreur sauvegarde formation', e)
    alert('Erreur lors de la sauvegarde.')
  } finally {
    closeFormationModal()
  }
}

async function removeFormation(id) {
  if (!confirm('Voulez-vous vraiment supprimer cette formation ?')) return
  try {
    await api.delete(`/formations/${id}`)
    await loadFormations()
    alert('Formation supprimee.')
  } catch (e) {
    console.error('Erreur suppression formation', e)
    alert('Impossible de supprimer la formation.')
  }
}

function closeFormationModal() {
  showFormationModal.value = false
  selectedFormation.value = null
}

function viewCertificate(formation) {
  alert('Aucun certificat disponible pour le moment.')
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Formations & Diplômes" />

      <main class="formations-page">
        <section class="page-header">
          <div>
            <h2>Mon parcours académique</h2>
            <p>Gérez vos diplômes, certifications et formations continues</p>
          </div>

          <button
            type="button"
            class="primary-btn"
            @click="openAddFormation"
          >
            Nouvelle formation
          </button>
        </section>

        <section class="formations-grid" v-if="!loading">
          <article
            v-for="formation in formationList"
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
                  type="button"
                  class="link-btn orange"
                  @click="viewCertificate(formation)"
                >
                  Certificat
                </button>
              </div>

              <div class="actions">
                <button
                  type="button"
                  class="edit-btn"
                  @click="openEditFormation(formation)"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  class="delete-btn"
                  @click="removeFormation(formation.id)"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </article>
          
          <div v-if="formationList.length === 0" class="empty-state">
            Aucune formation enregistrée pour le moment.
          </div>
        </section>
        
        <div v-else class="loading-state">Chargement...</div>
      </main>
    </div>

    <FormationModal
      v-if="showFormationModal"
      :formation-to-edit="selectedFormation"
      @close="closeFormationModal"
      @save="saveFormation"
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
}

.formations-page {
  padding: 32px 38px 60px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.page-header h2 { margin: 0 0 8px; font-size: 32px; font-weight: 800; color: #050505; }
.page-header p { margin: 0; color: #64748b; font-size: 17px; }

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

.formations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.formation-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.formation-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.formation-icon {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  flex-shrink: 0;
  background: #dff2ff;
}

.formation-info { flex: 1; }
.formation-info h3 { margin: 0 0 4px; font-size: 20px; font-weight: 800; color: #050505; }
.formation-info p { margin: 0; color: #64748b; font-size: 14px; }

.formation-meta { margin-bottom: 12px; font-size: 14px; color: #64748b; }
.formation-meta strong { color: #050505; margin-right: 5px; }

.tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.tag { background: #eaf3f8; color: #082a47; padding: 6px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; }

.card-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.actions { display: flex; gap: 15px; }

.link-btn, .edit-btn, .delete-btn {
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.link-btn.orange { color: #f59e0b; }
.edit-btn { color: #082a47; }
.delete-btn { color: #ef4444; }

.link-btn:hover, .edit-btn:hover, .delete-btn:hover { text-decoration: underline; }

.loading-state, .empty-state { text-align: center; padding: 50px; color: #64748b; }

@media (max-width: 1100px) { .formations-grid { grid-template-columns: 1fr; } }
@media (max-width: 700px) {
  .formations-page { padding: 22px; }
  .page-header { flex-direction: column; }
  .primary-btn { width: 100%; }
}
</style>
