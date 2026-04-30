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
          <span class="stat-value accent-green">98%</span>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    // TODO: Replace with your actual API call
    await new Promise((resolve) => setTimeout(resolve, 1200))
    router.push('/dashboard')
  } catch (err) {
    serverError.value = "Identifiants incorrects. Veuillez réessayer."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ─── Root Layout ─────────────────────────────────────── */
.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ─── LEFT PANEL ──────────────────────────────────────── */
.left-panel {
  width: 42%;
  background-color: var(--main-dark, #001f2e);
  display: flex;
  flex-direction: column;
  padding: 2.5rem 3rem;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.left-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  z-index: 1;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background-color: var(--accent-gold, #ffd700);
  color: var(--main-dark, #001f2e);
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.logo-name {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Decorative Circles */
.decorative-circles {
  position: relative;
  width: 120px;
  height: 100px;
}

.circle {
  position: absolute;
  border-radius: 50%;
}

.circle-teal {
  width: 80px;
  height: 80px;
  background-color: #2a8a8a;
  opacity: 0.8;
  top: 0;
  right: 10px;
}

.circle-brown {
  width: 64px;
  height: 64px;
  background-color: #5a4035;
  opacity: 0.75;
  top: 30px;
  right: 40px;
}

/* Headline */
.headline {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.headline h1 {
  display: flex;
  flex-direction: column;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0;
  gap: 0.1em;
}

.line-white {
  color: #ffffff;
}

.line-gold {
  color: var(--accent-gold, #ffd700);
}

/* Stats Footer */
.stats-footer {
  display: flex;
  gap: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-value {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
}

.stat-value.accent-green {
  color: #4ecb8d;
}

.stat-label {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.75rem;
  line-height: 1.4;
}

/* ─── RIGHT PANEL ─────────────────────────────────────── */
.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: #ffffff;
}

.form-container {
  width: 100%;
  max-width: 480px;
}

/* ─── TABS ────────────────────────────────────────────── */
.tabs {
  display: flex;
  border: 1px solid #d0dde3;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2.5rem;
}

.tab {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7f8a;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.tab.active {
  background-color: var(--main-dark, #001f2e);
  color: #ffffff;
}

.tab:not(.active):hover {
  background-color: #f0f5f7;
  color: var(--main-dark, #001f2e);
}

/* ─── FORM HEADER ─────────────────────────────────────── */
.form-header {
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--main-dark, #001f2e);
  margin: 0 0 0.4rem;
}

.form-header p {
  font-size: 0.9rem;
  color: #6b7f8a;
  margin: 0;
}

/* ─── FORM FIELDS ─────────────────────────────────────── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-group label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #3a4f5a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #8fa9b5;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  background-color: var(--input-bg, #e2eff2);
  border: 1.5px solid transparent;
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--main-dark, #001f2e);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;
}

.input-wrapper input::placeholder {
  color: #a0b8c2;
}

.input-wrapper input:focus {
  border-color: var(--main-dark, #001f2e);
  background-color: #d8eaef;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #8fa9b5;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: var(--main-dark, #001f2e);
}

.field-error {
  font-size: 0.78rem;
  color: #e05252;
  margin-top: 0.1rem;
}

/* ─── FORGOT PASSWORD ─────────────────────────────────── */
.forgot-link-row {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.6rem;
}

.forgot-link {
  font-size: 0.83rem;
  color: #6b7f8a;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: var(--main-dark, #001f2e);
}

/* ─── SUBMIT BUTTON ───────────────────────────────────── */
.btn-submit {
  width: 100%;
  padding: 1rem;
  background-color: var(--main-dark, #001f2e);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s, transform 0.15s;
  margin-top: 0.4rem;
}

.btn-submit:hover:not(:disabled) {
  background-color: #003450;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Loading dots */
.loading-dots {
  display: flex;
  gap: 5px;
  align-items: center;
}

.loading-dots span {
  width: 7px;
  height: 7px;
  background: #ffffff;
  border-radius: 50%;
  animation: bounce 1.2s infinite ease-in-out;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.75); opacity: 0.5; }
  40%            { transform: scale(1);    opacity: 1; }
}

/* Server error */
.server-error {
  font-size: 0.85rem;
  color: #e05252;
  text-align: center;
  margin: 0;
}

/* ─── FORM FOOTER ─────────────────────────────────────── */
.form-footer {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}

.no-account {
  font-size: 0.85rem;
  color: #6b7f8a;
  margin: 0;
}

.inline-link {
  color: var(--main-dark, #001f2e);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.security-note {
  font-size: 0.78rem;
  color: #a0b8c2;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* ─── RESPONSIVE ──────────────────────────────────────── */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    padding: 2rem 1.5rem 1.5rem;
    min-height: auto;
  }

  .headline h1 {
    font-size: 1.8rem;
  }

  .stats-footer {
    gap: 1.5rem;
  }

  .right-panel {
    padding: 2.5rem 1.25rem;
    align-items: flex-start;
  }

  .form-container {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .left-panel {
    display: none;
  }

  .right-panel {
    padding: 2rem 1rem;
  }
}
</style>