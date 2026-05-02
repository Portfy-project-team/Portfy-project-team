<template>
  <div class="portfolio">
    <div v-if="chargement">Chargement du portfolio...</div>
    <div v-else>
      <h1>Portfolio certifié</h1>

      <section>
        <h2>Badges obtenus</h2>
        <BadgeCard
          v-for="badge in badges"
          :key="badge.nom"
          :badge="badge"
        />
        <p v-if="badges.length === 0">Aucun badge pour l'instant.</p>
      </section>

      <section>
        <h2>Projets validés par l'institution</h2>
        <ProjectCard
          v-for="projet in projets"
          :key="projet.id"
          :projet="projet"
        />
        <p v-if="projets.length === 0">Aucun projet validé.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute }       from 'vue-router';
import { projetService }  from '../services/api';
import ProjectCard from '../components/ProjectCard.vue';
import BadgeCard   from '../components/BadgeCard.vue';

const route      = useRoute();
const projets    = ref([]);
const badges     = ref([]);
const chargement = ref(true);

onMounted(async () => {
  try {
    const response = await projetService.getPortfolio(route.params.id);
    projets.value  = response.data.projets;
    badges.value   = response.data.badges;
  } catch (err) {
    console.error('Erreur chargement portfolio', err);
  } finally {
    chargement.value = false;
  }
});
</script>