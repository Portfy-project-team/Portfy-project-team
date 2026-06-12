<script setup>
import { computed, reactive, ref } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

const fileInput = ref(null)
const avatarPreview = ref('')
const showPasswordModal = ref(false)
const portfolioDisabled = ref(false)
const twoFactorEnabled = ref(false)

const personalForm = reactive({
  firstName: 'Insaf',
  lastName: 'Hamdane',
  email: 'hamdane.insaf@etu.uae.ac.ma',
  phone: '+212 6 12 34 56 78',
  bio: 'Passionne par le developpement web et les nouvelles technologies.',
  city: 'Tanger',
  country: 'Maroc'
})

const academicForm = reactive({
  school: 'ENSA Tanger',
  field: 'Genie Informatique',
  year: '1ere annee',
  promotion: '2028'
})

const notifications = reactive({
  projectValidation: true,
  newRecommendations: true,
  newComments: true,
  completionReminders: true
})

const appearance = reactive({
  theme: 'Clair',
  language: 'Francais'
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const initials = computed(() => {
  return `${personalForm.firstName[0] || ''}${personalForm.lastName[0] || ''}`.toUpperCase()
})

function triggerFileInput() {
  fileInput.value.click()
}

function changePhoto(event) {
  const file = event.target.files[0]

  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/png']

  if (!allowedTypes.includes(file.type)) {
    alert('Veuillez choisir une image JPG ou PNG.')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    alert('La taille maximale est 2MB.')
    return
  }

  avatarPreview.value = URL.createObjectURL(file)
  alert('Photo modifiee avec succes.')
}

function savePersonalInfo() {
  if (!personalForm.firstName.trim() || !personalForm.lastName.trim()) {
    alert('Veuillez remplir le prenom et le nom.')
    return
  }

  if (!personalForm.email.includes('@')) {
    alert('Email invalide.')
    return
  }

  localStorage.setItem('studentPersonalInfo', JSON.stringify(personalForm))
  alert('Informations personnelles enregistrees avec succes.')
}

function saveAcademicInfo() {
  localStorage.setItem('studentAcademicInfo', JSON.stringify(academicForm))
  alert('Informations academiques enregistrees avec succes.')
}

function toggleNotification(key) {
  notifications[key] = !notifications[key]
  localStorage.setItem('studentNotifications', JSON.stringify(notifications))
}

function saveAppearance() {
  localStorage.setItem('studentAppearance', JSON.stringify(appearance))
  alert('Preferences d’apparence enregistrees.')
}

function openPasswordModal() {
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
  resetPasswordForm()
}

function resetPasswordForm() {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

function changePassword() {
  if (
    !passwordForm.currentPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmPassword
  ) {
    alert('Veuillez remplir tous les champs.')
    return
  }

  if (passwordForm.newPassword.length < 8) {
    alert('Le nouveau mot de passe doit contenir au moins 8 caracteres.')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('Les mots de passe ne correspondent pas.')
    return
  }

  alert('Mot de passe change avec succes.')
  closePasswordModal()
}

function toggleTwoFactor() {
  twoFactorEnabled.value = !twoFactorEnabled.value

  if (twoFactorEnabled.value) {
    alert('2FA active avec succes.')
  } else {
    alert('2FA desactive.')
  }
}

function disablePortfolio() {
  const confirmed = confirm('Voulez-vous vraiment desactiver votre portfolio ?')

  if (!confirmed) return

  portfolioDisabled.value = true
  alert('Portfolio desactive.')
}

function deleteAccount() {
  const confirmed = confirm(
    'Action irreversible. Voulez-vous vraiment supprimer votre compte ?'
  )

  if (!confirmed) return

  alert('Demande de suppression du compte envoyee.')
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Parametres du compte" user-initials="IH" />

      <main class="settings-page">
        <section class="page-header">
          <h2>Parametres du compte</h2>
          <p>Gerez votre profil et vos preferences</p>
        </section>

        <div class="settings-grid">
          <div class="left-column">
            <section class="card">
              <h3>Informations personnelles</h3>
              <p class="card-subtitle">Mettez a jour votre profil etudiant</p>

              <div class="photo-row">
                <div class="avatar">
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Photo profil"
                  />
                  <span v-else>{{ initials }}</span>
                </div>

                <div>
                  <button
                    type="button"
                    class="primary-btn small"
                    @click="triggerFileInput"
                  >
                    Changer la photo
                  </button>

                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/png, image/jpeg"
                    class="hidden-input"
                    @change="changePhoto"
                  />

                  <p class="hint">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Prenom</label>
                  <input v-model="personalForm.firstName" type="text" />
                </div>

                <div class="form-group">
                  <label>Nom</label>
                  <input v-model="personalForm.lastName" type="text" />
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input v-model="personalForm.email" type="email" />
                </div>

                <div class="form-group">
                  <label>Telephone</label>
                  <input v-model="personalForm.phone" type="text" />
                </div>
              </div>

              <div class="form-group">
                <label>Bio / Presentation</label>
                <textarea v-model="personalForm.bio"></textarea>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Ville</label>
                  <input v-model="personalForm.city" type="text" />
                </div>

                <div class="form-group">
                  <label>Pays</label>
                  <select v-model="personalForm.country">
                    <option>Maroc</option>
                    <option>France</option>
                    <option>Espagne</option>
                    <option>Allemagne</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                class="primary-btn"
                @click="savePersonalInfo"
              >
                Enregistrer les modifications
              </button>
            </section>

            <section class="card">
              <h3>Informations academiques</h3>
              <p class="card-subtitle">Votre parcours et institution</p>

              <div class="form-grid">
                <div class="form-group">
                  <label>Etablissement</label>
                  <select v-model="academicForm.school">
                    <option>ENSA Tanger</option>
                    <option>FSJES Tanger</option>
                    <option>FST Tanger</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Filiere</label>
                  <select v-model="academicForm.field">
                    <option>Genie Informatique</option>
                    <option>Genie Reseaux</option>
                    <option>Genie Industriel</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Annee d'etudes</label>
                  <select v-model="academicForm.year">
                    <option>1ere annee</option>
                    <option>2eme annee</option>
                    <option>3eme annee</option>
                    <option>4eme annee</option>
                    <option>5eme annee</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Annee promotion</label>
                  <input v-model="academicForm.promotion" type="text" />
                </div>
              </div>

              <button
                type="button"
                class="primary-btn"
                @click="saveAcademicInfo"
              >
                Enregistrer
              </button>
            </section>
          </div>

          <aside class="right-column">
            <section class="card side-card">
              <h3>Notifications</h3>
              <p class="card-subtitle">Gerez vos alertes</p>

              <div class="setting-line">
                <span>Validation de projet</span>
                <button
                  type="button"
                  class="switch"
                  :class="{ active: notifications.projectValidation }"
                  @click="toggleNotification('projectValidation')"
                >
                  <span></span>
                </button>
              </div>

              <div class="setting-line">
                <span>Nouvelles recommandations</span>
                <button
                  type="button"
                  class="switch"
                  :class="{ active: notifications.newRecommendations }"
                  @click="toggleNotification('newRecommendations')"
                >
                  <span></span>
                </button>
              </div>

              <div class="setting-line">
                <span>Commentaires recus</span>
                <button
                  type="button"
                  class="switch"
                  :class="{ active: notifications.newComments }"
                  @click="toggleNotification('newComments')"
                >
                  <span></span>
                </button>
              </div>

              <div class="setting-line">
                <span>Rappels de completion</span>
                <button
                  type="button"
                  class="switch"
                  :class="{ active: notifications.completionReminders }"
                  @click="toggleNotification('completionReminders')"
                >
                  <span></span>
                </button>
              </div>
            </section>

            <section class="card side-card">
              <h3>Securite</h3>
              <p class="card-subtitle">Protegez votre compte</p>

              <button
                type="button"
                class="outline-btn"
                @click="openPasswordModal"
              >
                Changer le mot de passe
              </button>

              <button
                type="button"
                class="outline-btn"
                @click="toggleTwoFactor"
              >
                {{ twoFactorEnabled ? 'Desactiver 2FA' : 'Activer 2FA' }}
              </button>
            </section>

            <section class="card side-card">
              <h3>Apparence</h3>
              <p class="card-subtitle">Personnalisez l'interface</p>

              <div class="form-group">
                <label>Theme</label>
                <select v-model="appearance.theme" @change="saveAppearance">
                  <option>Clair</option>
                  <option>Sombre</option>
                </select>
              </div>

              <div class="form-group">
                <label>Langue</label>
                <select v-model="appearance.language" @change="saveAppearance">
                  <option>Francais</option>
                  <option>Anglais</option>
                  <option>Arabe</option>
                </select>
              </div>
            </section>

            <section class="card danger-card">
              <h3>Zone de danger</h3>
              <p class="card-subtitle">Actions irreversibles</p>

              <button
                type="button"
                class="danger-outline-btn"
                :disabled="portfolioDisabled"
                @click="disablePortfolio"
              >
                {{ portfolioDisabled ? 'Portfolio desactive' : 'Desactiver le portfolio' }}
              </button>

              <button
                type="button"
                class="danger-btn"
                @click="deleteAccount"
              >
                Supprimer le compte
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>

    <div
      v-if="showPasswordModal"
      class="modal-overlay"
      @click.self="closePasswordModal"
    >
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Changer le mot de passe</h3>
            <p>Choisissez un nouveau mot de passe securise</p>
          </div>

          <button
            type="button"
            class="close-btn"
            @click="closePasswordModal"
          >
            ×
          </button>
        </div>

        <div class="form-group">
          <label>Mot de passe actuel</label>
          <input v-model="passwordForm.currentPassword" type="password" />
        </div>

        <div class="form-group">
          <label>Nouveau mot de passe</label>
          <input v-model="passwordForm.newPassword" type="password" />
        </div>

        <div class="form-group">
          <label>Confirmer le mot de passe</label>
          <input v-model="passwordForm.confirmPassword" type="password" />
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="cancel-btn"
            @click="closePasswordModal"
          >
            Annuler
          </button>

          <button
            type="button"
            class="primary-btn"
            @click="changePassword"
          >
            Enregistrer
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

.settings-page {
  padding: 28px 34px 60px;
}

.page-header {
  margin-bottom: 24px;
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
  font-size: 16px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 23px;
  font-weight: 900;
  color: #050505;
}

.card-subtitle {
  margin: 0 0 22px;
  color: #64748b;
  font-size: 15px;
}

.photo-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 22px;
}

.avatar {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #082a47;
  color: #ffd24a;
  border: 3px dashed #cfe0ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden-input {
  display: none;
}

.hint {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #082a47;
  font-size: 14px;
  font-weight: 800;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  padding: 13px 14px;
  font-size: 15px;
  outline: none;
  background: #ffffff;
}

.form-group textarea {
  min-height: 70px;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #f0a91f;
  box-shadow: 0 0 0 3px rgba(240, 169, 31, 0.18);
}

.primary-btn {
  border: none;
  border-radius: 9px;
  background: #082a47;
  color: #ffffff;
  padding: 14px 22px;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #0b3558;
}

.primary-btn.small {
  padding: 12px 20px;
}

.side-card {
  padding: 22px;
}

.setting-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  color: #334155;
  font-size: 15px;
}

.switch {
  width: 36px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: #cbd5e1;
  padding: 2px;
  cursor: pointer;
}

.switch span {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  transition: 0.2s;
}

.switch.active {
  background: #10b981;
}

.switch.active span {
  transform: translateX(16px);
}

.outline-btn {
  width: 100%;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #082a47;
  border-radius: 9px;
  padding: 13px 14px;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 12px;
}

.outline-btn:hover {
  border-color: #082a47;
}

.danger-card {
  background: #fff1f1;
  border-color: #ffa6a6;
}

.danger-card h3 {
  color: #dc2626;
}

.danger-outline-btn,
.danger-btn {
  width: 100%;
  border-radius: 9px;
  padding: 13px 14px;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 12px;
}

.danger-outline-btn {
  background: #ffffff;
  border: 1px solid #ff8a8a;
  color: #dc2626;
}

.danger-outline-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.danger-btn {
  background: #dc2626;
  border: 1px solid #dc2626;
  color: #ffffff;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 42, 71, 0.62);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 24px 60px rgba(8, 42, 71, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.modal-header h3 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 900;
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #64748b;
  border-radius: 9px;
  padding: 14px 18px;
  font-weight: 900;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .settings-page {
    padding: 24px 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .photo-row {
    align-items: flex-start;
  }
}
</style>