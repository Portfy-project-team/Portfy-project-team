<template>
  <nav class="navbar">
    <router-link to="/dashboard" class="logo">Portfy</router-link>

    <div class="nav-links">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link
        v-if="authStore.estEtudiant"
        :to="`/portfolio/${authStore.utilisateur?.id}`"
      >
        Mon Portfolio
      </router-link>
    </div>

    <div class="nav-user">
      <span>{{ authStore.utilisateur?.prenom }}</span>
      <span class="role-badge">{{ authStore.utilisateur?.role }}</span>
      <button @click="deconnexion">Déconnexion</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter }    from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router    = useRouter();
const authStore = useAuthStore();

const deconnexion = () => {
  authStore.deconnexion();
  router.push('/login');
};
</script>