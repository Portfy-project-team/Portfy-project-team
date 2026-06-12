<template>
  <div class="admin-moderation-page">
    <AdminSidebar />

    <div class="admin-main">
      <AdminTopbar title="Moderation et signalements" />

      <main class="admin-content">
        <section v-if="urgentCount > 0" class="alert-box">
          <div class="alert-icon">⚠️</div>
          <div>
            <h2>{{ urgentCount }} signalements urgents necessitent votre attention</h2>
            <p>Contenus signales par plusieurs utilisateurs - action recommandee</p>
          </div>
        </section>

        <section class="stats-grid">
          <div class="stat-card">
            <p>Signalements actifs</p>
            <h3>{{ activeReports.length }}</h3>
          </div>

          <div class="stat-card">
            <p>Resolus ce mois</p>
            <h3>{{ resolvedThisMonth }}</h3>
          </div>

          <div class="stat-card">
            <p>Comptes suspendus</p>
            <h3>{{ suspendedAccounts }}</h3>
          </div>

          <div class="stat-card">
            <p>Avertissements</p>
            <h3>{{ warnings }}</h3>
          </div>
        </section>

        <section class="tabs">
          <button
            type="button"
            :class="{ active: selectedFilter === 'TOUS' }"
            @click="selectedFilter = 'TOUS'"
          >
            Tous ({{ activeReports.length }})
          </button>

          <button
            type="button"
            :class="{ active: selectedFilter === 'PROJET' }"
            @click="selectedFilter = 'PROJET'"
          >
            Projets ({{ countByType('PROJET') }})
          </button>

          <button
            type="button"
            :class="{ active: selectedFilter === 'COMMENTAIRE' }"
            @click="selectedFilter = 'COMMENTAIRE'"
          >
            Commentaires ({{ countByType('COMMENTAIRE') }})
          </button>

          <button
            type="button"
            :class="{ active: selectedFilter === 'PROFIL' }"
            @click="selectedFilter = 'PROFIL'"
          >
            Profils ({{ countByType('PROFIL') }})
          </button>
        </section>

        <section class="reports-list">
          <article
            v-for="item in filteredReports"
            :key="item.id"
            class="report-card"
            :class="item.type === 'PROJET' ? 'danger-border' : 'warning-border'"
          >
            <div class="report-main">
              <div class="report-meta">
                <span class="type-badge" :class="item.type === 'PROJET' ? 'project' : 'comment'">
                  {{ item.type }}
                </span>

                <span class="flags-badge">
                  {{ item.flags || 0 }} signalements
                </span>

                <span class="date-text">
                  {{ item.date || 'Il y a 2 heures' }}
                </span>
              </div>

              <h2>{{ item.title }}</h2>

              <p class="author">
                <span v-if="item.type === 'PROJET'">Signale par : </span>
                <span v-else>Auteur : </span>
                <strong>{{ item.author }}</strong>
                <span v-if="item.establishment"> - {{ item.establishment }}</span>
              </p>

              <div class="reason-box">
                "{{ item.reason || 'Contenu signale par plusieurs utilisateurs.' }}"
              </div>
            </div>

            <div class="report-actions">
              <button class="delete-btn" type="button" @click="deleteReport(item.id)">
                Supprimer
              </button>

              <button class="ignore-btn" type="button" @click="ignoreReport(item.id)">
                Ignorer
              </button>

              <button
                v-if="item.type === 'PROJET'"
                class="link-btn"
                type="button"
                @click="openDetails(item)"
              >
                Voir projet
              </button>

              <button
                v-else
                class="link-btn"
                type="button"
                @click="warnUser(item)"
              >
                Avertir
              </button>
            </div>
          </article>

          <div v-if="filteredReports.length === 0" class="empty-state">
            <h3>Aucun signalement</h3>
            <p>Aucun element ne correspond au filtre selectionne.</p>
          </div>
        </section>
      </main>
    </div>

    <div v-if="selectedReport" class="modal-overlay" @click.self="closeDetails">
      <div class="modal">
        <div class="modal-header">
          <h2>Details du signalement</h2>
          <button type="button" @click="closeDetails">×</button>
        </div>

        <div class="modal-body">
          <p><strong>Type :</strong> {{ selectedReport.type }}</p>
          <p><strong>Titre :</strong> {{ selectedReport.title }}</p>
          <p><strong>Auteur :</strong> {{ selectedReport.author }}</p>
          <p><strong>Etablissement :</strong> {{ selectedReport.establishment || 'Non precise' }}</p>
          <p><strong>Signalements :</strong> {{ selectedReport.flags }}</p>
          <p><strong>Raison :</strong> {{ selectedReport.reason }}</p>
        </div>

        <div class="modal-actions">
          <button class="ignore-btn" type="button" @click="ignoreFromModal">
            Ignorer
          </button>

          <button class="delete-btn" type="button" @click="deleteFromModal">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { useModerationStore } from '@/store/admin/moderationStore'
import { useAdminStore } from '@/store/admin/adminStore'

const moderationStore = useModerationStore()
const adminStore = useAdminStore()

onMounted(async () => {
  await Promise.all([
    moderationStore.fetchModerationItems(),
    adminStore.fetchUsers()
  ])
})

const selectedFilter = ref('TOUS')
const selectedReport = ref(null)

const activeReports = computed(() => {
  return moderationStore.items.filter((item) => item.status !== 'RESOLUE' && item.status !== 'REJECTED')
})

const urgentCount = computed(() => {
  return activeReports.value.filter(item => item.flags > 2 || item.type === 'PROJET').length
})

const resolvedThisMonth = computed(() => {
   return moderationStore.items.filter(item => item.status === 'RESOLUE' || item.status === 'REJECTED').length
})

const suspendedAccounts = computed(() => {
  return adminStore.users.filter(u => u.status === 'Suspendu' || u.status === 'BLOCKED').length
})

const warnings = ref(0) // Still local for now as no warning model exists

const filteredReports = computed(() => {
  if (selectedFilter.value === 'TOUS') {
    return activeReports.value
  }
  return activeReports.value.filter((item) => item.type === selectedFilter.value)
})

const countByType = (type) => {
  return activeReports.value.filter((item) => item.type === type).length
}

const deleteReport = async (id) => {
  const confirmed = confirm('Voulez-vous vraiment supprimer ce contenu ?')
  if (confirmed) {
    try {
      await moderationStore.removeModerationItem(id)
      resolvedBase.value++
      alert('Contenu supprime.')
    } catch (err) {
      alert('Erreur lors de la suppression.')
    }
  }
}

const ignoreReport = async (id) => {
  try {
    await moderationStore.resolveModerationItem(id)
    resolvedBase.value++
    alert('Signalement ignore.')
  } catch (err) {
    alert('Erreur lors de la resolution.')
  }
}

const warnUser = (item) => {
  warnings.value++
  ignoreReport(item.id)
  alert(`Avertissement envoye a ${item.author}`)
}

const openDetails = (item) => {
  selectedReport.value = item
}

const closeDetails = () => {
  selectedReport.value = null
}

const deleteFromModal = () => {
  if (selectedReport.value) {
    deleteReport(selectedReport.value.id)
    closeDetails()
  }
}

const ignoreFromModal = () => {
  if (selectedReport.value) {
    ignoreReport(selectedReport.value.id)
    closeDetails()
  }
}
</script>

<style scoped>
.admin-moderation-page {
  min-height: 100vh;
  display: flex;
  background: #f4f1ed;
  color: #062f4f;
}

.admin-main {
  flex: 1;
  min-width: 0;
}

.admin-content {
  padding: 20px 22px;
}

.alert-box {
  min-height: 64px;
  border: 1px solid #ff2d2d;
  background: #ffe0e0;
  border-radius: 99px; /* Corrected from 9px for a pill shape if desired, but 9px was probably fine */
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 20px;
  margin-bottom: 15px;
}

.alert-icon {
  font-size: 22px;
}

.alert-box h2 {
  margin: 0;
  color: #e52525;
  font-size: 16px;
  font-weight: 900;
}

.alert-box p {
  margin: 4px 0 0;
  color: #b61d1d;
  font-size: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 13px;
  margin-bottom: 17px;
}

.stat-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 8px;
  padding: 16px;
  min-height: 76px;
}

.stat-card p {
  margin: 0;
  color: #415d76;
  font-size: 12px;
}

.stat-card h3 {
  margin: 6px 0 0;
  color: #000;
  font-size: 27px;
  font-weight: 900;
}

.tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.tabs button {
  border: 1px solid #dce4ea;
  background: #fff;
  color: #062f4f;
  border-radius: 999px;
  padding: 7px 18px;
  font-weight: 700;
  cursor: pointer;
}

.tabs button.active {
  background: #062f4f;
  color: #fff;
  border-color: #062f4f;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.report-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-left: 4px solid #f5a400;
  border-radius: 9px;
  padding: 15px 14px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.danger-border {
  border-left-color: #e52525;
}

.warning-border {
  border-left-color: #f5a400;
}

.report-main {
  flex: 1;
  min-width: 0;
}

.report-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 7px;
}

.type-badge,
.flags-badge {
  border-radius: 5px;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 900;
}

.type-badge.project {
  background: #ffd9d9;
  color: #e52525;
}

.type-badge.comment {
  background: #eee8ff;
  color: #6548dd;
}

.flags-badge {
  background: #fff0cd;
  color: #cc8200;
}

.date-text {
  color: #647585;
  font-size: 12px;
}

.report-card h2 {
  margin: 0;
  color: #000;
  font-size: 17px;
  font-weight: 900;
}

.author {
  margin: 7px 0 9px;
  color: #526b82;
  font-size: 13px;
}

.author strong {
  color: #526b82;
  font-weight: 900;
}

.reason-box {
  background: #f6f8fa;
  border-left: 2px solid #f5a400;
  border-radius: 5px;
  color: #162f44;
  font-size: 12px;
  font-style: italic;
  padding: 10px 13px;
  max-width: 1000px;
}

.report-actions {
  width: 105px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 7px;
}

.delete-btn,
.ignore-btn,
.link-btn {
  border-radius: 7px;
  font-weight: 900;
  cursor: pointer;
}

.delete-btn {
  border: none;
  background: #e52525;
  color: #fff;
  padding: 9px 14px;
}

.delete-btn:hover {
  background: #c91e1e;
}

.ignore-btn {
  border: 1px solid #c9efd9;
  background: #fff;
  color: #00834b;
  padding: 8px 14px;
}

.ignore-btn:hover {
  background: #f0fff6;
}

.link-btn {
  border: none;
  background: transparent;
  color: #f5a400;
  padding: 3px 0;
}

.link-btn:hover {
  text-decoration: underline;
}

.empty-state {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 40px;
  text-align: center;
}

.empty-state h3 {
  margin: 0;
  color: #000;
}

.empty-state p {
  color: #51697e;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  width: 470px;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.modal-header h2 {
  margin: 0;
  color: #000;
  font-size: 20px;
}

.modal-header button {
  border: none;
  background: transparent;
  font-size: 26px;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 9px;
  color: #334d63;
}

.modal-body p {
  margin: 0;
}

.modal-body strong {
  color: #000;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .report-card {
    flex-direction: column;
  }

  .report-actions {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
  }
}

@media (max-width: 760px) {
  .admin-moderation-page {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-wrap: wrap;
  }
}
</style>
