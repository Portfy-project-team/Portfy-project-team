<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">Centre d'aide</h2>
      <p class="page-subtitle">Trouvez des réponses à vos questions ou contactez le support</p>
    </div>

    <!-- Search -->
    <div class="search-section">
      <div class="search-box">
        <Search size="20" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher dans l'aide..." />
      </div>
    </div>

    <!-- Quick Links -->
    <div class="quick-links">
      <div class="quick-link-card" @click="docOpen = true">
        <BookOpen size="24" />
        <h3>Documentation</h3>
        <p>Guide complet d'utilisation</p>
      </div>
      <div class="quick-link-card" @click="openChat">
        <MessageCircle size="24" />
        <h3>Chat Support</h3>
        <p>Parlez à un agent</p>
      </div>
      <div class="quick-link-card" @click="copyEmail">
        <Mail size="24" />
        <h3>Email</h3>
        <p>support@portfy.com</p>
        <span v-if="emailCopied" class="copied-badge">Copié !</span>
      </div>
      <div class="quick-link-card" @click="copyPhone">
        <Phone size="24" />
        <h3>Téléphone</h3>
        <p>+212 5 35 46 78 90</p>
        <span v-if="phoneCopied" class="copied-badge">Copié !</span>
      </div>
    </div>

    <!-- FAQ -->
    <div class="faq-section">
      <h3 class="section-title">Questions fréquemment posées</h3>
      <div v-if="filteredFaqs.length === 0" class="empty-faq">
        <p>Aucune question trouvée pour "{{ searchQuery }}".</p>
      </div>
      <div class="faq-list">
        <div v-for="(faq, idx) in filteredFaqs" :key="idx" class="faq-item">
          <button class="faq-header" @click="toggleFaq(idx)">
            <div class="faq-title">
              <ChevronDown size="20" :class="{ open: expandedFaqs.includes(idx) }" />
              <span>{{ faq.question }}</span>
            </div>
          </button>
          <div v-if="expandedFaqs.includes(idx)" class="faq-content">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="contact-section">
      <h3 class="section-title">Nous contacter</h3>
      <div v-if="messageSent" class="success-banner">
        <CheckCircle size="20" />
        <div>
          <p><strong>Message envoyé avec succès !</strong></p>
          <p>Notre équipe vous répondra dans les 24 heures.</p>
        </div>
      </div>
      <div v-else class="contact-form">
        <div class="form-group">
          <label>Objet</label>
          <input v-model="contactForm.subject" type="text" placeholder="Décrivez votre problème" />
          <p v-if="formErrors.subject" class="field-error">{{ formErrors.subject }}</p>
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea v-model="contactForm.message" rows="6" placeholder="Décrivez votre question en détail..."></textarea>
          <p v-if="formErrors.message" class="field-error">{{ formErrors.message }}</p>
        </div>
        <button class="btn-submit" :class="{ loading: sending }" @click="submitContact">
          <Loader2 v-if="sending" size="16" class="spin" />
          <Send v-else size="16" />
          {{ sending ? 'Envoi en cours...' : 'Envoyer' }}
        </button>
      </div>
    </div>

    <!-- Documentation Modal -->
    <div v-if="docOpen" class="modal-overlay doc-overlay" @click.self="docOpen = false">
      <div class="doc-modal">
        <div class="doc-modal-header">
          <div class="doc-modal-title">
            <BookOpen size="20" />
            <h3>Documentation Portfy</h3>
          </div>
          <button class="close-btn" @click="docOpen = false"><X size="18" /></button>
        </div>
        <div class="doc-nav">
          <button
            v-for="section in docSections" :key="section.id"
            class="doc-nav-btn" :class="{ active: activeDoc === section.id }"
            @click="activeDoc = section.id"
          >
            <component :is="section.icon" size="15" />
            {{ section.label }}
          </button>
        </div>
        <div class="doc-body">
          <div v-if="activeDoc === 'start'">
            <h4>Bienvenue sur Portfy</h4>
            <p>Portfy est une plateforme dédiée à la gestion des portfolios étudiants. En tant que professeur, vous pouvez consulter, évaluer et recommander les travaux de vos étudiants.</p>
            <div class="doc-steps">
              <div class="doc-step">
                <span class="step-num">1</span>
                <div><strong>Connexion</strong><p>Accédez à votre espace via vos identifiants institutionnels.</p></div>
              </div>
              <div class="doc-step">
                <span class="step-num">2</span>
                <div><strong>Dashboard</strong><p>Consultez vos statistiques : portfolios visités, recommandations publiées, commentaires reçus.</p></div>
              </div>
              <div class="doc-step">
                <span class="step-num">3</span>
                <div><strong>Portfolios</strong><p>Parcourez les portfolios de vos étudiants depuis la section dédiée.</p></div>
              </div>
            </div>
          </div>
          <div v-if="activeDoc === 'reco'">
            <h4>Gérer les recommandations</h4>
            <p>Les recommandations vous permettent d'évaluer et de valider les compétences de vos étudiants.</p>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Ajouter :</strong> Cliquez sur "+ Ajouter" dans la section Recommandations, sélectionnez l'étudiant et rédigez votre avis.</p></div>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Modifier :</strong> Cliquez sur l'icône crayon à côté de la recommandation souhaitée.</p></div>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Supprimer :</strong> Utilisez l'icône corbeille. Une confirmation vous sera demandée.</p></div>
            <div class="doc-tip warning"><AlertTriangle size="16" /><p>Une recommandation publiée est visible par l'étudiant et les recruteurs dès sa publication.</p></div>
          </div>
          <div v-if="activeDoc === 'comments'">
            <h4>Gérer les commentaires</h4>
            <p>Les commentaires sont les retours que vos étudiants vous envoient directement depuis leurs portfolios.</p>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Lire :</strong> Les commentaires non lus apparaissent avec un bandeau orange.</p></div>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Répondre :</strong> Cliquez sur l'icône réponse pour envoyer un message à l'étudiant.</p></div>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Filtrer :</strong> Utilisez les boutons "Tous", "Lus", "Non lus" pour trier.</p></div>
          </div>
          <div v-if="activeDoc === 'settings'">
            <h4>Paramètres du compte</h4>
            <p>Gérez vos informations personnelles et les préférences de votre compte.</p>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Profil :</strong> Modifiez votre nom, email, téléphone et établissement.</p></div>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Notifications :</strong> Activez ou désactivez les alertes email.</p></div>
            <div class="doc-tip"><CheckCircle size="16" /><p><strong>Sécurité :</strong> Changez votre mot de passe régulièrement. Minimum 8 caractères.</p></div>
            <div class="doc-tip warning"><AlertTriangle size="16" /><p>La suppression de compte est irréversible.</p></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Modal -->
    <div v-if="chatOpen" class="modal-overlay" @click.self="chatOpen = false">
      <div class="modal chat-modal">
        <div class="chat-header">
          <div class="agent-avatar">A</div>
          <div>
            <p class="agent-name">Support Portfy</p>
            <p class="agent-status">En ligne</p>
          </div>
          <button class="close-btn" @click="chatOpen = false"><X size="18" /></button>
        </div>
        <div class="chat-body">
          <div class="chat-message bot">
            <p>Bonjour ! Comment puis-je vous aider aujourd'hui ?</p>
          </div>
          <div v-for="(msg, i) in chatMessages" :key="i" class="chat-message" :class="msg.from">
            <p>{{ msg.text }}</p>
          </div>
        </div>
        <div class="chat-input-row">
          <input v-model="chatInput" type="text" placeholder="Votre message..." @keyup.enter="sendChatMessage" />
          <button class="send-btn" @click="sendChatMessage"><Send size="16" /></button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast">
        <CheckCircle size="16" />
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Search, BookOpen, MessageCircle, Mail, Phone,
  ChevronDown, Send, CheckCircle, X, Loader2,
  AlertTriangle, FileText, Star, MessageSquare, Settings
} from 'lucide-vue-next'

const searchQuery   = ref('')
const expandedFaqs  = ref([])
const emailCopied   = ref(false)
const phoneCopied   = ref(false)
const chatOpen      = ref(false)
const chatInput     = ref('')
const chatMessages  = ref([])
const messageSent   = ref(false)
const sending       = ref(false)
const formErrors    = ref({})
const toast         = ref({ show: false, message: '' })
const docOpen       = ref(false)
const activeDoc     = ref('start')

const docSections = [
  { id: 'start',    label: 'Démarrage',        icon: FileText      },
  { id: 'reco',     label: 'Recommandations',   icon: Star          },
  { id: 'comments', label: 'Commentaires',      icon: MessageSquare },
  { id: 'settings', label: 'Paramètres',        icon: Settings      },
]

const faqs = ref([
  { question: 'Comment rédiger une recommandation ?',          answer: 'Allez dans "Recommandations", cliquez sur "+ Ajouter", remplissez le formulaire puis publiez.' },
  { question: 'Comment consulter les portfolios ?',            answer: 'Accédez à la section "Portfolios consultés" pour voir l\'historique.' },
  { question: 'Puis-je modifier une recommandation publiée ?', answer: 'Oui, via l\'icône crayon dans la section Recommandations.' },
  { question: 'Comment filtrer les portfolios ?',              answer: 'Utilisez les filtres disponibles dans la page Portfolios consultés.' },
  { question: 'Comment gérer les notifications ?',             answer: 'Allez dans Paramètres puis Notifications.' },
  { question: 'Où trouver mon historique d\'activités ?',      answer: 'Votre historique est visible sur le Dashboard.' },
  { question: 'Comment exporter mes données ?',                answer: 'Allez dans Paramètres puis Exporter mes données.' },
  { question: 'Que faire si je rencontre un problème ?',       answer: 'Contactez le support via le formulaire ou par email.' },
])

const contactForm = ref({ subject: '', message: '' })

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs.value
  return faqs.value.filter(f =>
    f.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function toggleFaq(idx) {
  const i = expandedFaqs.value.indexOf(idx)
  i > -1 ? expandedFaqs.value.splice(i, 1) : expandedFaqs.value.push(idx)
}

function openChat() { chatOpen.value = true }

function copyEmail() {
  navigator.clipboard.writeText('support@portfy.com').then(() => {
    emailCopied.value = true
    showToast('Email copié !')
    setTimeout(() => { emailCopied.value = false }, 2000)
  })
}

function copyPhone() {
  navigator.clipboard.writeText('+212 5 35 46 78 90').then(() => {
    phoneCopied.value = true
    showToast('Numéro copié !')
    setTimeout(() => { phoneCopied.value = false }, 2000)
  })
}

function sendChatMessage() {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({ from: 'user', text: chatInput.value })
  chatInput.value = ''
  setTimeout(() => {
    chatMessages.value.push({ from: 'bot', text: 'Merci pour votre message. Un agent vous répondra très prochainement.' })
  }, 800)
}

function validateForm() {
  const errors = {}
  if (!contactForm.value.subject.trim()) errors.subject = 'L\'objet est requis.'
  if (!contactForm.value.message.trim() || contactForm.value.message.length < 20)
    errors.message = 'Le message doit contenir au moins 20 caractères.'
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

async function submitContact() {
  if (!validateForm()) return
  sending.value = true
  await new Promise(r => setTimeout(r, 1500))
  sending.value = false
  messageSent.value = true
  contactForm.value = { subject: '', message: '' }
}

function showToast(message) {
  toast.value = { show: true, message }
  setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
.page-content { padding: 24px 32px; background: #f8f9fb; min-height: 100%; max-width: 1000px; font-family: 'Inter', sans-serif; }
.page-header { margin-bottom: 32px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0; }
.page-subtitle { color: #64748b; font-size: 0.875rem; margin: 4px 0 0; }
.search-section { margin-bottom: 32px; }
.search-box { display: flex; align-items: center; background: #fff; border: 2px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; gap: 12px; }
.search-box input { flex: 1; border: none; outline: none; font-size: 1rem; color: #0f172a; }
.search-box :deep(svg) { color: #64748b; stroke-width: 2; flex-shrink: 0; }
.quick-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 40px; }
.quick-link-card { background: #fff; border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all .2s; box-shadow: 0 1px 3px rgba(0,0,0,.06); position: relative; }
.quick-link-card:hover { box-shadow: 0 8px 16px rgba(0,0,0,.1); transform: translateY(-2px); }
.quick-link-card :deep(svg) { color: #e5b230; margin-bottom: 12px; stroke-width: 2; }
.quick-link-card h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
.quick-link-card p { font-size: 0.8rem; color: #64748b; margin: 0; }
.copied-badge { position: absolute; top: 8px; right: 8px; background: #059669; color: #fff; font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.section-title { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
.faq-section { margin-bottom: 40px; }
.faq-list { display: flex; flex-direction: column; gap: 12px; }
.empty-faq { background: #fff; border-radius: 10px; padding: 24px; text-align: center; color: #94a3b8; }
.faq-item { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.faq-header { width: 100%; padding: 16px 20px; border: none; background: none; cursor: pointer; transition: background .2s; }
.faq-header:hover { background: #f8f9fb; }
.faq-title { display: flex; align-items: center; gap: 12px; text-align: left; color: #0f172a; font-weight: 600; font-size: 0.95rem; }
.faq-title :deep(svg) { stroke-width: 2; color: #64748b; transition: transform .2s; flex-shrink: 0; }
.faq-title :deep(svg.open) { transform: rotate(180deg); }
.faq-content { padding: 0 20px 16px; color: #64748b; font-size: 0.9rem; line-height: 1.6; }
.contact-section { background: #fff; border-radius: 12px; padding: 28px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 6px; }
.form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; color: #0f172a; outline: none; font-family: inherit; transition: border .2s; box-sizing: border-box; }
.form-group input:focus, .form-group textarea:focus { border-color: #e5b230; }
.field-error { color: #ef4444; font-size: 0.75rem; margin: 4px 0 0; }
.btn-submit { padding: 12px 24px; background: #e5b230; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background .2s; }
.btn-submit:hover:not(.loading) { background: #d4a020; }
.btn-submit.loading { opacity: 0.8; cursor: not-allowed; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.success-banner { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; display: flex; align-items: flex-start; gap: 12px; color: #166534; }
.success-banner :deep(svg) { flex-shrink: 0; color: #16a34a; margin-top: 2px; }
.success-banner p { margin: 0; font-size: 0.875rem; }
.success-banner p:first-child { margin-bottom: 4px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: flex-end; justify-content: flex-end; padding: 24px; z-index: 1000; }
.doc-overlay { align-items: center; justify-content: center; padding: 0; }
.chat-modal { background: #fff; border-radius: 16px; width: 380px; max-height: 70vh; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,.2); }
.chat-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; }
.agent-avatar { width: 36px; height: 36px; border-radius: 50%; background: #e5b230; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.agent-name { font-weight: 600; color: #0f172a; margin: 0; font-size: 0.9rem; }
.agent-status { color: #16a34a; font-size: 0.75rem; margin: 0; }
.close-btn { margin-left: auto; background: none; border: none; color: #64748b; cursor: pointer; padding: 4px; display: flex; }
.chat-body { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
.chat-message { max-width: 80%; }
.chat-message.bot, .chat-message:not(.user) { align-self: flex-start; }
.chat-message.user { align-self: flex-end; }
.chat-message p { padding: 10px 14px; border-radius: 12px; margin: 0; font-size: 0.875rem; line-height: 1.5; }
.chat-message.bot p, .chat-message:not(.user) p { background: #f1f5f9; color: #0f172a; }
.chat-message.user p { background: #e5b230; color: #fff; }
.chat-input-row { padding: 12px 16px; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; }
.chat-input-row input { flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 0.875rem; }
.chat-input-row input:focus { border-color: #e5b230; }
.send-btn { background: #e5b230; color: #fff; border: none; border-radius: 8px; padding: 8px 12px; cursor: pointer; display: flex; align-items: center; }
.doc-modal { background: #fff; border-radius: 16px; width: 680px; max-width: 95vw; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,.2); overflow: hidden; }
.doc-modal-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
.doc-modal-title { display: flex; align-items: center; gap: 10px; color: #0f172a; }
.doc-modal-title h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }
.doc-modal-title :deep(svg) { color: #e5b230; }
.doc-nav { display: flex; gap: 4px; padding: 12px 24px; border-bottom: 1px solid #f1f5f9; background: #f8f9fb; overflow-x: auto; }
.doc-nav-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: 1px solid transparent; background: transparent; color: #64748b; font-size: 0.82rem; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all .2s; }
.doc-nav-btn:hover { background: #fff; color: #0f172a; }
.doc-nav-btn.active { background: #fff; color: #e5b230; border-color: #e2e8f0; font-weight: 600; }
.doc-nav-btn :deep(svg) { flex-shrink: 0; stroke-width: 2; color: currentColor; }
.doc-body { flex: 1; overflow-y: auto; padding: 24px; }
.doc-body h4 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
.doc-body > div > p { color: #64748b; font-size: 0.9rem; line-height: 1.6; margin: 0 0 20px; }
.doc-steps { display: flex; flex-direction: column; gap: 14px; }
.doc-step { display: flex; align-items: flex-start; gap: 14px; background: #f8f9fb; border-radius: 10px; padding: 14px 16px; }
.step-num { width: 28px; height: 28px; border-radius: 50%; background: #e5b230; color: #fff; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.doc-step strong { font-size: 0.9rem; color: #0f172a; display: block; margin-bottom: 2px; }
.doc-step p { font-size: 0.82rem; color: #64748b; margin: 0; }
.doc-tip { display: flex; align-items: flex-start; gap: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; }
.doc-tip :deep(svg) { color: #16a34a; flex-shrink: 0; margin-top: 1px; }
.doc-tip p { font-size: 0.85rem; color: #166534; margin: 0; line-height: 1.5; }
.doc-tip.warning { background: #fffbeb; border-color: #fde68a; }
.doc-tip.warning :deep(svg) { color: #e5b230; }
.doc-tip.warning p { color: #92400e; }
.toast { position: fixed; bottom: 32px; right: 32px; background: #1e293b; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 10px; z-index: 2000; box-shadow: 0 4px 16px rgba(0,0,0,.15); }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
:deep(svg) { flex-shrink: 0; stroke-width: 2; color: currentColor; }
</style>