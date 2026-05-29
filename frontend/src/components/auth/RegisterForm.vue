<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import logo from '../../assets/logo.png'
import PHOTOPF from '../../assets/PHOTOPF.png'

// ================= ROUTER =================
const router = useRouter()

function goToLogin() {
  router.push('/login')
}

// ================= STEP =================
const currentStep = ref(1)

// ================= STEP 1 =================
const name = ref('')
const prenom = ref('')
const role = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const accepted = ref(false)

// ================= STEP 2 ETUDIANT =================
const formationType = ref('')
const etablissement = ref('')
const filiere = ref('')
const filieres = [
  'Informatique',
  'Intelligence Artificielle',
  'Cybersécurité',
  'Réseaux & Télécommunications',
  'Autre',
]
const niveau = ref('')

// ================= NIVEAUX DISPONIBLES =================
const niveauxDisponibles = computed(() => {
  return niveauxParFormation[formationType.value] || []
})
const niveauxParFormation = {
  faculte: [
    'Licence 1',
    'Licence 2',
    'Licence 3',
    'Master 1',
    'Master 2'
  ],

  ecole: [
    'CP1',
    'CP2',
    'Cycle 1',
    'Cycle 2',
    'Cycle 3'
  ],

  institut: [
    '1ère année',
    '2ème année',
    '3ème année'
  ]
}

const anneeEntree = ref('')
const diplomePrevu = ref('')
// ================= ANNEES ENTREE =================
const currentYear = new Date().getFullYear()

const anneesEntree = []

const minYearEntree = currentYear - 10

for (let year = currentYear; year >= minYearEntree; year--) {
  anneesEntree.push(year)
}

// ================= ANNEES DIPLOME =================
const anneesDiplome = []

const minYearDiplome = 2018
const maxYearDiplome = currentYear + 5

for (let year = minYearDiplome; year <= maxYearDiplome; year++) {
  anneesDiplome.push(year)
}

// ================= STEP 2 PROF =================
const departement = ref('')
const specialite = ref('')
const bioProf = ref('')

// ================= DEPARTEMENTS =================
const departements = [
  'Informatique',
  'Mathématiques'
]

// ================= SPECIALITES =================
const specialitesParDepartement = {

  Informatique: [
    'Développement Web',
    'Développement Mobile',
    'Intelligence Artificielle',
    'Machine Learning',
    'Data Science',
    'Cybersécurité',
    'Cloud Computing',
    'Réseaux',
    'Systèmes embarqués',
    'Génie logiciel',
    'DevOps',
    'QA Testing',
    'Software Testing',
    'Blockchain'
  ],

  Mathématiques: [
    'Mathématiques appliquées',
    'Statistiques',
    'Recherche opérationnelle',
    'Analyse numérique'
  ]

}

// ================= SPECIALITES DISPONIBLES =================
const specialitesDisponibles = computed(() => {
  return specialitesParDepartement[departement.value] || []
})

// ================= STEP 2 PRO =================
const entreprise = ref('')
const poste = ref('')
const secteur = ref('')


// ================= STEP 3 etu =================
const bio = ref('')
const skills = ref([])
const newSkill = ref('')
const disponibilite = ref('')
const linkedin = ref('')
const photoPreview = ref('')
// ================= STEP 3 prof =================


// ================= STEP 3 PRO =================
const descriptionEntreprise = ref('')
const siteEntreprise = ref('')
const localisation = ref('')
// ================= DOCUMENT VERIFICATION =================
const verificationDocumentProf = ref(null)
const verificationDocumentNameProf = ref('')
const verificationDocumentPro = ref(null)
const verificationDocumentNamePro = ref('')
const isDragging = ref(false)

// ================= ERRORS =================
const errors = reactive({
  name: '',
  prenom: '',
  role: '',
  email: '',
  password: '',
  confirmPassword: '',
  accepted: '',

  formationType: '',
  etablissement: '',
  filiere: '',
  niveau: '',
  anneeEntree: '',
  diplomePrevu: '',

  departement: '',
  specialite: '',

  entreprise: '',
  poste: '',
  secteur: '',
  pays: '',
  ville: '',

  bio: '',
  skills: '',
  disponibilite: '',
  linkedin: '',
  bioProf: '',

  descriptionEntreprise: '',
  siteEntreprise: '',
  localisation: '',
  verificationDocument: '',
  
})

// ================= CLEAR ERRORS =================
const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

// ================= REGEX =================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const yearRegex = /^[0-9]{4}$/
const linkedinRegex = /^[a-zA-Z0-9._/-]+$/
const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,72}$/


// ================= SKILLS =================
const addSkill = () => {
  if (newSkill.value.trim() === '') return

  skills.value.push(newSkill.value.trim())
  newSkill.value = ''
  errors.skills = ''
}

const removeSkill = (index) => {
  skills.value.splice(index, 1)
}

// ================= PHOTO =================
const handlePhoto = (event) => {
  const file = event.target.files[0]

  if (file) {
    photoPreview.value = URL.createObjectURL(file)
  }
}
// ================= DOCUMENT =================
const handleDocument = (event, type) => {
  const file = event.target.files[0]

  validateDocument(file, type)
}

const validateDocument = (file, type) => {
  if (!file) return

  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg'
  ]

  if (!allowedTypes.includes(file.type)) {
    alert('Format accepté : PDF, JPG, PNG')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Taille max : 5MB')
    return
  }

  // ========= PROF =========
  if (type === 'PROF') {
    verificationDocumentProf.value = file
    verificationDocumentNameProf.value = file.name
  }

  // ========= PRO =========
  if (type === 'PRO') {
    verificationDocumentPro.value = file
    verificationDocumentNamePro.value = file.name
  }
}

const onDrop = (event, type) => {
  isDragging.value = false

  const file = event.dataTransfer.files[0]

  validateDocument(file, type)
}

// ================= NEXT STEP =================
const nextStep = () => {
  clearErrors()

  let isValid = true

  // ========= STEP 1 =========
  if (currentStep.value === 1) {

    if (!name.value.trim()) {
      errors.name = 'Nom obligatoire'
      isValid = false
    }

    if (!prenom.value.trim()) {
      errors.prenom = 'Prénom obligatoire'
      isValid = false
    }

    if (!email.value.trim()) {
      errors.email = 'Email obligatoire'
      isValid = false
    } else if (!emailRegex.test(email.value.trim())) {
      errors.email = 'Email invalide'
      isValid = false
    }

   if (!password.value.trim()) {

  errors.password = 'Mot de passe obligatoire'
  isValid = false

} else if (!passwordRegex.test(password.value)) {

  errors.password =
    '8-72 caractères avec une majuscule, un chiffre et un caractère spécial'

  isValid = false
}

    if (!confirmPassword.value.trim()) {
      errors.confirmPassword = 'Confirmation obligatoire'
      isValid = false
    } else if (password.value !== confirmPassword.value) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas'
      isValid = false
    }

    if (!role.value) {
      errors.role = 'Choisissez un rôle'
      isValid = false
    }

    if (!accepted.value) {
      errors.accepted = 'Veuillez accepter les conditions'
      isValid = false
    }

    if (!isValid) return

    currentStep.value = 2
    return
  }

  // ========= STEP 2 STUDENT =========
  if (currentStep.value === 2 && role.value === 'STUDENT') {

    if (!formationType.value) {
      errors.formationType = 'Champ obligatoire'
      isValid = false
    }

    if (!etablissement.value.trim()) {
      errors.etablissement = 'Champ obligatoire'
      isValid = false
    }

    if (!filiere.value.trim()) {
      errors.filiere = 'Champ obligatoire'
      isValid = false
    }

    if (!niveau.value) {
      errors.niveau = 'Champ obligatoire'
      isValid = false
    }

    if (!anneeEntree.value) {
      errors.anneeEntree = 'Champ obligatoire'
      isValid = false
    }

    if (!diplomePrevu.value) {
      errors.diplomePrevu = 'Champ obligatoire'
      isValid = false
    }

    if (!isValid) return

    currentStep.value = 3
    return
  }

  // ========= STEP 2 PROF =========
  if (currentStep.value === 2 && role.value === 'PROF') {

    if (!etablissement.value.trim()) {
      errors.etablissement = 'Champ obligatoire'
      isValid = false
    }

    if (!departement.value.trim()) {
      errors.departement = 'Champ obligatoire'
      isValid = false
    }

    if (!specialite.value.trim()) {
      errors.specialite = 'Champ obligatoire'
      isValid = false
    }

    if (!isValid) return

    currentStep.value = 3
    return
  }

  // ========= STEP 2 PRO =========
  if (currentStep.value === 2 && role.value === 'PRO') {

    if (!entreprise.value.trim()) {
      errors.entreprise = 'Champ obligatoire'
      isValid = false
    }

    if (!poste.value.trim()) {
      errors.poste = 'Champ obligatoire'
      isValid = false
    }

    if (!secteur.value.trim()) {
      errors.secteur = 'Champ obligatoire'
      isValid = false
    }

    if (!localisation.value.trim()) {
      errors.localisation = 'Champ obligatoire'
      isValid = false
    }

    if (!isValid) return

    currentStep.value = 3
  }
}

// ================= PREVIOUS STEP =================
const previousStep = () => {
  clearErrors()

  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// ================= REGISTER =================
const register = async () => {

  if (currentStep.value < 3) {
    nextStep()
    return
  }

  clearErrors()

  let isValid = true

  // ========= VALIDATION COMMUNE =========
  if (
  role.value === 'PROF' &&
  !bioProf.value.trim()
) {

  errors.bioProf = 'Présentation obligatoire'
  isValid = false
}
if (role.value === 'STUDENT') {
  if (!bio.value.trim()) {
    errors.bio = 'Bio obligatoire'
    isValid = false
  }

  if (skills.value.length === 0) {
    errors.skills = 'Ajoutez au moins une compétence'
    isValid = false
  }

  if (!disponibilite.value) {
    errors.disponibilite = 'Choisissez une disponibilité'
    isValid = false
  }
}

  if (
    linkedin.value.trim() !== '' &&
    !linkedinRegex.test(linkedin.value.trim())
  ) {
    errors.linkedin = 'Lien LinkedIn invalide'
    isValid = false
  }

  // ========= VALIDATION PRO =========
  if (role.value === 'PRO' && !descriptionEntreprise.value.trim()) {
    errors.descriptionEntreprise = 'Description obligatoire'
    isValid = false
  }

  // ========= DOCUMENT JUSTIFICATIF =========
if (
    (role.value === 'PROF' && !verificationDocumentProf.value) ||
    (role.value === 'PRO'  && !verificationDocumentPro.value)
  ) {

  errors.verificationDocument =
    'Veuillez ajouter un document justificatif'

  isValid = false
}

  if (!isValid) return

  // ========= USER DATA =========
  const userData = {
    name: name.value,
    prenom: prenom.value,
    role: role.value,
    email: email.value,
    password: password.value,
    formationType: formationType.value,
    etablissement: etablissement.value,
    filiere: filiere.value,
    niveau: niveau.value,
    anneeEntree: anneeEntree.value,
    diplomePrevu: diplomePrevu.value,
    departement: departement.value,
    specialite: specialite.value,
    entreprise: entreprise.value,
    poste: poste.value,
    secteur: secteur.value,
    bio: bio.value,
    linkedin: linkedin.value,
    descriptionEntreprise: descriptionEntreprise.value,
    siteEntreprise: siteEntreprise.value,
    localisation: localisation.value,
  
  }
  // ========= CONSTRUCTION FORMDATA =========
  const sentData = new FormData()

  sentData.append('name',    name.value)
  sentData.append('prenom',  prenom.value)
  sentData.append('email',   email.value)
  sentData.append('password', password.value)
  sentData.append('role',    role.value)

  sentData.append('formationType', formationType.value)
  sentData.append('etablissement', etablissement.value)
  sentData.append('filiere',       filiere.value)
  sentData.append('niveau',        niveau.value)
  sentData.append('anneeEntree',   anneeEntree.value)
  sentData.append('diplomePrevu',  diplomePrevu.value)

  sentData.append('departement', departement.value)
  sentData.append('specialite',  specialite.value)
  sentData.append('bioProf',     bioProf.value)

  sentData.append('entreprise',  entreprise.value)
  sentData.append('poste',       poste.value)
  sentData.append('secteur',     secteur.value)
  sentData.append('localisation', localisation.value)
  sentData.append('descriptionEntreprise', descriptionEntreprise.value)
  sentData.append('siteEntreprise',        siteEntreprise.value)

  sentData.append('bio',          bio.value)
  sentData.append('disponibilite', disponibilite.value)
  sentData.append('linkedin',     linkedin.value)
  sentData.append('skills',       JSON.stringify(skills.value))


// ===== DOCUMENT PROF =====
if (
  role.value === 'PROF' &&
  verificationDocumentProf.value
) {

  sentData.append(
    'verificationDocument',
    verificationDocumentProf.value
  )
}

// ===== DOCUMENT PRO =====
if (
  role.value === 'PRO' &&
  verificationDocumentPro.value
) {

  sentData.append(
    'verificationDocument',
    verificationDocumentPro.value
  )
}
try {
    const response = await axios.post(
  'http://localhost:3000/api/auth/register',
  sentData,
  {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
)

    // Check if registration was successful
    if (response.status === 201) {
      alert(response.data.message || 'Compte créé avec succès !')
      router.push('/login')
    }

  } catch (error) {
    console.error('Registration failed:', error)
    alert(
      error.response?.data?.message ||
      error.message ||
      'Erreur lors de la création du compte'
    )
  }
}
</script>

<template>
  <div class="register-page">

    <section class="left-panel">
      <div class="left-top">
       <div class="logo">
          <img :src="logo" alt="Portfy" class="logo-img">
          <span class="logo-name">Portfy</span>
        </div>

        <div class="decorative-circles">
          <span class="circle circle-teal"></span>
          <span class="circle circle-brown"></span>
        </div>
      </div>

      <div class="headline">
        <div class="headline-content">
          <h1>
            <span class="line-white">Votre profil.</span>
            <span class="line-gold">Validé.</span>
            <span class="line-white">Certifié.</span>
          </h1>
          <img :src="PHOTOPF" alt="Portfolio illustration" class="hero-img">
        </div>
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
          <button type="button" class="tab" @click="goToLogin">
            Connexion
          </button>

          <button type="button" class="tab active">
            Inscription
          </button>
        </div>

        <div class="form-header">
          <template v-if="currentStep === 1">
            <h2>Créez votre compte</h2>
            <p>Rejoignez votre espace Portfy</p>
          </template>
  
          <template v-if="currentStep === 2">

  <!-- ETUDIANT -->
  <template v-if="role === 'STUDENT'">
    <h2>Votre formation</h2>
    <p>Renseignez votre établissement et votre cursus</p>
  </template>

  <!-- PROF -->
  <template v-else-if="role === 'PROF'">
    <h2>Formation du professeur</h2>
    <p>Renseignez votre établissement et votre spécialité</p>
  </template>

  <!-- PROFESSIONNEL -->
  <template v-else-if="role === 'PRO'">
    <h2>Informations professionnelles</h2>
    <p>Renseignez votre entreprise et votre poste</p>
  </template>

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
            <span :class="{ 'label-active': currentStep === 1 }">Etape 1</span>
            <span :class="{ 'label-active': currentStep === 2 }">Etape 2</span>
            <span :class="{ 'label-active': currentStep === 3 }">Etape 3</span>
          </div>
        </div>

        <form class="auth-form" @submit.prevent="register">

          <!-- STEP 1 -->
          <div v-if="currentStep === 1">
            <div class="field-group">
              <label>Nom <span class="required-star">*</span></label>
              <div class="input-wrapper">
                <input v-model="name" type="text" placeholder="Votre nom">
              </div>
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>

            <div class="field-group">
              <label>Prénom <span class="required-star">*</span></label>
              <div class="input-wrapper">
                <input v-model="prenom" type="text" placeholder="Votre prénom">
              </div>
              <span v-if="errors.prenom" class="field-error">{{ errors.prenom }}</span>
            </div>

            <div class="field-group">
              <label>Adresse e-mail <span class="required-star">*</span></label>
              <div class="input-wrapper">
                <input v-model="email" type="email" placeholder="votre.email@institution.ma">
              </div>
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <div class="field-group">
              <label>Mot de passe <span class="required-star">*</span></label>
              <div class="input-wrapper">
                <input v-model="password" type="password" placeholder="Mot de passe">
              </div>
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </div>

            <div class="field-group">
              <label>Confirmer le mot de passe <span class="required-star">*</span></label>
              <div class="input-wrapper">
                <input v-model="confirmPassword" type="password" placeholder="Confirmer le mot de passe">
              </div>
              <span v-if="errors.confirmPassword" class="field-error">
                {{ errors.confirmPassword }}
              </span>
            </div>
            <div class="field-group">
              <label>Rôle <span class="required-star">*</span></label>
              <div class="input-wrapper">
                <select v-model="role">
                  <option value="" disabled>Sélectionnez votre profil</option>
                  <option value="STUDENT">Étudiant</option>
                  <option value="PROF">Professeur</option>
                  <option value="PRO">Professionnel</option>
                </select>
              </div>
              <span v-if="errors.role" class="field-error">{{ errors.role }}</span>
            </div>

            <div class="checkbox">
              <input v-model="accepted" type="checkbox" id="terms">
              <label for="terms">
                J’accepte les 
                  <router-link to="/conditions" class="inline-link">
                  conditions d’utilisation
                  </router-link>
                  et la 
                  <router-link to="/politique" class="inline-link">
                  politique de confidentialité
                  </router-link>.
              </label>
            </div>
            <span v-if="errors.accepted" class="field-error">{{ errors.accepted }}</span>
           
          </div>

          <!-- STEP 2 etu-->
          <div v-if="currentStep === 2 && role === 'STUDENT'" class="formation-step">
            <div class="field-group">
              <label>Type de formation <span class="required-star">*</span></label>

              <div class="formation-types">
                <button
                  type="button"
                  class="formation-card"
                  :class="{ selected: formationType === 'faculte' }"
                  @click="formationType = 'faculte'; niveau = ''"
                >
                  <span class="formation-icon">🎓</span>
                  <strong>Faculté</strong>
                  <small>Licence / Master</small>
                </button>

                <button
                  type="button"
                  class="formation-card"
                  :class="{ selected: formationType === 'ecole' }"
                  @click="formationType = 'ecole'; niveau = ''"
                >
                  <span class="formation-icon">🏫</span>
                  <strong>École supérieure</strong>
                  <small>Ingénieur</small>
                </button>

                <button
                  type="button"
                  class="formation-card"
                  :class="{ selected: formationType === 'institut' }"
                  @click="formationType = 'institut'; niveau = ''"
                >
                  <span class="formation-icon">💼</span>
                  <strong>Institut</strong>
                  <small>Formation courte</small>
                </button>
              </div>

              <span v-if="errors.formationType" class="field-error">
                {{ errors.formationType }}
              </span>
            </div>

            <div class="field-group">
              <label>Établissement <span class="required-star">*</span></label>
              <div class="input-wrapper">
                <input v-model="etablissement" type="text" placeholder="Ex : Ensa Tanger">
              </div>
              <span v-if="errors.etablissement" class="field-error">
                {{ errors.etablissement }}
              </span>
            </div>

            <div class="form-row">
              <div class="field-group">
                <label>Filière / Spécialité <span class="required-star">*</span></label>
                <div class="input-wrapper">
                  <select v-model="filiere">
  <option value="">
    Choisir une filière
  </option>

  <option
    v-for="fil in filieres"
    :key="fil"
    :value="fil"
  >
    {{ fil }}
  </option>
</select>
                </div>
                <span v-if="errors.filiere" class="field-error">{{ errors.filiere }}</span>
              </div>

              <div class="field-group">
                <label>Niveau d’études <span class="required-star">*</span></label>
                <div class="input-wrapper">
                  <select
  v-model="niveau"
  :disabled="!formationType"
>
  <option value="">
    Sélectionner un niveau
  </option>

  <option
    v-for="niv in niveauxDisponibles"
    :key="niv"
    :value="niv"
  >
    {{ niv }}
  </option>
</select>
                </div>
                <span v-if="errors.niveau" class="field-error">{{ errors.niveau }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="field-group">
                <label>Année d’entrée <span class="required-star">*</span></label>
                <div class="input-wrapper">
  <select v-model.number="anneeEntree">
    <option value="">
      Sélectionner une année
    </option>

    <option
      v-for="year in anneesEntree"
      :key="year"
      :value="year"
    >
      {{ year }}
    </option>
  </select>
</div>
                <span v-if="errors.anneeEntree" class="field-error">
                  {{ errors.anneeEntree }}
                </span>
              </div>

              <div class="field-group">
                <label>Diplôme prévu <span class="required-star">*</span></label>
                <div class="input-wrapper">
  <select v-model.number="diplomePrevu">
    <option value="">
      Sélectionner une année
    </option>

    <option
      v-for="year in anneesDiplome"
      :key="year"
      :value="year"
    >
      {{ year }}
    </option>
  </select>
</div>
                <span v-if="errors.diplomePrevu" class="field-error">
                  {{ errors.diplomePrevu }}
                </span>
              </div>
            </div>

          </div>
          <!-- STEP 2 PROFESSEUR -->
          <div v-if="currentStep === 2 && role === 'PROF'" class="formation-step">

  <div class="field-group">
    <label>Établissement <span class="required-star">*</span></label>

    <div class="input-wrapper">
      <input
        v-model="etablissement"
        type="text"
        placeholder="Ex : ENSA Tanger">
    </div>
  </div>

  <div class="field-group">
    <label>Département <span class="required-star">*</span></label>

    <div class="input-wrapper">
      <select
  v-model="departement"
  @change="specialite = ''"
>
  <option value="">Choisir un département</option>

  <option
    v-for="dep in departements"
    :key="dep"
    :value="dep"
  >
    {{ dep }}
  </option>
</select>
    </div>
  </div>

  <div class="field-group">
    <label>Spécialité <span class="required-star">*</span></label>

    <div class="input-wrapper">
      <select
  v-model="specialite"
  :disabled="!departement"
>
  <option value="">
    Choisir une spécialité
  </option>

  <option
    v-for="spec in specialitesDisponibles"
    :key="spec"
    :value="spec"
  >
    {{ spec }}
  </option>
</select>
    </div>
  </div>
  <div class="field-group">
  <label>
    Profil LinkedIn
    <span class="optional">(optionnel)</span>
  </label>

  <div class="linkedin-input">
    <span>linkedin.com/in/</span>

    <input
      v-model="linkedin"
      type="text"
      placeholder="prenom-nom"
    >
  </div>

  <span
    v-if="errors.linkedin"
    class="field-error"
  >
    {{ errors.linkedin }}
  </span>
</div>

</div>
<!-- STEP 2 PROFESSIONNEL -->
<div
  v-if="currentStep === 2 && role === 'PRO'"
  class="formation-step"
>

  <div class="field-group">
    <label>Entreprise <span class="required-star">*</span></label>

    <div class="input-wrapper">
      <input
        v-model="entreprise"
        type="text"
        placeholder="Ex : OCP Group"
      >
    </div>

    <span v-if="errors.entreprise" class="field-error">
      {{ errors.entreprise }}
    </span>
  </div>

  <div class="field-group">
    <label>Poste <span class="required-star">*</span></label>

    <div class="input-wrapper">
      <input
        v-model="poste"
        type="text"
        placeholder="Ex : Responsable RH"
      >
    </div>
    <span v-if="errors.poste" class="field-error">
      {{ errors.poste }}
    </span>
  </div>

  <div class="field-group">
    <label>Secteur d’activité <span class="required-star">*</span></label>

    <div class="input-wrapper">
      <input
        v-model="secteur"
        type="text"
        placeholder="Ex : Informatique"
      >
    </div>

    <span v-if="errors.secteur" class="field-error">
      {{ errors.secteur }}
    </span>
  </div>

  <div class="field-group">
    <label> Localisation <span class="required-star">*</span></label>

    <div class="input-wrapper">
      <input
        v-model="localisation"
        type="text"
        placeholder="Ex : 25 RUE MOHAMED V TANGER, 90000"
      >
    </div>

    <span v-if="errors.localisation" class="field-error">
      {{ errors.localisation }}
    </span>
  </div>
  <div class="field-group">
            <label> Site web</label>
            <div class="input-wrapper">
            <input v-model="siteEntreprise" type="text" placeholder="https://entreprise.com">
            </div>

            <span v-if="errors.siteEntreprise" class="field-error">
            {{ errors.siteEntreprise }}
            </span>
            </div>

</div>

          <!-- STEP 3 etu -->
          <div v-if="currentStep === 3 && (role === 'STUDENT')" class="profile-step">

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

            <div class="field-group">
              <label>Bio courte <span class="required-star">*</span></label>

              <textarea
                class="bio-textarea"
                v-model="bio"
                maxlength="160"
                placeholder="Ex : Étudiant en informatique passionné par le développement web et l’IA..."
              ></textarea>

              <small class="counter">{{ bio.length }} / 160</small>

              <span v-if="errors.bio" class="field-error">
                {{ errors.bio }}
              </span>
            </div>

            <div class="field-group">
              <label>Compétences clés <span class="required-star">*</span></label>

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

              <span v-if="errors.skills" class="field-error">
                {{ errors.skills }}
              </span>
            </div>

            <div class="field-group">
              <label>Disponibilité <span class="required-star">*</span></label>

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

              <span v-if="errors.disponibilite" class="field-error">
                {{ errors.disponibilite }}
              </span>
            </div>

            <div class="field-group">
              <label>Profil LinkedIn <span class="optional">(optionnel)</span></label>

              <div class="linkedin-input">
                <span>linkedin.com/in/</span>
                <input v-model="linkedin" type="text" placeholder="votre-profil">
              </div>

              <span v-if="errors.linkedin" class="field-error">
                {{ errors.linkedin }}
              </span>
            </div>

          </div>
          <!-- STEP 3 PRO -->
          <div v-if="currentStep === 3 && role === 'PRO'" class="profile-step">

            <div class="photo-section">
              <div class="avatar">
              <img
                v-if="photoPreview" :src="photoPreview" alt="Logo entreprise">
              <span v-else>🏢</span>
              </div>

              <div class="photo-actions">
              <label class="small-btn"> + Ajouter une photo
              <input type="file" accept="image/png, image/jpeg" hidden @change="handlePhoto">
              </label>
              <p>JPG ou PNG · max 2 Mo</p>
              </div>
            </div>

            <div class="field-group">
              <label> Description entreprise
              <span class="required-star">*</span>
              </label>

              <textarea class="bio-textarea" v-model="descriptionEntreprise" maxlength="200" placeholder="Présentez votre entreprise..."></textarea>

              <span v-if="errors.descriptionEntreprise" class="field-error">
                {{ errors.descriptionEntreprise }}
              </span>
            </div>
            <!-- DOCUMENT JUSTIFICATIF -->
<div class="field-group">
  <label>
    Document justificatif
    <span class="required-star">*</span>
  </label>

  <div
    class="upload-zone"
    :class="{ dragging: isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop($event, 'PRO')"
  >
    <input
      type="file"
      hidden
      id="verification-uploadPRO"
      accept=".pdf,.png,.jpg,.jpeg"
      @change="handleDocument($event, 'PRO')"
    >

    <label for="verification-uploadPRO" class="upload-label">
      <div class="upload-content">
        <span class="upload-icon">📄</span>

        <p>
          Glissez votre attestation de travail ou tout document officiel équivalent ici
          ou <strong>cliquez pour importer</strong>
        </p>

        <small>
          PDF, JPG ou PNG • max 5 MB
        </small>
      </div>
    </label>
  </div>

  <div
    v-if="verificationDocumentNamePro"
    class="uploaded-file"
  >
    ✅ {{ verificationDocumentNamePro }}
  </div>

  <span
    v-if="errors.verificationDocument"
    class="field-error"
  >
    {{ errors.verificationDocument }}
  </span>
</div>

        </div>
          <!-- STEP 3 PROF -->
          <div v-if="currentStep === 3 && role === 'PROF'" class="profile-step">

  <!-- PHOTO -->
  <div class="photo-section">
    <div class="avatar">
      <img
        v-if="photoPreview"
        :src="photoPreview"
        alt="Photo professeur"
      >

      <span v-else>👨‍🏫</span>
    </div>

    <div class="photo-actions">
      <label class="small-btn">
        + Ajouter une photo

        <input
          type="file"
          accept="image/png, image/jpeg"
          hidden
          @change="handlePhoto"
        >
      </label>

      <p>JPG ou PNG · max 2 Mo</p>
    </div>
  </div>

  <!-- BIO -->
  <div class="field-group">
    <label>
      Présentation
      <span class="required-star">*</span>
    </label>

    <textarea
      class="bio-textarea"
      v-model="bioProf"
      maxlength="200"
      placeholder="Ex : Professeur en intelligence artificielle spécialisé en machine learning et data science."
    ></textarea>

    <span
      v-if="errors.bioProf"
      class="field-error"
    >
      {{ errors.bioProf }}
    </span>
  </div>
  <!-- DOCUMENT JUSTIFICATIF -->
<div class="field-group">
  <label>
    Document justificatif
    <span class="required-star">*</span>
  </label>

  <div
    class="upload-zone"
    :class="{ dragging: isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop($event, 'PROF')"
  >
    <input
      type="file"
      hidden
      id="verification-uploadPROF"
      accept=".pdf,.png,.jpg,.jpeg"
      @change="handleDocument($event, 'PROF')"
    >

    <label for="verification-uploadPROF" class="upload-label">
      <div class="upload-content">
        <span class="upload-icon">📄</span>

        <p>
          Glissez votre attestation de travail ou tout document officiel équivalent ici
          ou <strong>cliquez pour importer</strong>
        </p>

        <small>
          PDF, JPG ou PNG • max 5 MB
        </small>
      </div>
    </label>
  </div>

  <div
    v-if="verificationDocumentNameProf"
    class="uploaded-file"
  >
    ✅ {{ verificationDocumentNameProf }}
  </div>

  <span
    v-if="errors.verificationDocument"
    class="field-error"
  >
    {{ errors.verificationDocument }}
  </span>
</div>

</div>

<div class="actions">
  <button
    v-if="currentStep > 1"
    type="button"
    class="btn-back"
    @click="previousStep"
  >
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
            <a href="#" class="inline-link" @click="goToLogin">Se connecter</a>
          </p>

          <p class="security-note">Connexion sécurisée · Données chiffrées</p>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
.field-error {
  display: block;
  margin-top: 6px;
  color: #e05252;
  font-size: 0.875rem;
}

.required-star {
  color: #e05252;
  margin-left: 3px;
  font-weight: 700;
}

.tabs {
  display: flex;
}
select {
  width: 100%;
  padding: 14px 45px 14px 16px;
  border: none;
  border-radius: 12px;
  background-color: #dfe8ea;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23003344' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");

  background-repeat: no-repeat;

  /* POSITION DE LA FLÈCHE */
  background-position: right 16px center;

  background-size: 18px;
}
.upload-zone {
  border: 2px dashed #b7c7cc;
  border-radius: 16px;
  padding: 28px;
  background: #f7fafb;
  transition: 0.25s;
  cursor: pointer;
}

.upload-zone.dragging {
  border-color: #0f766e;
  background: #ecfeff;
}

.upload-label {
  cursor: pointer;
  display: block;
}

.upload-content {
  text-align: center;
}

.upload-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.upload-content p {
  margin: 0;
  font-weight: 600;
  color: #003344;
}

.upload-content small {
  color: #6b7280;
}

.uploaded-file {
  margin-top: 10px;
  font-size: 14px;
  color: #0f766e;
  font-weight: 600;
}
</style>