<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Portfy</h1>
      <p>Plateforme de portfolios certifiés — ENSA Tanger</p>

      <div v-if="authStore.erreur" class="erreur">
        {{ authStore.erreur }}
      </div>

      <input v-model="email"      type="email"    placeholder="Email" />
      <input v-model="motDePasse" type="password" placeholder="Mot de passe" />

      <button @click="handleLogin" :disabled="authStore.chargement">
        {{ authStore.chargement ? 'Connexion...' : 'Se connecter' }}
      </button>

      <p>Pas encore de compte ?
        <router-link to="/register">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router     = useRouter();
const authStore  = useAuthStore();
const email      = ref('');
const motDePasse = ref('');

const handleLogin = async () => {
  const succes = await authStore.connexion(email.value, motDePasse.value);
  if (succes) router.push('/dashboard');
};
</script>