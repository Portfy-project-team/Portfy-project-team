<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  },
  userInitials: {
    type: String,
    default: 'AA'
  }
})
</script>

<template>
  <header class="topbar">
    <h1 class="topbar-title">
      {{ title }}
    </h1>

    <div class="topbar-actions">
      <div class="search-box">
        <input type="text" placeholder="Rechercher..." />
      </div>

      <button class="notification-btn" aria-label="Notifications">
        <span class="notification-dot"></span>
      </button>

      <button class="profile-btn">
        {{ userInitials }}
      </button>
    </div>
  </header>
</template>

