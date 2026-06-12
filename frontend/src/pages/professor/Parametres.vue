<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">Paramètres</h2>
      <p class="page-subtitle">Gérez vos informations et préférences</p>
    </div>

    <div class="settings-grid">
      <!-- Profile -->
      <div class="settings-card">
        <div class="section-header">
          <User size="20" />
          <h3>Profil</h3>
        </div>
        <div class="form-group">
          <label>Nom complet</label>
          <input v-model="form.fullName" type="text" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" />
        </div>
        <div class="form-group">
          <label>Téléphone</label>
          <input v-model="form.phone" type="tel" />
        </div>
        <div class="form-group">
          <label>Établissement</label>
          <input v-model="form.institution" type="text" />
        </div>
        <button class="btn-save" @click="saveProfile">
          <Save size="16" /> Enregistrer
        </button>
      </div>

      <!-- Notifications -->
      <div class="settings-card">
        <div class="section-header">
          <Bell size="20" />
          <h3>Notifications</h3>
        </div>
        <div class="toggle-group">
          <div class="toggle-item">
            <label>Recommandations publiées</label>
            <label class="switch">
              <input v-model="notifications.recommendations" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <label>Nouveaux commentaires</label>
            <label class="switch">
              <input v-model="notifications.comments" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <label>Portfolios visités</label>
            <label class="switch">
              <input v-model="notifications.portfolios" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <label>Résumé hebdomadaire</label>
            <label class="switch">
              <input v-model="notifications.weekly" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <button class="btn-save" style="margin-top: 20px;" @click="saveNotifications">
          <Save size="16" /> Enregistrer les préférences
        </button>
      </div>

      <!-- Affichage -->
      <div class="settings-card">
        <div class="section-header">
          <Settings size="20" />
          <h3>Affichage</h3>
        </div>
        <div class="form-group">
          <label>Langue</label>
          <select v-model="form.language">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div class="form-group">
          <label>Thème</label>
          <select v-model="form.theme">
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <button class="btn-save" @click="saveDisplay">
          <Save size="16" /> Appliquer
        </button>
      </div>

      <!-- Sécurité -->
      <div class="settings-card">
        <div class="section-header">
          <Lock size="20" />
          <h3>Sécurité & Confidentialité</h3>
        </div>
        <div class="form-group">
          <label>Mot de passe actuel</label>
          <input v-model="passwords.current" type="password" placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label>Nouveau mot de passe</label>
          <input v-model="passwords.new" type="password" placeholder="••••••••" />
          <p v-if="passwords.new && passwords.new.length < 8" class="field-error">Minimum 8 caractères</p>
        </div>
        <div class="form-group">
          <label>Confirmer le mot de passe</label>
          <input v-model="passwords.confirm" type="password" placeholder="••••••••" />
          <p v-if="passwords.confirm && passwords.new !== passwords.confirm" class="field-error">Les mots de passe ne correspondent pas</p>
        </div>
        <button class="btn-save" @click="changePassword">
          <Key size="16" /> Changer le mot de passe
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="settings-card danger">
        <div class="section-header">
          <AlertTriangle size="20" />
          <h3>Zone dangereuse</h3>
        </div>
        <p class="danger-text">Ces actions sont irréversibles. Votre compte et toutes vos données seront définitivement supprimés.</p>
        <button class="btn-danger" @click="showDeleteModal = true">
          <Trash2 size="16" /> Supprimer le compte
        </button>
      </div>
    </div>

    <!-- Modal suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal">
        <div class="modal-icon danger"><AlertTriangle size="24" /></div>
        <h3>Supprimer votre compte ?</h3>
        <p>Cette action est <strong>irréversible</strong>. Toutes vos données seront définitivement supprimées.</p>
        <div class="form-group" style="text-align: left; margin-bottom: 20px;">
          <label style="font-size: 0.8rem; font-weight: 600; color: #475569;">
            Tapez <strong>SUPPRIMER</strong> pour confirmer
          </label>
          <input v-model="deleteConfirmText" type="text" placeholder="SUPPRIMER" style="margin-top: 6px;" />
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false; deleteConfirmText = ''">Annuler</button>
          <button class="btn-confirm-delete" :disabled="deleteConfirmText !== 'SUPPRIMER'" @click="deleteAccount">
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <component :is="toast.icon" size="16" />
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { User, Bell, Settings, Lock, Key, AlertTriangle, Trash2, Save, CheckCircle, XCircle } from 'lucide-vue-next'
import { fetchSettings, saveProfileApi, savePasswordApi, deleteAccountApi } from '@/services/professor/settingsApi.js'

const router = useRouter()
const { locale } = useI18n()

const form = ref({
  fullName: '', email: '', phone: '', institution: '', language: 'fr', theme: 'light'
})
const notifications     = ref({ recommendations: true, comments: true, portfolios: true, weekly: false })
const passwords         = ref({ current: '', new: '', confirm: '' })
const showDeleteModal   = ref(false)
const deleteConfirmText = ref('')
const toast             = ref({ show: false, message: '', type: 'success', icon: CheckCircle })

onMounted(async () => {
  watch(() => form.value.theme, (val) => applyTheme(val))

  const savedTheme = localStorage.getItem('app_theme')
  const savedLang  = localStorage.getItem('app_language')
  if (savedTheme) { form.value.theme = savedTheme; applyTheme(savedTheme) }
  if (savedLang)  { form.value.language = savedLang }

  try {
    const data = await fetchSettings()
    form.value.fullName    = data.fullName
    form.value.email       = data.email
    form.value.phone       = data.phone       ?? ''
    form.value.institution = data.institution ?? ''
    form.value.language    = data.language    ?? 'fr'
    form.value.theme       = data.theme       ?? 'light'
    notifications.value    = data.notifications
  } catch {
    showToast('Erreur lors du chargement des paramètres.', 'error')
  }
})

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type, icon: type === 'success' ? CheckCircle : XCircle }
  setTimeout(() => { toast.value.show = false }, 3500)
}

async function saveProfile() {
  if (!form.value.fullName || !form.value.email) {
    showToast('Veuillez remplir tous les champs obligatoires.', 'error'); return
  }
  try {
    await saveProfileApi({
      fullName: form.value.fullName, email: form.value.email,
      phone: form.value.phone, institution: form.value.institution,
    })
    showToast('Profil enregistré avec succès.')
  } catch (e) {
    showToast(e.message ?? 'Erreur lors de la sauvegarde.', 'error')
  }
}

function saveNotifications() {
  showToast('Préférences de notifications mises à jour.')
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else if (theme === 'light') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    prefersDark
      ? document.documentElement.setAttribute('data-theme', 'dark')
      : document.documentElement.removeAttribute('data-theme')
  }
}

function saveDisplay() {
  localStorage.setItem('app_theme', form.value.theme)
  localStorage.setItem('app_language', form.value.language)
  locale.value = form.value.language
  applyTheme(form.value.theme)
  showToast("Paramètres d'affichage appliqués.")
}

async function changePassword() {
  if (!passwords.value.current) { showToast('Veuillez saisir votre mot de passe actuel.', 'error'); return }
  if (passwords.value.new.length < 8) { showToast('Minimum 8 caractères requis.', 'error'); return }
  if (passwords.value.new !== passwords.value.confirm) { showToast('Les mots de passe ne correspondent pas.', 'error'); return }
  try {
    await savePasswordApi({ current: passwords.value.current, new: passwords.value.new })
    passwords.value = { current: '', new: '', confirm: '' }
    showToast('Mot de passe modifié avec succès.')
  } catch (e) {
    showToast(e.message ?? 'Mot de passe actuel incorrect.', 'error')
  }
}

async function deleteAccount() {
  try {
    await deleteAccountApi()
    showDeleteModal.value = false
    deleteConfirmText.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('portfy_user')
    router.push('/login')
  } catch (e) {
    showToast(e.message ?? 'Erreur lors de la suppression.', 'error')
  }
}
</script>

<style scoped>
.page-content { padding: 24px 32px; background: var(--bg-app, #f8f9fb); min-height: 100%; }
.page-header { margin-bottom: 32px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--text-primary, #0f172a); margin: 0; }
.page-subtitle { color: var(--text-secondary, #64748b); font-size: 0.875rem; margin: 4px 0 0; }
.settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 24px; }
@media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
.settings-card { background: var(--bg-card, #fff); border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.06); border: 1px solid var(--border-color, #e2e8f0); }
.settings-card.danger { border-left: 4px solid #ef4444; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color, #e2e8f0); }
.section-header h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #0f172a); margin: 0; }
.section-header :deep(svg) { stroke-width: 2; color: #e5b230; flex-shrink: 0; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary, #475569); margin-bottom: 6px; }
.form-group input, .form-group select { width: 100%; padding: 10px 12px; border: 1px solid var(--border-color, #e2e8f0); border-radius: 8px; font-size: 0.875rem; color: var(--text-primary, #0f172a); background: var(--bg-input, #fff); outline: none; transition: border .2s; box-sizing: border-box; }
.form-group input:focus, .form-group select:focus { border-color: #e5b230; }
.field-error { color: #ef4444; font-size: 0.75rem; margin: 4px 0 0; }
.toggle-group { display: flex; flex-direction: column; gap: 12px; }
.toggle-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-toggle, #f8fafc); border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0); }
.toggle-item > label:first-child { margin: 0; font-size: 0.875rem; font-weight: 500; color: var(--text-primary, #0f172a); }
.switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; border-radius: 34px; transition: .3s; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: .3s; }
.switch input:checked + .slider { background: #e5b230; }
.switch input:checked + .slider:before { transform: translateX(20px); }
.btn-save { width: 100%; padding: 12px; background: #e5b230; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; transition: background .2s; }
.btn-save:hover { background: #d4a020; }
.danger-text { color: var(--text-secondary, #64748b); font-size: 0.875rem; margin-bottom: 16px; }
.btn-danger { width: 100%; padding: 12px; background: transparent; color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-danger:hover { background: rgba(239,68,68,0.1); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 16px; padding: 32px; width: 460px; max-width: 90vw; text-align: center; }
.modal-icon { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.modal-icon.danger { background: rgba(239,68,68,0.15); color: #ef4444; }
.modal h3 { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
.modal p { color: #64748b; font-size: 0.9rem; margin: 0 0 20px; }
.modal-actions { display: flex; gap: 12px; }
.btn-cancel { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; color: #475569; font-weight: 600; cursor: pointer; }
.btn-confirm-delete { flex: 1; padding: 10px; border: none; border-radius: 8px; background: #ef4444; color: #fff; font-weight: 600; cursor: pointer; transition: background .2s; }
.btn-confirm-delete:hover:not(:disabled) { background: #dc2626; }
.btn-confirm-delete:disabled { opacity: 0.4; cursor: not-allowed; }
.toast { position: fixed; bottom: 32px; right: 32px; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 10px; z-index: 2000; box-shadow: 0 4px 16px rgba(0,0,0,.2); }
.toast.success { background: #16a34a; }
.toast.error { background: #ef4444; }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
:deep(svg) { flex-shrink: 0; stroke-width: 2; color: currentColor; }
</style>