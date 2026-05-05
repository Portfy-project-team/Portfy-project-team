<template>
    <div class="login-page">
    <!-- LEFT PANEL -->
    <aside class="left-panel">
      <div class="left-top">
        <div class="logo">
          <span class="logo-icon">P</span>
          <span class="logo-name">Portfy</span>
        </div>
 
        <div class="decorative-circles">
          <div class="circle circle-teal"></div>
          <div class="circle circle-brown"></div>
        </div>
      </div>
 
      <div class="headline">
        <h1>
          <span class="line-white">Votre profil.</span>
          <span class="line-gold">Validé.</span>
          <span class="line-white">Certifié.</span>
        </h1>
      </div>
 
      <footer class="stats-footer">
        <div class="stat">
          <span class="stat-value">2 400+</span>
          <span class="stat-label">Étudiants<br />actifs</span>
        </div>
        <div class="stat">
          <span class="stat-value">140+</span>
          <span class="stat-label">Entreprises</span>
        </div>
        <div class="stat">
          <span class="stat -value accent-green">98%</span>
          <span class="stat-label">Profils vérifiés</span>
        </div>
      </footer>
    </aside>
 
    <!-- RIGHT PANEL -->
    <main class="right-panel">
      <div class="form-container">
        <!-- Tabs -->
        <div class="tabs" role="tablist">
          <button
            class="tab"
            :class="{ active: activeTab === 'connexion' }"
            @click="activeTab = 'connexion'"
            role="tab"
            :aria-selected="activeTab === 'connexion'"
          >
            Connexion
          </button>
          <router-link
            to="/register"
            class="tab tab-link"
            :class="{ active: activeTab === 'inscription' }"
            @click="activeTab = 'inscription'"
            role="tab"
          >
            Inscription
          </router-link>
        </div>
 
        <!-- Form Header -->
        <div class="form-header">
          <h2>Bon retour</h2>
          <p>Connectez-vous à votre espace étudiant Portfy.</p>
        </div>
 
        <!-- Form -->
        <form class="auth-form" @submit.prevent="handleLogin" novalidate>
          <div class="field-group">
            <label for="email">Adresse E-mail</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="votre.email@institution.ma"
                autocomplete="email"
                required
              />
            </div>
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>
 
          <div class="field-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
                <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
          </div>
 
          <div class="forgot-link-row">
            <router-link to="/forgot-password" class="forgot-link">Mot de passe oublié ?</router-link>
          </div>
 
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="!isLoading">Se connecter →</span>
            <span v-else class="loading-dots">
              <span></span><span></span><span></span>
            </span>
          </button>
 
          <p v-if="serverError" class="server-error">{{ serverError }}</p>
        </form>
 
        <!-- Footer -->
        <div class="form-footer">
          <p class="no-account">
            Pas de compte ?
            <router-link to="/register" class="inline-link">Continuer quand même</router-link>
          </p>
          <p class="security-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Connexion sécurisée. Données chiffrées.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../store/authStore'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import '../../styles/auth.css' // 👈 مهم

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('connexion')
const showPassword = ref(false)
const isLoading = ref(false)
const serverError = ref('')

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

function validate() {
  let valid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = "L'adresse e-mail est requise."
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Veuillez entrer une adresse e-mail valide."
    valid = false
  }

  if (!form.password) {
    errors.password = "Le mot de passe est requis."
    valid = false
  } else if (form.password.length < 6) {
    errors.password = "Le mot de passe doit comporter au moins 6 caractères."
    valid = false
  }

  return valid
}

async function handleLogin() {
  serverError.value = ''
  if (!validate()) return

  isLoading.value = true
  try {
    // simulate API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const fakeUser = {
      email: form.email
    }

    authStore.login(fakeUser)

    router.push('/dashboard')

  } catch (err) {
    serverError.value = "Identifiants incorrects."
  } finally {
    isLoading.value = false
  }
}
</script>