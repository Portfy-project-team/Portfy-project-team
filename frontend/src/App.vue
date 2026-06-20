<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const savedTheme = localStorage.getItem('portfy-theme')
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
})
</script>

<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>