<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Créer un compte</h1>

      <div v-if="authStore.erreur" class="erreur">{{ authStore.erreur }}</div>

      <input v-model="form.nom"          placeholder="Nom" />
      <input v-model="form.prenom"       placeholder="Prénom" />
      <input v-model="form.email"        type="email"    placeholder="Email" />
      <input v-model="form.mot_de_passe" type="password" placeholder="Mot de passe" />

      <select v-model="form.role">
        <option value="etudiant">Étudiant</option>
        <option value="professeur">Professeur</option>
        <option value="professionnel">Professionnel</option>
      </select>

      <template v-if="form.role === 'etudiant'">
        <input v-model="form.filiere" placeholder="Filière (ex: GINF)" />
        <input v-model="form.niveau"  placeholder="Niveau (ex: 1ère année)" />
      </template>

      <button @click="handleRegister" :disabled="authStore.chargement">
        {{ authStore.chargement ? 'Inscription...' : "S'inscrire" }}
      </button>

      <p>Déjà un compte ?
        <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router    = useRouter();
const authStore = useAuthStore();

const form = reactive({
  nom: '', prenom: '', email: '',
  mot_de_passe: '', role: 'etudiant',
  filiere: '', niveau: ''
});

const handleRegister = async () => {
  const succes = await authStore.inscription(form);
  if (succes) router.push('/login');
};
</script>