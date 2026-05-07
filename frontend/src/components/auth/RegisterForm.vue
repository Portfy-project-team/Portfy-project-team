<script setup>
import { ref } from 'vue'

// Step 1
const name = ref('')
const prenom = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const accepted = ref(false)

// Step 2
const formationType = ref('')
const etablissement = ref('')
const filiere = ref('')
const niveau = ref('')
const anneeEntree = ref('')
const diplomePrevu = ref('')

// Step 3
const bio = ref('')
const skills = ref(['React', 'Python', 'UX Design'])
const newSkill = ref('')
const disponibilite = ref('stage')
const linkedin = ref('')
const photoPreview = ref('')

// Current step
const currentStep = ref(1)

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const addSkill = () => {
  if (newSkill.value.trim() === '') {
    return
  }

  skills.value.push(newSkill.value.trim())
  newSkill.value = ''
}

const removeSkill = (index) => {
  skills.value.splice(index, 1)
}

const handlePhoto = (event) => {
  const file = event.target.files[0]

  if (file) {
    photoPreview.value = URL.createObjectURL(file)
  }
}

const nextStep = () => {
  if (currentStep.value === 1) {
    if (name.value === '') {
      alert('Nom obligatoire')
      return
    }

    if (prenom.value === '') {
      alert('Prénom obligatoire')
      return
    }

    if (email.value === '') {
      alert('Email obligatoire')
      return
    }

    if (!emailRegex.test(email.value)) {
      alert('Veuillez entrer un email valide')
      return
    }

    if (password.value.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    if (password.value !== confirmPassword.value) {
      alert('Les mots de passe ne sont pas identiques')
      return
    }

    if (!accepted.value) {
      alert('Vous devez accepter les conditions')
      return
    }
  }

  if (currentStep.value === 2) {
    if (formationType.value === '') {
      alert('Veuillez choisir le type de formation')
      return
    }

    if (etablissement.value === '') {
      alert('Établissement obligatoire')
      return
    }

    if (filiere.value === '') {
      alert('Filière obligatoire')
      return
    }

    if (niveau.value === '') {
      alert('Niveau d’études obligatoire')
      return
    }
  }

  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const register = () => {
  if (currentStep.value < 3) {
    nextStep()
    return
  }

  console.log('Nom:', name.value)
  console.log('Prénom:', prenom.value)
  console.log('Email:', email.value)
  console.log('Formation:', formationType.value)
  console.log('Établissement:', etablissement.value)
  console.log('Filière:', filiere.value)
  console.log('Niveau:', niveau.value)
  console.log('Bio:', bio.value)
  console.log('Skills:', skills.value)
  console.log('Disponibilité:', disponibilite.value)
  console.log('LinkedIn:', linkedin.value)

  alert('Inscription réussie !')
}
</script>

<template>
  <div class="register-page">

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

    <section class="right-panel">
      <div class="form-container">

        <div class="tabs">
          <button type="button" class="tab">Connexion</button>
          <button type="button" class="tab active">Inscription</button>
        </div>

        <div class="form-header">
          <template v-if="currentStep === 1">
            <h2>Créez votre compte</h2>
            <p>Rejoignez l'espace étudiant Portfy</p>
          </template>

          <template v-if="currentStep === 2">
            <h2>Votre formation</h2>
            <p>Renseignez votre établissement et votre cursus</p>
          </template>

          <template v-if="currentStep === 3">
            <h2>Votre profil</h2>
            <p>Dernière étape — donnez vie à votre portfolio</p>
          </template>
        </div>

        <div class="steps-section">
          <div class="steps-numbers">
            <span
              class="step-circle"
              :class="{ 'step-active': currentStep === 1, 'step-done': currentStep > 1 }"
            >
              {{ currentStep > 1 ? '✓' : '1' }}
            </span>

            <span class="step-line" :class="{ 'line-active': currentStep > 1 }"></span>

            <span
              class="step-circle"
              :class="{ 'step-active': currentStep === 2, 'step-done': currentStep > 2 }"
            >
              {{ currentStep > 2 ? '✓' : '2' }}
            </span>

            <span class="step-line" :class="{ 'line-active': currentStep > 2 }"></span>

            <span
              class="step-circle"
              :class="{ 'step-active': currentStep === 3 }"
            >
              3
            </span>
          </div>

          <div class="steps-labels">
            <span :class="{ 'label-active': currentStep === 1 }">Infos perso.</span>
            <span :class="{ 'label-active': currentStep === 2 }">Formation</span>
            <span :class="{ 'label-active': currentStep === 3 }">Profil</span>
          </div>
        </div>

        <form class="auth-form" @submit.prevent="register">

          <!-- STEP 1 -->
          <div v-if="currentStep === 1">
            <div class="field-group">
              <label>Nom</label>
              <div class="input-wrapper">
                <input v-model="name" type="text" placeholder="Votre nom">
              </div>
            </div>

            <div class="field-group">
              <label>Prénom</label>
              <div class="input-wrapper">
                <input v-model="prenom" type="text" placeholder="Votre prénom">
              </div>
            </div>

            <div class="field-group">
              <label>Adresse e-mail</label>
              <div class="input-wrapper">
                <input v-model="email" type="email" placeholder="votre.email@institution.ma">
              </div>
            </div>

            <div class="field-group">
              <label>Mot de passe</label>
              <div class="input-wrapper">
                <input v-model="password" type="password" placeholder="Mot de passe">
              </div>
            </div>

            <div class="field-group">
              <label>Confirmer le mot de passe</label>
              <div class="input-wrapper">
                <input v-model="confirmPassword" type="password" placeholder="Confirmer le mot de passe">
              </div>
            </div>

            <div class="checkbox">
              <input v-model="accepted" type="checkbox" id="terms">
              <label for="terms">
                J’accepte les <strong>conditions d’utilisation</strong>
                et la <strong>politique de confidentialité</strong>.
              </label>
            </div>
          </div>

          <div v-if="currentStep === 2" class="formation-step">

  <div class="field-group">
    <label>Type de formation</label>

    <div class="formation-types">
      <button
        type="button"
        class="formation-card"
        :class="{ selected: formationType === 'faculte' }"
        @click="formationType = 'faculte'"
      >
        <span class="formation-icon">🎓</span>
        <strong>Faculté</strong>
        <small>Licence / Master</small>
      </button>

      <button
        type="button"
        class="formation-card"
        :class="{ selected: formationType === 'ecole' }"
        @click="formationType = 'ecole'"
      >
        <span class="formation-icon">🏫</span>
        <strong>École supérieure</strong>
        <small>Ingénieur</small>
      </button>

      <button
        type="button"
        class="formation-card"
        :class="{ selected: formationType === 'institut' }"
        @click="formationType = 'institut'"
      >
        <span class="formation-icon">💼</span>
        <strong>Institut</strong>
        <small>Formation courte</small>
      </button>
    </div>
  </div>

  <div class="field-group">
    <label>Établissement</label>
    <div class="input-wrapper">
      <input v-model="etablissement" type="text" placeholder="Ex : Ensa, Tanger">
    </div>
  </div>

  <div class="form-row">
    <div class="field-group">
      <label>Filière / Spécialité</label>
      <div class="input-wrapper">
        <input v-model="filiere" type="text" placeholder="Ex : Informatique">
      </div>
    </div>

    <div class="field-group">
      <label>Niveau d’études</label>
      <div class="input-wrapper">
        <select v-model="niveau">
          <option value="">Sélectionner</option>
          <option>Bac+1</option>
          <option>Bac+2</option>
          <option>Bac+3</option>
          <option>Master</option>
        </select>
      </div>
    </div>
  </div>

  <div class="form-row">
    <div class="field-group">
      <label>Année d’entrée</label>
      <div class="input-wrapper">
        <input v-model="anneeEntree" type="text" placeholder="Année">
      </div>
    </div>

    <div class="field-group">
      <label>Diplôme prévu</label>
      <div class="input-wrapper">
        <input v-model="diplomePrevu" type="text" placeholder="Année">
      </div>
    </div>
  </div>

</div>

<div v-if="currentStep === 3" class="profile-step">

  <!-- PHOTO -->
  <div class="photo-section">
    <div class="avatar">
      <img v-if="photoPreview" :src="photoPreview" alt="Photo de profil">
      <span v-else>👨‍🎓</span>
    </div>

    <div class="photo-actions">
      <label class="small-btn">
        + Ajouter une photo
        <input type="file" accept="image/png, image/jpeg" hidden @change="handlePhoto">
      </label>

      <p>JPG ou PNG · max 2 Mo</p>
    </div>
  </div>

  <!-- BIO -->
  <div class="field-group">
    <label>Bio courte</label>

    <textarea
      class="bio-textarea"
      v-model="bio"
      maxlength="160"
      placeholder="Ex : Étudiant en informatique passionné par le développement web et l’IA..."
    ></textarea>

    <small class="counter">{{ bio.length }} / 160</small>
  </div>

  <!-- COMPETENCES -->
  <div class="field-group">
  <label>Compétences clés</label>

  <div class="skills-box">
    <div class="skills-list">
      <span
        v-for="(skill, index) in skills"
        :key="index"
        class="skill-tag"
      >
        {{ skill }}
        <button type="button" @click="removeSkill(index)">×</button>
      </span>
    </div>

    <div class="skill-input-row">
      <input
        v-model="newSkill"
        type="text"
        placeholder="Ajouter une compétence..."
        @keyup.enter.prevent="addSkill"
      >

      <button type="button" class="add-skill-btn" @click="addSkill">
        +
      </button>
    </div>
  </div>
</div>
  <!-- DISPONIBILITE -->
  <div class="field-group">
    <label>Disponibilité</label>

    <div class="availability">
      <button
        type="button"
        class="availability-card"
        :class="{ selected: disponibilite === 'stage' }"
        @click="disponibilite = 'stage'"
      >
        <span>🔍</span>
        <strong>Stage</strong>
      </button>

      <button
        type="button"
        class="availability-card"
        :class="{ selected: disponibilite === 'alternance' }"
        @click="disponibilite = 'alternance'"
      >
        <span>💼</span>
        <strong>Alternance</strong>
      </button>

      <button
        type="button"
        class="availability-card"
        :class="{ selected: disponibilite === 'emploi' }"
        @click="disponibilite = 'emploi'"
      >
        <span>🚀</span>
        <strong>Emploi</strong>
      </button>

      <button
        type="button"
        class="availability-card"
        :class="{ selected: disponibilite === 'freelance' }"
        @click="disponibilite = 'freelance'"
      >
        <span>🎯</span>
        <strong>Freelance</strong>
      </button>
    </div>
  </div>

  <!-- LINKEDIN -->
  <div class="field-group">
    <label>Profil LinkedIn <span class="optional">(optionnel)</span></label>

    <div class="linkedin-input">
      <span>linkedin.com/in/</span>
      <input v-model="linkedin" type="text" placeholder="votre-profil">
    </div>
  </div>
</div>

          <div class="actions">
            <button v-if="currentStep > 1" type="button" class="btn-back" @click="previousStep">
              ←
            </button>

            <button class="btn-submit" type="submit">
              {{ currentStep === 3 ? 'Créer mon compte ✓' : 'Continuer →' }}
            </button>
          </div>

        </form>

        <div class="form-footer">
          <p class="no-account">
            Vous avez déjà un compte ?
            <a href="#" class="inline-link">Se connecter</a>
          </p>

          <p class="security-note">Connexion sécurisée · Données chiffrées</p>
        </div>

      </div>
    </section>

  </div>
</template>