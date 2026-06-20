<template>
  <div class="admin-settings-page">
    <AdminSidebar />

    <div class="admin-main">
      <AdminTopbar title="Parametres systeme" />

      <main class="admin-content">
        <section class="page-header">
          <h1>Configuration de la plateforme</h1>
          <p>Gerer les regles globales et les parametres systeme</p>
        </section>

        <section class="settings-grid" v-if="!settingsStore.loading">
          <div class="left-column">
            <div class="panel">
              <h2>Configuration generale</h2>
              <p>Parametres principaux de Portfy</p>

              <form class="general-form" @submit.prevent="saveGeneralSettings">
                <label>
                  Nom de la plateforme
                  <input v-model="general.platformName" type="text" />
                </label>

                <label>
                  Email de support
                  <input v-model="general.supportEmail" type="email" />
                </label>

                <label>
                  Langue par defaut
                  <select v-model="general.defaultLanguage">
                    <option value="Francais">Francais</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Arabe">Arabe</option>
                  </select>
                </label>

                <button class="primary-btn" type="submit">
                  Enregistrer
                </button>

                <p v-if="savedMessage" class="success-message">
                  Parametres enregistres avec succes.
                </p>
              </form>
            </div>

            <div class="panel">
              <h2>Configuration des badges</h2>
              <p>Regles d'attribution automatique</p>

              <div class="badges-list">
                <div
                  v-for="badge in badges"
                  :key="badge.id"
                  class="badge-rule"
                >
                  <div>
                    <strong>{{ badge.name }}</strong>
                    <span> - {{ badge.description }}</span>
                  </div>

                  <button
                    type="button"
                    class="toggle"
                    :class="{ active: badge.enabled }"
                    @click="badge.enabled = !badge.enabled"
                  >
                    <span></span>
                  </button>
                </div>
              </div>

              <button class="add-badge-btn" type="button" @click="openBadgeModal">
                + Ajouter un badge
              </button>
            </div>
          </div>

          <div class="right-column">
            <div class="panel">
              <h2>Calcul du score de credibilite</h2>
              <p>Ponderation sur 100 points</p>

              <div class="scores-list">
                <div
                  v-for="item in scoreItems"
                  :key="item.key"
                  class="score-item"
                >
                  <div class="score-header">
                    <span>{{ item.label }}</span>
                    <strong>{{ item.value }} pts</strong>
                  </div>

                  <input
                    v-model.number="item.value"
                    type="range"
                    min="0"
                    max="40"
                    step="5"
                  />
                </div>
              </div>

              <div class="score-total" :class="{ warning: totalScore !== 100 }">
                <span>Total</span>
                <strong>{{ totalScore }} / 100 pts</strong>
                <small v-if="totalScore !== 100">
                  Le total doit etre egal a 100 pts
                </small>
              </div>
            </div>

            <div class="panel">
              <h2>Notifications systeme</h2>

              <div class="notifications-list">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="notification-row"
                >
                  <span>{{ notification.label }}</span>

                  <button
                    type="button"
                    class="toggle"
                    :class="{ active: notification.enabled }"
                    @click="notification.enabled = !notification.enabled"
                  >
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section v-else class="loading-state">
           <p>Chargement des parametres...</p>
        </section>
      </main>
    </div>

    <div v-if="showBadgeModal" class="modal-overlay" @click.self="closeBadgeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Ajouter un badge</h2>
          <button type="button" @click="closeBadgeModal">×</button>
        </div>

        <form class="modal-form" @submit.prevent="addBadge">
          <label>
            Nom du badge
            <input v-model="newBadge.name" type="text" required />
          </label>

          <label>
            Regle d'attribution
            <input v-model="newBadge.description" type="text" required />
          </label>

          <div class="modal-actions">
            <button class="cancel-btn" type="button" @click="closeBadgeModal">
              Annuler
            </button>

            <button class="save-btn" type="submit">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'

import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { useAdminSettingsStore } from '@/store/admin/adminSettingsStore'

const settingsStore = useAdminSettingsStore()
const savedMessage = ref(false)
const showBadgeModal = ref(false)

const general = reactive({
  platformName: '',
  supportEmail: '',
  defaultLanguage: 'Francais'
})

onMounted(async () => {
  await settingsStore.fetchSettings()
  Object.assign(general, settingsStore.settings.general)
})

const badges = ref([
  { id: 1, name: 'Web Developer', description: '3 projets web valides', enabled: true },
  { id: 2, name: 'DevOps Beginner', description: 'Docker + CI/CD utilises', enabled: true },
  { id: 3, name: 'Hackathon', description: 'Participation a un hackathon', enabled: true }
])

const scoreItems = reactive([
  { key: 'projects', label: 'Projets valides', value: 20 },
  { key: 'stages', label: 'Stages valides', value: 20 },
  { key: 'recommendations', label: 'Recommandations', value: 15 },
  { key: 'git', label: 'Contributions Git', value: 15 },
  { key: 'profile', label: 'Completude profil', value: 15 },
  { key: 'formations', label: 'Formations', value: 15 }
])

const notifications = ref([
  { id: 1, label: 'Email aux nouveaux inscrits', enabled: true },
  { id: 2, label: 'Notifications de validation', enabled: true },
  { id: 3, label: 'Alertes de signalement', enabled: true },
  { id: 4, label: 'Rapport hebdomadaire', enabled: false }
])

const newBadge = reactive({
  name: '',
  description: ''
})

const totalScore = computed(() => {
  return scoreItems.reduce((total, item) => total + Number(item.value), 0)
})

const saveGeneralSettings = async () => {
  const success = await settingsStore.saveSettings(general)
  if (success) {
    savedMessage.value = true
    setTimeout(() => { savedMessage.value = false }, 2500)
  }
}

const openBadgeModal = () => {
  showBadgeModal.value = true
}

const closeBadgeModal = () => {
  showBadgeModal.value = false
  newBadge.name = ''
  newBadge.description = ''
}

const addBadge = () => {
  badges.value.push({
    id: Date.now(),
    name: newBadge.name,
    description: newBadge.description,
    enabled: true
  })
  closeBadgeModal()
}
</script>

<style scoped>
.admin-settings-page {
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

.page-header {
  margin-bottom: 14px;
}

.page-header h1 {
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 900;
}

.page-header p {
  margin: 4px 0 0;
  color: #4f6780;
  font-size: 13px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 18px;
}

.panel h2 {
  margin: 0;
  color: #000;
  font-size: 17px;
  font-weight: 900;
}

.panel p {
  margin: 5px 0 16px;
  color: #526b82;
  font-size: 12px;
}

.general-form {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.general-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #233b50;
  font-size: 13px;
  font-weight: 700;
}

.general-form input,
.general-form select {
  height: 33px;
  border: 1px solid #d9e1e8;
  border-radius: 7px;
  padding: 0 12px;
  background: #fff;
  color: #000;
  outline: none;
}

.general-form input:focus,
.general-form select:focus {
  border-color: #062f4f;
}

.primary-btn {
  width: fit-content;
  border: none;
  background: #062f4f;
  color: #fff;
  border-radius: 7px;
  padding: 9px 19px;
  font-weight: 900;
  cursor: pointer;
}

.primary-btn:hover {
  background: #041f34;
}

.success-message {
  margin: 0 !important;
  color: #00834b !important;
  font-weight: 700;
}

.badges-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.badge-rule {
  min-height: 36px;
  background: #f7f9fb;
  border-radius: 7px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-rule strong {
  color: #000;
  font-size: 14px;
}

.badge-rule span {
  color: #000;
  font-size: 14px;
}

.toggle {
  width: 35px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: #cbd5df;
  padding: 2px;
  cursor: pointer;
  transition: 0.2s;
}

.toggle span {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  display: block;
  transition: 0.2s;
}

.toggle.active {
  background: #18b77b;
}

.toggle.active span {
  transform: translateX(15px);
}

.add-badge-btn {
  width: 100%;
  height: 32px;
  margin-top: 12px;
  border: 1px solid #dce4ea;
  background: #fff;
  color: #062f4f;
  border-radius: 7px;
  font-weight: 900;
  cursor: pointer;
}

.add-badge-btn:hover {
  background: #f7f9fb;
}

.scores-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #233b50;
  font-size: 13px;
  margin-bottom: 7px;
}

.score-header strong {
  color: #000;
}

.score-item input[type="range"] {
  width: 100%;
  accent-color: #1478f2;
  cursor: pointer;
}

.score-total {
  background: #f7f9fb;
  border-radius: 7px;
  margin-top: 17px;
  padding: 12px;
  text-align: center;
}

.score-total span {
  display: block;
  color: #526b82;
  font-size: 12px;
}

.score-total strong {
  display: block;
  color: #f5a400;
  font-size: 24px;
  font-weight: 900;
}

.score-total small {
  display: block;
  color: #e52525;
  margin-top: 4px;
  font-weight: 700;
}

.score-total.warning {
  background: #fff8e6;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-top: 14px;
}

.notification-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #233b50;
  font-size: 13px;
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
  width: 430px;
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

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.modal-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #233b50;
  font-size: 13px;
  font-weight: 700;
}

.modal-form input {
  height: 39px;
  border: 1px solid #d9e1e8;
  border-radius: 7px;
  padding: 0 12px;
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.cancel-btn,
.save-btn {
  border: none;
  border-radius: 7px;
  padding: 9px 14px;
  font-weight: 900;
  cursor: pointer;
}

.cancel-btn {
  background: #e9edf1;
  color: #062f4f;
}

.save-btn {
  background: #062f4f;
  color: #fff;
}

.loading-state {
  padding: 40px;
  text-align: center;
  background: #fff;
  border-radius: 9px;
}

@media (max-width: 1000px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .admin-settings-page {
    flex-direction: column;
  }

  .modal {
    width: calc(100% - 30px);
  }
}
</style>
