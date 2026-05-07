<script setup>
import { ref } from 'vue'

// étape actuelle
const forgotStep = ref(1)

// email
const email = ref('')
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// OTP
const otp = ref(['', '', '', '', '', ''])

// nouveau mot de passe
const newPassword = ref('')
const confirmPassword = ref('')

// envoyer code
const sendCode = () => {
  if (email.value === '') {
    alert('Email obligatoire')
    return
  }

  if (!emailRegex.test(email.value)) {
    alert('Veuillez entrer un email valide')
    return
  }

  alert('Un code a été envoyé à votre adresse e-mail')
  forgotStep.value = 2
}

// retour étape précédente
const previousStep = () => {
  if (forgotStep.value > 1) {
    forgotStep.value--
  }
}

// gestion OTP
const handleOtpInput = (index, event) => {
  const value = event.target.value

  if (value.length > 1) {
    otp.value[index] = value.slice(0, 1)
  }

  const inputs = document.querySelectorAll('.otp-input')

  if (value && index < inputs.length - 1) {
    inputs[index + 1].focus()
  }
}

// vérifier le code
const verifyCode = () => {
  const code = otp.value.join('')

  if (code.length < 6) {
    alert('Veuillez entrer le code complet')
    return
  }

  alert('Code vérifié avec succès')
  forgotStep.value = 3
}

// réinitialiser le mot de passe
const resetPassword = () => {
  if (newPassword.value === '') {
    alert('Nouveau mot de passe obligatoire')
    return
  }

  if (newPassword.value.length < 8) {
    alert('Le mot de passe doit contenir au moins 8 caractères')
    return
  }

  if (confirmPassword.value === '') {
    alert('Veuillez confirmer le mot de passe')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('Les mots de passe ne sont pas identiques')
    return
  }

  console.log('Email:', email.value)
  console.log('Nouveau mot de passe:', newPassword.value)

  forgotStep.value = 4

  alert('Mot de passe réinitialisé avec succès')
}
const goToLogin = () => {
  alert('Retour à la connexion')
}

</script>

<template>
  <div class="forgot-page">

    <!-- LEFT PANEL -->
<section class="left-panel">
      <div class="left-top">
        <div class="logo">
          <div class="logo-icon">P</div>
          <span class="logo-name">Portfy</span>
        </div>

        <div class="decorative-circles">
          <span class="circle circle-teal"></span>
          <span class="circle circle-brown"></span>
        </div>
      </div>

      <div class="headline">
        <h1>
          <span class="line-white">Votre profil.</span>
          <span class="line-gold">Validé.</span>
          <span class="line-white">Certifié.</span>
        </h1>
      </div>

      <div class="stats-footer">
        <div class="stat">
          <span class="stat-value">2 400+</span>
          <span class="stat-label">Étudiants<br>actifs</span>
        </div>

        <div class="stat">
          <span class="stat-value accent-green">140+</span>
          <span class="stat-label">Entreprises</span>
        </div>

        <div class="stat">
          <span class="stat-value">98%</span>
          <span class="stat-label">Profils vérifiés</span>
        </div>
      </div>
    </section>

    <!-- RIGHT PANEL -->
    <section class="right-panel">
      <div class="forgot-container">

        <!-- bouton retour -->
        <button
          v-if="forgotStep > 1"
          type="button"
          class="back-login"
          @click="previousStep"
        >
          ‹ Étape précédente
        </button>

        <button
          v-else
          type="button"
          class="back-login"
        >
          ‹ Retour à la connexion
        </button>

        <!-- progress -->
        <div v-if="forgotStep < 4" class="forgot-progress">
  <span :class="{ active: forgotStep >= 1, dark: forgotStep >= 1 }"></span>
  <span :class="{ active: forgotStep >= 2, dark: forgotStep >= 2 }"></span>
  <span :class="{ active: forgotStep >= 3, gold: forgotStep >= 3 }"></span>
</div>

        <!-- STEP 1 -->
        <div v-if="forgotStep === 1">
          <div class="forgot-header">
            <h2>Mot de passe oublié</h2>
            <p>
              Entrez l’adresse e-mail liée à votre compte.
              Nous vous enverrons un code de vérification.
            </p>
          </div>

          <form class="forgot-form" @submit.prevent="sendCode">
            <div class="field-group">
              <label>Adresse e-mail</label>
              <div class="input-wrapper">
                <input
                  v-model="email"
                  type="email"
                  placeholder="votre.email@institution.ma"
                >
              </div>
            </div>

            <button class="btn-submit" type="submit">
              Envoyer le code →
            </button>
          </form>

          <div class="forgot-footer">
            <p>
              Vous vous souvenez du mot de passe ?
              <a href="#">Se connecter</a>
            </p>

            <div class="secure-line">
              <span></span>
              <p>🔒 Lien sécurisé · Expire dans 15 min</p>
              <span></span>
            </div>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-if="forgotStep === 2">
          <div class="forgot-header">
            <h2>Vérification OTP</h2>
            <p>
              Un code à 6 chiffres a été envoyé à
              <strong>votre adresse e-mail</strong>
            </p>
          </div>

          <div class="otp-boxes">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              v-model="otp[index]"
              class="otp-input"
              type="text"
              maxlength="1"
              @input="handleOtpInput(index, $event)"
            >
          </div>

          <div class="otp-info">
            <p>Code expire dans <strong>02:00</strong></p>
            <p>
              Vous n’avez pas reçu le code ?
              <button type="button">Renvoyer</button>
            </p>
          </div>

          <button class="btn-submit" type="button" @click="verifyCode">
            Vérifier le code →
          </button>

          <div class="forgot-footer">
            <div class="secure-line">
              <span></span>
              <p>🔒 Code à usage unique · Expiration automatique</p>
              <span></span>
            </div>
          </div>
        </div>

        <!-- STEP 3 -->
        <div v-if="forgotStep === 3">
          <div class="forgot-header">
            <h2>Nouveau mot de passe</h2>
            <p>
              Votre nouveau mot de passe doit être unique
              et différent des précédents.
            </p>
          </div>

          <form class="forgot-form" @submit.prevent="resetPassword">
            <div class="field-group">
              <label>Nouveau mot de passe</label>
              <div class="input-wrapper password-wrapper">
                <span class="password-icon">🔒</span>
                <input
                  v-model="newPassword"
                  type="password"
                  placeholder="Min. 8 caractères"
                >
              </div>
            </div>

            <div class="field-group">
              <label>Confirmer le mot de passe</label>
              <div class="input-wrapper password-wrapper">
                <span class="password-icon">🔒</span>
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Retapez votre mot de passe"
                >
              </div>
            </div>

            <button class="btn-submit btn-gold" type="submit">
              Réinitialiser le mot de passe →
            </button>
          </form>

          <div class="forgot-footer">
            <div class="secure-line">
              <span></span>
              <p>🔒 Chiffrement AES-256 · Données sécurisées</p>
              <span></span>
            </div>
          </div>
        </div>
        <!-- STEP 4 -->
<div v-if="forgotStep === 4" class="success-step">
  <div class="success-icon">
    ✓
  </div>

  <h2>Mot de passe changé !</h2>

  <p>
    Votre mot de passe a été modifié avec succès.
  </p>

  <button class="success-btn" type="button" @click="goToLogin">
    Retour à la connexion
  </button>
</div>

      </div>
    </section>
  </div>
</template>