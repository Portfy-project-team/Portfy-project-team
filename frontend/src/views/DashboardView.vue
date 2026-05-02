<template>
  <div class="dashboard">
    <h1>Bonjour, {{ authStore.utilisateur?.prenom }} !</h1>

    <!-- Dashboard Étudiant -->
    <div v-if="authStore.estEtudiant">
      <h2>Mes projets</h2>
      <p v-if="projectStore.chargement">Chargement...</p>
      <div v-else>
        <ProjectCard
          v-for="projet in projectStore.projets"
          :key="projet.id"
          :projet="projet"
        />
        <p v-if="projectStore.projets.length === 0">
          Aucun projet pour l'instant.
        </p>
      </div>
    </div>

    <!-- Dashboard Professeur -->
    <div v-if="authStore.estProfesseur">
      <h2>Projets en attente de validation</h2>
      <ProjectCard
        v-for="projet in projectStore.projetsEnAttente"
        :key="projet.id"
        :projet="projet"
        :mode-validation="true"
        @valider="handleValider"
      />
    </div>

    <button @click="deconnexion">Se déconnecter</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore }    from '../stores/auth.store';
import { useProjectStore } from '../stores/project.store';
import { projetService }   from '../services/api';
import ProjectCard from '../components/ProjectCard.vue';

const router       = useRouter();
const authStore    = useAuthStore();
const projectStore = useProjectStore();

onMounted(async () => {
  if (authStore.estEtudiant)   await projectStore.fetchMesProjets();
  if (authStore.estProfesseur) await projectStore.fetchProjetsEnAttente();
});

const handleValider = async (projetId, statut) => {
  await projetService.valider(projetId, { statut });
  await projectStore.fetchProjetsEnAttente();
};

const deconnexion = () => {
  authStore.deconnexion();
  router.push('/login');
};
</script>