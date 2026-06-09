<script setup>
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

import { helpCards, questions } from '../../data/mockData.js'
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Aide & Support" user-initials="AA" />

      <main class="help-page">
        <section class="hero-section">
          <h2>Comment pouvons-nous vous aider ?</h2>
          <p>Trouvez rapidement les reponses a vos questions</p>

          <div class="help-search">
            <input type="text" placeholder="Rechercher dans l'aide..." />
          </div>
        </section>

        <section class="help-cards">
          <div
            v-for="card in helpCards"
            :key="card.title"
            class="help-card"
          >
            <div :class="['card-icon', card.color]"></div>

            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </section>

        <section class="faq-section">
          <h2>Questions frequentes</h2>

          <div class="faq-list">
            <div
              v-for="question in questions"
              :key="question.title"
              class="faq-item"
            >
              <h3>{{ question.title }}</h3>
              <p>{{ question.description }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f1ec;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f4f1ec;
}

.help-page {
  padding: 34px 38px 60px;
}

.hero-section {
  text-align: center;
  margin-bottom: 32px;
}

.hero-section h2 {
  margin: 0 0 12px;
  font-size: 34px;
  font-weight: 800;
  color: #050505;
}

.hero-section p {
  margin: 0 0 30px;
  color: #64748b;
  font-size: 18px;
}

.help-search {
  width: 100%;
  max-width: 670px;
  height: 58px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 0 34px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.help-search input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 18px;
  color: #334155;
}

.help-search input::placeholder {
  color: #64748b;
}

.help-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 32px;
}

.help-card {
  min-height: 175px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 26px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 18px;
}

.cream {
  background: #fff2d8;
}

.blue {
  background: #dff2ff;
}

.green {
  background: #d6f7e4;
}

.help-card h3 {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 800;
  color: #050505;
}

.help-card p {
  margin: 0;
  color: #64748b;
  font-size: 16px;
}

.faq-section h2 {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 800;
  color: #050505;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 22px 26px;
}

.faq-item h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 800;
  color: #050505;
}

.faq-item p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

@media (max-width: 1100px) {
  .help-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .help-page {
    padding: 24px 20px;
  }

  .hero-section h2 {
    font-size: 26px;
  }

  .help-search {
    height: 52px;
    padding: 0 22px;
  }
}
</style>