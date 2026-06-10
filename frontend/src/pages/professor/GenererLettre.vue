<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside :class="['sidebar', { closed: !isOpen }]">
      <div class="sidebar-header">
        <div class="sidebar-logo" v-if="isOpen">
          <img src="../../assets/logo.png" alt="Portfy Logo" class="logo-img" />
          <span class="logo-text">Portfy</span>
        </div>
        <button class="toggle-btn" @click="toggleSidebar">
          <ChevronLeft v-if="isOpen" size="18" />
          <ChevronRight v-else size="18" />
        </button>
      </div>

      <div v-if="isOpen" class="sidebar-profile">
        <div class="avatar">{{ initials }}</div>
        <div class="profile-info">
          <span class="profile-name">M. Ghailani</span>
          <span class="profile-role">Professeur · ENSAT</span>
        </div>
      </div>

      <div v-if="isOpen" class="verified-badge">
        <Star size="16" />
        Compte vérifié
      </div>

      <nav class="sidebar-nav">
        <p v-if="isOpen" class="nav-label">Home</p>
        <router-link to="/prof/dashboard" class="nav-item" active-class="active">
          <Home size="18" /><span v-if="isOpen">Dashboard</span>
        </router-link>
        <router-link to="/prof/portfolios-consultes" class="nav-item" active-class="active">
          <Eye size="18" /><span v-if="isOpen">Portfolios consultés</span>
        </router-link>
        <router-link to="/prof/recommandations" class="nav-item" active-class="active">
          <Star size="18" /><span v-if="isOpen">Recommandations</span>
        </router-link>
        <router-link to="/prof/generer-lettre" class="nav-item ai-btn" active-class="active">
          <Sparkles size="18" /><span v-if="isOpen">Générer une lettre</span>
        </router-link>
        <p v-if="isOpen" class="nav-label">Support</p>
        <router-link to="/prof/commentaires" class="nav-item" active-class="active">
          <MessageCircle size="18" /><span v-if="isOpen">Commentaires</span>
          <span v-if="isOpen" class="badge">3</span>
        </router-link>
        <router-link to="/prof/parametres" class="nav-item" active-class="active">
          <Settings size="18" /><span v-if="isOpen">Paramètres</span>
        </router-link>
        <router-link to="/prof/aide" class="nav-item" active-class="active">
          <HelpCircle size="18" /><span v-if="isOpen">Aide & Support</span>
        </router-link>
      </nav>

      <button v-if="isOpen" class="logout-btn" @click="logout">
        <LogOut size="18" />Déconnexion
      </button>
    </aside>

    <!-- Main -->
    <div class="main-wrapper">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="page-title">Générer une lettre de recommandation</h1>
        </div>
        <div class="topbar-right">
          <div class="search-box">
            <Search size="15" color="#aaa" />
            <input type="text" placeholder="Rechercher" v-model="searchQuery" />
          </div>
          <button class="notif-btn">
            <Bell size="20" />
            <span class="notif-dot"></span>
          </button>
          <div class="topbar-avatar">MG</div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-content">

        <!-- AI Banner -->
        <div class="ai-banner">
          <div class="ai-banner-icon">
            <Sparkles size="18" color="#e5b230" />
          </div>
          <div class="ai-banner-text">
            <strong>Génération assistée par IA</strong>
            <span>Remplissez le formulaire ci-dessous pour générer automatiquement votre lettre professionnelle personnalisée en quelques secondes.</span>
          </div>
          <!-- Step indicator -->
          <div class="step-indicator">
            <div v-for="(s, i) in steps" :key="i" class="step-dot-wrap">
              <div class="step-dot" :class="{ active: currentStep === i, done: currentStep > i }">
                <span v-if="currentStep > i"><CheckCheck size="10" /></span>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <div v-if="i < steps.length - 1" class="step-line" :class="{ done: currentStep > i }"></div>
            </div>
            <span class="step-label">Étape {{ currentStep + 1 }}/{{ steps.length }} . {{ steps[currentStep] }}</span>
          </div>
        </div>

        <div class="form-layout">
          <!-- LEFT: Form -->
          <div class="form-card">

            <!-- ═══ STEP 0: Infos de base ═══ -->
            <div v-if="currentStep === 0">
              <!-- Section 1: Professeur -->
              <div class="form-section">
                <div class="section-title"><span class="section-bar"></span>Informations du Professeur</div>
                <div class="form-row">
                  <div class="form-group">
                    <label>NOM COMPLET <span class="required">*</span></label>
                    <input v-model="form.profName" type="text" placeholder="Ex: Pr. Mohammed Ghailani" />
                  </div>
                  <div class="form-group">
                    <label>EMAIL PROFESSIONNEL <span class="required">*</span></label>
                    <input v-model="form.profEmail" type="email" placeholder="ghailani@ensa-tanger.ac.ma" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>DÉPARTEMENT / MODULE</label>
                    <input v-model="form.department" type="text" placeholder="Ex: Génie Informatique" />
                  </div>
                  <div class="form-group">
                    <label>INSTITUTION</label>
                    <input v-model="form.institution" type="text" placeholder="ENSA Tanger" />
                  </div>
                </div>
              </div>

              <!-- Section 2: Étudiant -->
              <div class="form-section">
                <div class="section-title"><span class="section-bar"></span>Informations de l'Étudiant</div>
                <div class="form-row">
                  <div class="form-group">
                    <label>NOM COMPLET <span class="required">*</span></label>
                    <input v-model="form.studentName" type="text" placeholder="Ex: Ahmed Alami" />
                  </div>
                  <div class="form-group">
                    <label>FILIÈRE / NIVEAU</label>
                    <input v-model="form.level" type="text" placeholder="Ex: Génie Informatique — 3ème année" />
                  </div>
                </div>
              </div>

              <!-- Section 3: Objectif -->
              <div class="form-section">
                <div class="section-title"><span class="section-bar"></span>Objectif de la Recommandation</div>
                <div class="form-group full-width">
                  <label>TYPE DE CANDIDATURE <span class="required">*</span></label>
                  <div class="chips">
                    <button
                      v-for="type in candidatureTypes" :key="type"
                      class="chip" :class="{ selected: form.candidatureType === type }"
                      @click="form.candidatureType = type" type="button"
                    >{{ type }}</button>
                  </div>
                </div>
              </div>

              <!-- Section 4: Langue -->
              <div class="form-section">
                <div class="section-title"><span class="section-bar"></span>Langue</div>
                <div class="form-group full-width">
                  <label>LANGUE DE LA LETTRE</label>
                  <div class="chips">
                    <button
                      v-for="lang in languages" :key="lang"
                      class="chip" :class="{ selected: form.language === lang }"
                      @click="form.language = lang" type="button"
                    >{{ lang }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══ STEP 1: Formulaire contextuel selon type ═══ -->
            <div v-if="currentStep === 1">
              <!-- Master / Doctorat -->
              <div v-if="form.candidatureType === 'Master / Doctorat'">
                <div class="form-section">
                  <div class="section-title"><span class="section-bar"></span>Candidature Master / Doctorat</div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>UNIVERSITÉ CIBLE</label>
                      <input v-model="form.extra.university" type="text" placeholder="Ex: Université Paris-Saclay" />
                    </div>
                    <div class="form-group">
                      <label>PROGRAMME VISÉ</label>
                      <input v-model="form.extra.program" type="text" placeholder="Ex: Master IA & Data Science" />
                    </div>
                  </div>
                  <div class="form-group full-width">
                    <label>PROJET DE RECHERCHE / MOTIVATION</label>
                    <textarea v-model="form.extra.researchMotivation" rows="3" placeholder="Décrivez le projet de recherche ou la motivation académique de l'étudiant…"></textarea>
                  </div>
                </div>
              </div>

              <!-- Double Diplomation -->
              <div v-if="form.candidatureType === 'Double Diplomation'">
                <div class="form-section">
                  <div class="section-title"><span class="section-bar"></span>Double Diplomation</div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>ÉCOLE PARTENAIRE</label>
                      <input v-model="form.extra.partnerSchool" type="text" placeholder="Ex: École Polytechnique de Montréal" />
                    </div>
                    <div class="form-group">
                      <label>PAYS DE DESTINATION</label>
                      <input v-model="form.extra.country" type="text" placeholder="Ex: Canada" />
                    </div>
                  </div>
                  <div class="form-group full-width">
                    <label>ACCORD DE PARTENARIAT / CONTEXTE</label>
                    <textarea v-model="form.extra.partnerContext" rows="3" placeholder="Précisez le contexte du partenariat ou accord interinstitutionnel…"></textarea>
                  </div>
                </div>
              </div>

              <!-- Stage -->
              <div v-if="form.candidatureType === 'Stage'">
                <div class="form-section">
                  <div class="section-title"><span class="section-bar"></span>Stage</div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>ENTREPRISE / ORGANISME</label>
                      <input v-model="form.extra.company" type="text" placeholder="Ex: Google, OCP, CNRS…" />
                    </div>
                    <div class="form-group">
                      <label>DURÉE DU STAGE</label>
                      <input v-model="form.extra.duration" type="text" placeholder="Ex: 2 mois, 6 mois…" />
                    </div>
                  </div>
                  <div class="form-group full-width">
                    <label>MISSION / DOMAINE DU STAGE</label>
                    <textarea v-model="form.extra.mission" rows="3" placeholder="Décrivez la mission ou le domaine technique du stage…"></textarea>
                  </div>
                </div>
              </div>

              <!-- Emploi -->
              <div v-if="form.candidatureType === 'Emploi'">
                <div class="form-section">
                  <div class="section-title"><span class="section-bar"></span>Candidature Emploi</div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>ENTREPRISE CIBLE</label>
                      <input v-model="form.extra.company" type="text" placeholder="Ex: Microsoft, Maroc Telecom…" />
                    </div>
                    <div class="form-group">
                      <label>POSTE VISÉ</label>
                      <input v-model="form.extra.position" type="text" placeholder="Ex: Ingénieur DevOps" />
                    </div>
                  </div>
                  <div class="form-group full-width">
                    <label>COMPÉTENCES PROFESSIONNELLES À METTRE EN AVANT</label>
                    <textarea v-model="form.extra.proSkills" rows="3" placeholder="Listez les compétences techniques et soft skills pertinentes pour ce poste…"></textarea>
                  </div>
                </div>
              </div>

              <!-- Programme International -->
              <div v-if="form.candidatureType === 'Programme International'">
                <div class="form-section">
                  <div class="section-title"><span class="section-bar"></span>Programme International</div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>NOM DU PROGRAMME</label>
                      <input v-model="form.extra.programName" type="text" placeholder="Ex: Erasmus+, Fulbright, DAAD…" />
                    </div>
                    <div class="form-group">
                      <label>PAYS / RÉGION</label>
                      <input v-model="form.extra.region" type="text" placeholder="Ex: Allemagne, États-Unis…" />
                    </div>
                  </div>
                  <div class="form-group full-width">
                    <label>OBJECTIF DU PROGRAMME</label>
                    <textarea v-model="form.extra.programObjective" rows="3" placeholder="Décrivez l'objectif du programme et ce que l'étudiant espère y accomplir…"></textarea>
                  </div>
                </div>
              </div>

              <!-- Section commune: Appréciation du Professeur -->
              <div class="form-section">
                <div class="section-title"><span class="section-bar"></span>Appréciation du Professeur</div>
                <div class="form-group full-width">
                  <label>QUALITÉS TECHNIQUES OBSERVÉES <span class="required">*</span></label>
                  <textarea v-model="form.technicalQualities" rows="3" placeholder="Ex: Maîtrise de Vue.js, Node.js, PostgreSQL. Excellent travail sur le projet d'intégration…"></textarea>
                </div>
                <div class="form-group full-width" style="margin-top:14px">
                  <label>QUALITÉS COMPORTEMENTALES (SOFT SKILLS)</label>
                  <textarea v-model="form.softSkills" rows="3" placeholder="Ex: Très bonne capacité de travail en équipe, ponctualité, esprit d'initiative…"></textarea>
                </div>
                <!-- Mention uniquement pour Master/Doctorat et Double Diplomation -->
                <div
                  v-if="form.candidatureType === 'Master / Doctorat' || form.candidatureType === 'Double Diplomation'"
                  class="form-group full-width"
                  style="margin-top:14px"
                >
                  <label>MENTION / NIVEAU GLOBAL</label>
                  <select v-model="form.mention" class="select-field">
                    <option value="">— Sélectionner —</option>
                    <option value="Très Bien">Très Bien</option>
                    <option value="Bien">Bien</option>
                    <option value="Assez Bien">Assez Bien</option>
                    <option value="Passable">Passable</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Navigation buttons -->
            <div class="form-nav">
              <div v-if="currentStep > 0" class="butn-back" @click="currentStep--">
                <ChevronLeft size="16" /> Précédent
              </div>
              <div class="spacer"></div>
              <button v-if="currentStep === 0" class="btn-next" @click="goNext" type="button">
                Suivant <ChevronRight size="16" />
              </button>
              <button v-if="currentStep === 1" class="generate-btn" @click="generateLetter" :disabled="isGenerating" type="button">
                <Sparkles size="16" />
                {{ isGenerating ? 'Génération en cours…' : 'Générer la lettre' }}
              </button>
            </div>

          </div>

          <!-- RIGHT: Preview -->
          <div class="preview-card">
            <div class="preview-header">
              <Sparkles size="16" color="#e5b230" />
              <span>Aperçu de la lettre</span>
            </div>

            <div v-if="!generatedLetter && !isGenerating" class="preview-empty">
              <div class="preview-empty-icon"><Sparkles size="32" color="#e5b230" /></div>
              <p>La lettre générée apparaîtra ici.</p>
              <span>Complétez les 2 étapes et cliquez sur <strong>"Générer la lettre"</strong></span>
            </div>

            <div v-if="isGenerating" class="preview-loading">
              <div class="spinner"></div>
              <p>L'IA rédige votre lettre…</p>
            </div>

            <div v-if="generatedLetter && !isGenerating" class="preview-content">
              <pre>{{ generatedLetter }}</pre>
              <div class="preview-actions">
                <button class="action-btn copy-btn" @click="copyLetter"><Copy size="14" /> Copier</button>
                <button class="action-btn download-btn" @click="downloadLetter"><Download size="14" /> Télécharger</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home, Eye, Star, MessageCircle, Settings, HelpCircle,
  LogOut, ChevronLeft, ChevronRight, Search, Bell, Sparkles,
  Copy, Download, CheckCheck
} from 'lucide-vue-next'

const router = useRouter()
const isOpen = ref(true)
const searchQuery = ref('')
const isGenerating = ref(false)
const generatedLetter = ref('')
const currentStep = ref(0)

const steps = ['Informations de base', 'Détails & Appréciation']

const user = { name: 'M. Ghailani' }
const initials = computed(() => user.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase())
const toggleSidebar = () => { isOpen.value = !isOpen.value }
const logout = () => router.push('/login')

const candidatureTypes = ['Master / Doctorat', 'Double Diplomation', 'Stage', 'Emploi', 'Programme International']
const languages = ['Français', 'Anglais', 'Arabe', 'Espagnol']

const form = ref({
  profName: 'Pr. Mohammed Ghailani',
  profEmail: 'ghailani@ensa-tanger.ac.ma',
  department: '',
  institution: 'ENSA Tanger',
  studentName: '',
  level: '',
  candidatureType: '',
  language: 'Français',
  technicalQualities: '',
  softSkills: '',
  mention: '',
  extra: {
    university: '', program: '', researchMotivation: '',
    partnerSchool: '', country: '', partnerContext: '',
    company: '', duration: '', mission: '',
    position: '', proSkills: '',
    programName: '', region: '', programObjective: '',
  }
})

const goNext = () => {
  if (!form.value.profName || !form.value.studentName || !form.value.candidatureType) {
    alert('Veuillez remplir les champs obligatoires (*) et choisir un type de candidature.')
    return
  }
  currentStep.value = 1
}

const generateLetter = async () => {
  isGenerating.value = true
  generatedLetter.value = ''

  try {
    const response = await fetch(
      'http://localhost:3000/api/ai-reco/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      }
    )

    const data = await response.json()

    if (data.success) {
      generatedLetter.value = data.letter
    } else {
      generatedLetter.value = data.message
    }

  } catch (e) {
    generatedLetter.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isGenerating.value = false
  }
}

const copyLetter = () => navigator.clipboard.writeText(generatedLetter.value)

const downloadLetter = () => {
  const blob = new Blob([generatedLetter.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lettre-${form.value.studentName || 'recommandation'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
* { box-sizing: border-box; }
.layout { display: flex; height: 100vh; overflow: hidden; font-family: 'Inter', 'Segoe UI', sans-serif; }

/* ─── Sidebar ─── */
.sidebar { width: 220px; background: #0f3a4f; color: #fff; display: flex; flex-direction: column; border-right: 1px solid #1a4f5f; transition: width 0.3s ease; overflow: hidden; flex-shrink: 0; }
.sidebar.closed { width: 64px; }
.sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 8px; border-bottom: 1px solid #1a4f5f; gap: 8px; }
.sidebar.closed .sidebar-header { justify-content: center; }
.sidebar-logo { display: flex; align-items: center; gap: 8px; }
.logo-img { width: 70px; height: 60px; object-fit: contain; }
.logo-text { font-size: 1.1rem; font-weight: 700; color: white; white-space: nowrap; }
.toggle-btn { width: 32px; height: 32px; border: none; border-radius: 6px; background: rgba(245,166,35,0.1); color: #e5b230; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
.toggle-btn:hover { background: rgba(245,166,35,0.2); }
.sidebar-profile { display: flex; align-items: center; gap: 10px; padding: 12px 16px; margin-bottom: 8px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: #e5b230; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0; }
.profile-name { display: block; font-size: 0.85rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.profile-role { display: block; font-size: 0.7rem; color: #94b3c7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.verified-badge { display: flex; align-items: center; gap: 6px; padding: 8px 16px; margin: 0 16px 12px; background: rgba(245,166,35,0.1); border: 1px solid #e5b230; border-radius: 6px; font-size: 0.75rem; color: #e5b230; }
.sidebar-nav { flex: 1; overflow-y: auto; padding: 0 8px; }
.nav-label { font-size: 0.7rem; font-weight: 700; color: #94b3c7; text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 12px 6px; margin: 0; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; margin-bottom: 4px; color: #cbd5e1; text-decoration: none; border-radius: 6px; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
.nav-item:hover { background: rgba(245,166,35,0.08); color: #fff; }
.nav-item.active { background: #e5b230; color: #0f3a4f; font-weight: 600; }
.sidebar.closed .nav-item { justify-content: center; padding: 10px; }
.nav-item.ai-btn { background: linear-gradient(135deg, rgba(0,200,255,0.12), rgba(0,120,200,0.08)); border: 1px solid rgba(0,200,255,0.25); color: #e5b230; }
.nav-item.ai-btn:hover { background: linear-gradient(135deg, rgba(0,200,255,0.22), rgba(0,120,200,0.15)); color: #e5b230; box-shadow: 0 0 12px rgba(0,200,255,0.2); }
.nav-item.ai-btn.active { background: #e5b230; color: #fff; font-weight: 600; box-shadow: 0 0 16px rgba(0,200,255,0.35); }
.badge { margin-left: auto; background: #e5b230; color: #0f3a4f; padding: 2px 6px; border-radius: 10px; font-size: 0.65rem; font-weight: 700; }
.logout-btn { display: flex; align-items: center; gap: 8px; width: calc(100% - 16px); padding: 10px 8px; margin: 16px 8px; background: rgba(245,166,35,0.1); border: 1px solid #e5b230; color: #e5b230; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.logout-btn:hover { background: #e5b230; color: #0f3a4f; }

/* ─── Main ─── */
.main-wrapper { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.topbar { height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid #f0f0f0; position: sticky; top: 0; z-index: 50; }
.page-title { font-size: 18px; font-weight: 700; color: #1a1f36; margin: 0; }
.topbar-right { display: flex; align-items: center; gap: 14px; }
.search-box { display: flex; align-items: center; gap: 8px; background: #f4f6fa; border-radius: 10px; padding: 8px 14px; width: 200px; }
.search-box input { border: none; background: none; outline: none; font-size: 13px; color: #333; width: 100%; }
.notif-btn { position: relative; background: none; border: none; cursor: pointer; padding: 4px; }
.notif-dot { position: absolute; top: 4px; right: 4px; width: 7px; height: 7px; background: #e05260; border-radius: 50%; border: 1.5px solid #fff; }
.topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: #6c63ff; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; }

/* ─── Page Content ─── */
.page-content { flex: 1; overflow-y: auto; padding: 24px; background: #f4f6fa; }

/* AI Banner */
.ai-banner { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, #0f3a4f 0%, #1a5568 100%); border: 1px solid rgba(0,200,255,0.2); border-radius: 12px; padding: 14px 20px; margin-bottom: 24px; flex-wrap: wrap; }
.ai-banner-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,200,255,0.1); border: 1px solid rgba(0,200,255,0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-banner-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.ai-banner-text strong { color: #fff; font-size: 14px; }
.ai-banner-text span { color: rgba(255,255,255,0.55); font-size: 12px; }

/* Step indicator */
.step-indicator { display: flex; align-items: center; gap: 6px; margin-left: auto; flex-wrap: wrap; }
.step-dot-wrap { display: flex; align-items: center; gap: 6px; }
.step-dot { width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
.step-dot.active { background: #e5b230; border-color: #e5b230; color: #0a2535; }
.step-dot.done { background: rgba(67,184,156,0.5); border-color: rgba(67,184,156,0.5); color: #fff; }
.step-line { width: 20px; height: 2px; background: rgba(255,255,255,0.15); border-radius: 2px; }
.step-line.done { background: rgba(67,184,156,0.5); }
.step-label { color: rgba(255,255,255,0.6); font-size: 11px; white-space: nowrap; margin-left: 8px; }

/* Form Layout */
.form-layout { display: grid; grid-template-columns: 1fr 380px; gap: 20px; align-items: start; }
.form-card { background: #fff; border-radius: 14px; padding: 28px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.form-section { margin-bottom: 28px; }
.section-title { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; color: #1a1f36; margin-bottom: 18px; }
.section-bar { width: 3px; height: 18px; border-radius: 2px; background: #e5b230; flex-shrink: 0; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 11px; font-weight: 700; color: #888; letter-spacing: 0.5px; }
.required { color: #e05260; }
.form-group input, .form-group textarea { padding: 10px 14px; border: 1.5px solid #eef0f4; border-radius: 8px; font-size: 13px; color: #1a1f36; background: #fafafa; outline: none; transition: border 0.2s; font-family: inherit; resize: vertical; }
.form-group input:focus, .form-group textarea:focus { border-color: #e5b230; background: #fff; }
.form-group input::placeholder, .form-group textarea::placeholder { color: #bbb; }

/* Chips */
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e0e4ef; background: #fff; color: #555; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.chip:hover { border-color: #e5b230; color: #e5b230; }
.chip.selected { background: #0f3a4f; color: #fff; border-color: #0f3a4f; }

/* Navigation buttons */
.form-nav { display: flex; align-items: center; margin-top: 28px; gap: 12px; }
.spacer { flex: 1; }
.butn-back {
  display: flex; align-items: center; gap: 6px;
  padding: 11px 20px;
  border: 1.5px solid #e0e4ef;
  background: #fff;
  color: #555;
  border-radius: 10px;
  font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  user-select: none;
}
.butn-back:hover { border-color: #0f3a4f; color: #0f3a4f; }
.btn-next { display: flex; align-items: center; gap: 6px; padding: 11px 24px; background: #0f3a4f; color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-next:hover { background: #1a5568; }
.generate-btn { display: flex; align-items: center; gap: 8px; padding: 11px 24px; background: #e5b230; color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(0,180,255,0.3); }
.generate-btn:hover { box-shadow: 0 6px 20px rgba(0,180,255,0.45); transform: translateY(-1px); }
.generate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Preview Card */
.preview-card { background: #fff; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); overflow: hidden; position: sticky; top: 80px; }
.preview-header { display: flex; align-items: center; gap: 8px; padding: 14px 20px; background: #0f3a4f ; font-size: 13px; font-weight: 600; color: #e5b230; border-bottom: 1px solid rgba(0,200,255,0.15); }
.preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; gap: 12px; }
.preview-empty-icon { width: 60px; height: 60px; border-radius: 16px; background: rgba(0,200,255,0.08); border: 1px solid rgba(0,200,255,0.2); display: flex; align-items: center; justify-content: center; }
.preview-empty p { font-size: 14px; font-weight: 600; color: #1a1f36; margin: 0; }
.preview-empty span { font-size: 12px; color: #aaa; line-height: 1.5; }
.preview-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; gap: 16px; }
.spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid rgba(0,200,255,0.2); border-top-color: #e5b230; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.preview-loading p { font-size: 13px; color: #888; margin: 0; }
.preview-content { padding: 20px; }
.preview-content pre { white-space: pre-wrap; word-break: break-word; font-family: 'Inter', sans-serif; font-size: 12.5px; color: #333; line-height: 1.8; max-height: 480px; overflow-y: auto; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; margin: 0 0 14px; }
.preview-actions { display: flex; gap: 10px; }
.action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.copy-btn { background: #f4f6fa; color: #555; border: 1px solid #e0e4ef; }
.copy-btn:hover { background: #eef0f4; }
.download-btn { background: #e5b230; color: #fff; border: none; box-shadow: 0 2px 8px rgba(0,180,255,0.25); }
.download-btn:hover { box-shadow: 0 4px 12px rgba(0,180,255,0.4); }

/* Select */
.select-field {
  padding: 10px 14px;
  border: 1.5px solid #eef0f4;
  border-radius: 8px;
  font-size: 13px; color: #1a1f36;
  background: #fafafa;
  outline: none; transition: border 0.2s;
  font-family: inherit;
  cursor: pointer;
  appearance: auto;
}
.select-field:focus { border-color: #e5b230; background: #fff; }
</style>