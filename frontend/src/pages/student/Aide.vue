<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Aide & Support" />

      <main class="help-page">
        <section class="help-hero">
          <h1>À propos de Portfy</h1>
          <p>Portfy est votre plateforme de gestion de portfolio académique et professionnel. Elle vous permet de centraliser vos projets, valider vos compétences auprès de vos professeurs et booster votre visibilité auprès des recruteurs.</p>
        </section>

        <section class="help-categories">
          <div class="category-card" v-for="cat in categories" :key="cat.title">
            <div class="cat-icon" :class="cat.color">{{ cat.icon }}</div>
            <h3>{{ cat.title }}</h3>
            <p>{{ cat.desc }}</p>
            <button class="link-btn">Consulter</button>
          </div>
        </section>

        <section class="faq-section">
          <h2>Questions frequentes</h2>
          
          <div class="faq-list">
            <div 
              v-for="(item, index) in filteredFaq" 
              :key="index" 
              class="faq-item"
              :class="{ active: activeFaq === index }"
              @click="toggleFaq(index)"
            >
              <div class="faq-question">
                {{ item.q }}
                <span class="chevron"></span>
              </div>
              <div class="faq-answer" v-if="activeFaq === index">
                {{ item.a }}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

const searchQuery = ref('')
const activeFaq = ref(null)

const categories = [
  { title: 'Mon Portfolio', desc: 'Gerer votre profil et votre visibilite.', icon: '👤', color: 'blue' },
  { title: 'Projets & Stages', desc: 'Soumission et validation academie.', icon: '💼', color: 'orange' },
  { title: 'Compétences', desc: 'Mise en avant de vos talents.', icon: '🎯', color: 'green' },
  { title: 'Confidentialité', desc: 'Securite et donnees personnelles.', icon: '🔒', color: 'purple' }
]

const faq = [
  { q: 'Comment mon score est-il calcule ?', a: 'Votre score de credibilite depend de la completude de votre profil, du nombre de projets valides par vos professeurs et de vos certifications.' },
  { q: 'Qui peut voir mon portfolio ?', a: 'Vous pouvez regler la visibilite dans vos parametres : Public (visible par tous), Privé (uniquement vous) ou Réseau (uniquement votre ecole).' },
  { q: 'Comment ajouter un projet ?', a: 'Allez dans la section "Projets", cliquez sur "Nouveau Projet" et remplissez le formulaire. N\'oubliez pas de le soumettre pour validation.' },
  { q: 'Comment telecharger mon portfolio en PDF ?', a: 'Dans votre page "Portfolio", un bouton "Exporter en PDF" est disponible en haut a droite.' }
]

const filteredFaq = computed(() => {
  if (!searchQuery.value) return faq
  return faq.filter(f => f.q.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

function toggleFaq(index) {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f1ec;
}

.student-main {
  flex: 1;
  min-width: 0;
}

.help-page {
  padding: 40px;
}

.help-hero {
  text-align: center;
  margin-bottom: 50px;
  background: #082a47;
  color: white;
  padding: 60px 20px;
  border-radius: 20px;
}

.help-hero h1 { font-size: 36px; font-weight: 900; margin-bottom: 15px; }

.help-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.category-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s;
}

.category-card:hover { transform: translateY(-5px); }

.cat-icon {
  font-size: 40px;
  margin-bottom: 15px;
  width: 70px;
  height: 70px;
  line-height: 70px;
  border-radius: 50%;
  margin: 0 auto 20px;
}

.cat-icon.blue { background: #dff2ff; }
.cat-icon.orange { background: #fff2d8; }
.cat-icon.green { background: #d6f7e4; }
.cat-icon.purple { background: #ede9fe; }

.link-btn {
  background: transparent;
  border: none;
  color: #082a47;
  font-weight: 800;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 15px;
}

.faq-section {
  margin-bottom: 60px;
}

.faq-section h2 { font-size: 28px; font-weight: 900; margin-bottom: 30px; color: #082a47; }

.faq-list {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.faq-item {
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}

.faq-question {
  padding: 20px 25px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question:hover { background: #f8fafc; }

.faq-answer {
  padding: 0 25px 20px;
  color: #64748b;
  line-height: 1.6;
}
</style>
