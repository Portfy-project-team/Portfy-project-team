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

