<template>
  <div>
    <Navbar v-if="authStore.estConnecte" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/auth.store';
const authStore = useAuthStore();
</script>