<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from './utils/auth';
import ToastContainer from './components/ToastContainer.vue';

const { initSession } = useAuth();

onMounted(async () => {
  // Try to restore user session if token exists
  await initSession();
});
</script>

<template>
  <router-view />
  <ToastContainer />
</template>

<style>
/* App level layout styling is handled by global auth-theme.css */
</style>
