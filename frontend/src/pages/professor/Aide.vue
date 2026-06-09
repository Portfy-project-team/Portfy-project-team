<template>
  <div class="professor-layout">
    <Sidebar :user="user" :comment-count="3" />
    <div class="main-content">
      <Topbar title="Aide & Support" />

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
          <div class="quick-link-card">
            <BookOpen size="24" />
            <h3>Documentation</h3>
            <p>Guide complet d'utilisation</p>
          </div>
          <div class="quick-link-card">
            <MessageCircle size="24" />
            <h3>Chat Support</h3>
            <p>Parlez à un agent</p>
          </div>
          <div class="quick-link-card">
            <Mail size="24" />
            <h3>Email</h3>
            <p>support@portfy.com</p>
          </div>
          <div class="quick-link-card">
            <Phone size="24" />
            <h3>Téléphone</h3>
            <p>+212 5 35 46 78 90</p>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="faq-section">
          <h3 class="section-title">Questions fréquemment posées</h3>

          <div class="faq-list">
            <div v-for="(faq, idx) in filteredFaqs" :key="idx" class="faq-item">
              <button class="faq-header" @click="toggleFaq(idx)">
                <div class="faq-title">
                  <ChevronDown
                    size="20"
                    :class="{ open: expandedFaqs.includes(idx) }"
                  />
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
          <div class="contact-form">
            <div class="form-group">
              <label>Objet</label>
              <input v-model="contactForm.subject" type="text" placeholder="Décrivez votre problème" />
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea v-model="contactForm.message" rows="6" placeholder="Décrivez votre question en détail..."></textarea>
            </div>
            <button class="btn-submit">
              <Send size="16" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '../../components/professor/Sidebar.vue'
import Topbar from '../../components/professor/Topbar.vue'
import { Search, BookOpen, MessageCircle, Mail, Phone, ChevronDown, Send } from 'lucide-vue-next'

const user = { name: 'M. Ghailani', role: 'Professeur · ENSAT', verified: true }

const searchQuery = ref('')
const expandedFaqs = ref([])

const faqs = ref([
  {
    question: 'Comment rédiger une recommandation ?',
    answer: 'Pour rédiger une recommandation, allez dans la section "Recommandations", cliquez sur "+ Ajouter une recommandation", remplissez le formulaire avec le nom de l\'étudiant et votre avis détaillé, puis publiez.'
  },
  {
    question: 'Comment consulter les portfolios des étudiants ?',
    answer: 'Accédez à la section "Portfolios consultés" pour voir l\'historique de tous les portfolios que vous avez consultés. Vous pouvez filtrer par étudiant ou par statut.'
  },
  {
    question: 'Puis-je modifier une recommandation publiée ?',
    answer: 'Oui, vous pouvez modifier ou supprimer toute recommandation. Allez dans "Recommandations", trouvez la recommandation souhaitée et cliquez sur l\'icône de modification.'
  },
  {
    question: 'Comment filtrer les portfolios ?',
    answer: 'Utilisez les filtres en haut de la page "Portfolios consultés" pour afficher les portfolios recommandés, commentés, ou favoris. Vous pouvez également trier par date ou par nombre de visites.'
  },
  {
    question: 'Comment gérer les notifications ?',
    answer: 'Allez dans "Paramètres" et cliquez sur "Notifications" pour activer ou désactiver les différents types d\'alertes.'
  },
  {
    question: 'Où trouver mon historique d\'activités ?',
    answer: 'Votre historique d\'activités est visible sur le Dashboard. Vous y verrez vos actions récentes et les événements importants.'
  },
  {
    question: 'Comment exporter mes données ?',
    answer: 'Allez dans "Paramètres" et recherchez l\'option "Exporter mes données" pour télécharger un fichier contenant toutes vos informations.'
  },
  {
    question: 'Que faire si je rencontre un problème technique ?',
    answer: 'Si vous rencontrez un problème, essayez d\'abord de rafraîchir la page. Si le problème persiste, contactez-nous via le formulaire ci-dessous ou envoyez un email à support@portfy.com.'
  },
])

const contactForm = ref({
  subject: '',
  message: '',
})

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs.value
  return faqs.value.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function toggleFaq(idx) {
  const index = expandedFaqs.value.indexOf(idx)
  if (index > -1) {
    expandedFaqs.value.splice(index, 1)
  } else {
    expandedFaqs.value.push(idx)
  }
}
</script>

<style scoped>
.professor-layout { display: flex; min-height: 100vh; background: #f8f9fb; font-family: 'Inter', sans-serif; }
.main-content { flex: 1; display: flex; flex-direction: column; }
.page-content { padding: 24px 32px; max-width: 1000px; }

.page-header { margin-bottom: 32px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0; }
.page-subtitle { color: #64748b; font-size: 0.875rem; margin: 4px 0 0; }

.search-section { margin-bottom: 32px; }
.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  gap: 12px;
}
.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #0f172a;
}
.search-box input::placeholder { color: #94a3b8; }
.search-box :deep(svg) { color: #64748b; stroke-width: 2; flex-shrink: 0; }

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}
.quick-link-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all .2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.quick-link-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,.1);
  transform: translateY(-2px);
}
.quick-link-card :deep(svg) { color: #f5a623; margin-bottom: 12px; stroke-width: 2; }
.quick-link-card h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
.quick-link-card p { font-size: 0.8rem; color: #64748b; margin: 0; }

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}

.faq-section { margin-bottom: 40px; }
.faq-list { display: flex; flex-direction: column; gap: 12px; }
.faq-item { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.faq-header {
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background .2s;
}
.faq-header:hover { background: #f8f9fb; }
.faq-title {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  color: #0f172a;
  font-weight: 600;
  font-size: 0.95rem;
}
.faq-title :deep(svg) {
  stroke-width: 2;
  color: #64748b;
  transition: transform .2s;
  flex-shrink: 0;
}
.faq-title :deep(svg.open) { transform: rotate(180deg); }
.faq-content { padding: 0 20px 16px; color: #64748b; font-size: 0.9rem; line-height: 1.6; }

.contact-section { background: #fff; border-radius: 12px; padding: 28px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 6px; }
.form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; color: #0f172a; outline: none; font-family: inherit; transition: border .2s; }
.form-group input:focus, .form-group textarea:focus { border-color: #f5a623; }

.btn-submit {
  padding: 12px 24px;
  background: #f5a623;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover { background: #e09610; }

:deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}
</style>