<template>
  <div class="min-h-screen bg-gradient-to-b from-white via-white to-indigo-50">
    <NavBar />
    <router-view class="min-h-[70vh]" />
    <AppFooter />
  </div>
</template>

<script setup>
  import NavBar from '@/components/NavBar.vue'
  import AppFooter from '@/components/AppFooter.vue'
</script>

<style>
  html, body, #app { height: 100%; }
  html { scroll-behavior: smooth; }
</style>