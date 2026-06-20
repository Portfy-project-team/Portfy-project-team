<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { api } from '../../store/authStore.js'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const fileInput = ref(null)
const avatarPreview = ref(localStorage.getItem('studentAvatar') || '')
const showPasswordModal = ref(false)
const passwordSaved = ref(false)
const portfolioDisabled = ref(false)
const twoFactorEnabled = ref(false)
const personalSaved = ref(false)
const academicSaved = ref(false)
const academicReadOnly = ref(false)
const loading = ref(true)

const personalForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  bio: '',
  phone: '',
  city: '',
  country: 'Maroc'
})

const academicForm = reactive({
  school: '',
  field: '',
  year: '',
  promotion: ''
})

const notifications = reactive({
  projectValidation: true,
  newRecommendations: true,
  newComments: true,
  completionReminders: true
})

const appearance = reactive({
  theme: localStorage.getItem('portfy-theme') === 'dark' ? 'Sombre' : 'Clair',
  language: localStorage.getItem('app_language') === 'ar' ? 'Arabe' : (localStorage.getItem('app_language') === 'en' ? 'Anglais' : 'Francais')
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(async () => {
  applyTheme(appearance.theme)
  await loadSettings()
})

async function loadSettings() {
  try {
    const res = await api.get('/settings')
    
    const data = res.data.data

    // Remplir le formulaire personnel
    const nameParts = data.fullName?.split(' ') || ['', '']
    personalForm.firstName = data.firstName || nameParts[0] || ''
    personalForm.lastName = data.lastName || nameParts.slice(1).join(' ') || ''
    personalForm.email = data.email || ''
    personalForm.bio = data.bio || ''
    personalForm.phone = data.phone || ''
    personalForm.city = data.city || ''
    personalForm.country = data.country || 'Maroc'

    // Remplir le formulaire académique
    academicForm.school = data.institution || data.etablissement || ''
    academicForm.field = data.filiere || ''
    academicForm.year = data.niveau || ''
    academicForm.promotion = data.anneePromotion || ''

    if (academicForm.school || academicForm.field || academicForm.year || academicForm.promotion) {
      academicReadOnly.value = true
    }

    loading.value = false
  } catch (err) {
    console.error('Erreur chargement paramètres:', err)
    loading.value = false
  }
}

const initials = computed(() => {
  const f = personalForm.firstName ? personalForm.firstName[0] : ''
  const l = personalForm.lastName ? personalForm.lastName[0] : ''
  return (f + l).toUpperCase() || 'U'
})

function openPhotoPicker() {
  fileInput.value.click()
}

function changePhoto(event) {
  const file = event.target.files[0]

  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  if (!allowedTypes.includes(file.type)) {
    alert('Veuillez choisir une image JPG ou PNG.')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    alert('La taille maximale est 2MB.')
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    avatarPreview.value = reader.result
    localStorage.setItem('studentAvatar', reader.result)
    window.dispatchEvent(new Event('student-avatar-updated'))
    alert('Photo modifiee avec succes.')
  }

  reader.readAsDataURL(file)
}

async function savePersonalInfo() {
  if (!personalForm.firstName.trim() || !personalForm.lastName.trim()) {
    alert('Veuillez remplir le prenom et le nom.')
    return
  }

  if (!personalForm.email.includes('@')) {
    alert('Email invalide.')
    return
  }

  try {
    await api.patch('/settings/profile', {
      firstName: personalForm.firstName,
      lastName: personalForm.lastName,
      email: personalForm.email,
      bio: personalForm.bio,
      phone: personalForm.phone,
      city: personalForm.city,
      country: personalForm.country
    })

    window.dispatchEvent(new Event('student-profile-updated'))

    personalSaved.value = true

    setTimeout(() => {
      personalSaved.value = false
    }, 2500)
  } catch (err) {
    console.error('Erreur sauvegarde profil:', err)
    alert('Erreur lors de la sauvegarde : ' + (err.response?.data?.message || err.message))
  }
}

async function saveAcademicInfo() {
  try {
    await api.patch('/settings/profile', {
      etablissement: academicForm.school,
      filiere: academicForm.field,
      niveau: academicForm.year,
      anneePromotion: academicForm.promotion
    })

    window.dispatchEvent(new Event('student-academic-updated'))

    academicSaved.value = true
    academicReadOnly.value = true

    setTimeout(() => {
      academicSaved.value = false
    }, 2500)
  } catch (err) {
    console.error('Erreur sauvegarde académique:', err)
    alert('Erreur lors de la sauvegarde : ' + (err.response?.data?.message || err.message))
  }
}

function editAcademicInfo() {
  academicReadOnly.value = false
}

function toggleNotification(key) {
  notifications[key] = !notifications[key]
  localStorage.setItem('studentNotifications', JSON.stringify(notifications))
}

function applyTheme(themeName) {
  const isDark = themeName === 'Sombre'
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  localStorage.setItem('portfy-theme', isDark ? 'dark' : 'light')
}

function saveAppearance() {
  applyTheme(appearance.theme)
  
  // Gestion de la langue
  let langCode = 'fr'
  if (appearance.language === 'Anglais') langCode = 'en'
  if (appearance.language === 'Arabe')   langCode = 'ar'
  
  locale.value = langCode
  localStorage.setItem('app_language', langCode)
  
  localStorage.setItem('studentAppearance', JSON.stringify(appearance))
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

async function changePassword() {
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

  try {
    await api.patch('/settings/password', {
      current: passwordForm.currentPassword,
      new: passwordForm.newPassword
    })

    passwordSaved.value = true
    setTimeout(() => {
      passwordSaved.value = false
      closePasswordModal()
    }, 2000)
  } catch (err) {
    console.error('Erreur changement mot de passe:', err)
    alert('Erreur : ' + (err.response?.data?.message || err.message || 'Impossible de changer le mot de passe'))
  }
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

async function deleteAccount() {
  const confirmed = confirm(
    'Action irreversible. Voulez-vous vraiment supprimer votre compte ?'
  )

  if (!confirmed) return

  try {
    await api.delete('/settings/account')

    alert('Compte supprime. Vous allez etre deconnecte.')
    localStorage.removeItem('token')
    window.location.href = '/login'
  } catch (err) {
    console.error('Erreur suppression compte:', err)
    alert('Erreur lors de la suppression du compte')
  }
}
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Parametres du compte" :show-search="false" />

      <main class="settings-page" v-if="!loading">
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
                    @click="openPhotoPicker"
                  >
                    Changer la photo
                  </button>

                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
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
              <p v-if="personalSaved" class="success-message">
                Modifications enregistrees avec succes.
              </p>
            </section>

            <section class="card">
              <div class="card-header-flex">
                <h3>Informations academiques</h3>
                <button v-if="academicReadOnly" type="button" class="edit-icon-btn" @click="editAcademicInfo">
                  Modifier
                </button>
              </div>
              <p class="card-subtitle">Votre parcours et institution</p>

              <div class="form-grid">
                <div class="form-group">
                  <label>Etablissement</label>
                  <input v-model="academicForm.school" type="text" :readonly="academicReadOnly" :class="{ 'readonly-field': academicReadOnly }" />
                </div>

                <div class="form-group">
                  <label>Filiere</label>
                  <input v-model="academicForm.field" type="text" :readonly="academicReadOnly" :class="{ 'readonly-field': academicReadOnly }" />
                </div>

                <div class="form-group">
                  <label>Annee d'etudes</label>
                  <input v-model="academicForm.year" type="text" :readonly="academicReadOnly" :class="{ 'readonly-field': academicReadOnly }" />
                </div>

                <div class="form-group">
                  <label>Annee promotion</label>
                  <input v-model="academicForm.promotion" type="text" :readonly="academicReadOnly" :class="{ 'readonly-field': academicReadOnly }" />
                </div>
              </div>

              <button
                v-if="!academicReadOnly"
                type="button"
                class="primary-btn"
                @click="saveAcademicInfo"
              >
                Enregistrer
              </button>
              <p v-if="academicSaved" class="success-message">
                Modifications enregistrees avec succes.
              </p>
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

      <div v-else class="loading">
        Chargement des paramètres...
      </div>
    </div>

    <div
      v-if="showPasswordModal"
      class="modal-overlay"
      @click.self="closePasswordModal"
    >
      <div class="modal-card">
        <template v-if="!passwordSaved">
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
        </template>
        <template v-else>
          <div class="success-content">
            <div class="success-icon-circle">✓</div>
            <h3>Succès !</h3>
            <p>Votre mot de passe a été modifié avec succès.</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-message {
  margin-top: 12px;
  color: #16a34a;
  font-weight: 700;
  font-size: 14px;
}

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
  background:  #0f3a4f;
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
  color:  #0f3a4f;
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
  background:  #0f3a4f;
  color: #ffffff;
  padding: 14px 22px;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #0f3a4f;
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
  box-shadow: 0 24px 60px  #0f3a4f;
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

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.edit-icon-btn {
  background: #f0a91f;
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.edit-icon-btn:hover {
  background: #d4951a;
}

.success-content {
  text-align: center;
  padding: 40px 20px;
}

.success-icon-circle {
  width: 80px;
  height: 80px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 20px;
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.success-content h3 {
  color: #0f172a;
  margin-bottom: 8px;
}

.success-content p {
  color: #64748b;
}

.readonly-field {
  background-color: #f8fafc !important;
  color: #64748b !important;
  border-style: dashed !important;
  cursor: default;
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