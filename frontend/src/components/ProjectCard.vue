<template>
  <div class="project-card">
    <div class="card-header">
      <h3>{{ projet.titre }}</h3>
      <span :class="`statut statut-${projet.statut}`">
        {{ projet.statut.replace(/_/g, ' ') }}
      </span>
    </div>

    <p>{{ projet.description }}</p>

    <div class="techs">
      <span
        v-for="tech in projet.technologies"
        :key="tech"
        class="tech-tag"
      >
        {{ tech }}
      </span>
    </div>

    <div class="card-footer">
      <a v-if="projet.lien_github" :href="projet.lien_github" target="_blank">
        GitHub
      </a>

      <div v-if="modeValidation" class="validation-btns">
        <button @click="$emit('valider', projet.id, 'valide')">✅ Valider</button>
        <button @click="$emit('valider', projet.id, 'refuse')">❌ Refuser</button>
        <button @click="$emit('valider', projet.id, 'correction_demandee')">✏️ Correction</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  projet:         { type: Object,  required: true },
  modeValidation: { type: Boolean, default: false }
});

defineEmits(['valider']);
</script>