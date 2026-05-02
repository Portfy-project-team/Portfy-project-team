<template>
  <div class="badge-card">
    <span class="badge-icon">🏆</span>
    <div class="badge-info">
      <h4>{{ badge.nom }}</h4>
      <p>{{ badge.description }}</p>
      <small>Obtenu le {{ formatDate(badge.date_attribution) }}</small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  badge: { type: Object, required: true }
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};
</script>