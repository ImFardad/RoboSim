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
/* ==========================================================================
   RoboSim Premium Dark Theme & Layout System (Global Resets & Design Tokens)
   ========================================================================== */

:root {
  /* HSL Colors */
  --bg-h: 224;
  --bg-s: 32%;
  --bg-l: 12%;
  --bg-color: hsl(var(--bg-h), var(--bg-s), var(--bg-l));
  
  --surface-color: hsl(var(--bg-h), var(--bg-s), 16%);
  --surface-card: hsla(var(--bg-h), var(--bg-s), 16%, 0.4);
  
  --primary-h: 250;
  --primary-s: 84%;
  --primary-l: 54%;
  --primary-color: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
  --primary-glow: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.3);
  
  --accent-h: 310;
  --accent-s: 75%;
  --accent-l: 50%;
  --accent-color: hsl(var(--accent-h), var(--accent-s), var(--accent-l));
  --accent-glow: hsla(var(--accent-h), var(--accent-s), var(--accent-l), 0.3);

  --text-primary: hsl(210, 40%, 98%);
  --text-secondary: hsl(215, 20%, 65%);
  --text-muted: hsl(215, 15%, 45%);
  
  --success-color: hsl(142, 70%, 45%);
  --success-glow: hsla(142, 70%, 45%, 0.2);
  --error-color: hsl(350, 80%, 55%);
  --error-glow: hsla(350, 80%, 55%, 0.2);

  --border-glow: rgba(255, 255, 255, 0.08);
  --border-focus: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.5);

  --font-family: 'Vazirmatn', system-ui, 'Segoe UI', Tahoma, sans-serif;
  --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  --transition-fast: all 0.15s ease;
  
  --border-radius-sm: 8px;
  --border-radius-md: 16px;
  --border-radius-lg: 24px;
}

/* Base resets & typography */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, :root {
  background-color: var(--bg-color) !important;
  font-family: var(--font-family);
  line-height: 1.7;
  font-weight: 400;
  color-scheme: light dark;
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* Ambient glow effects in background */
body::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(0,0,0,0) 70%);
  z-index: -1;
  pointer-events: none;
}

body::after {
  content: '';
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(0,0,0,0) 70%);
  z-index: -1;
  pointer-events: none;
}

/* Glassmorphism Card style */
.glass-card {
  background: var(--surface-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-glow);
  border-radius: var(--border-radius-md);
  padding: 40px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  position: relative;
  overflow: hidden;
}

/* Subtle laser highlight on card top */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
}

/* Common animations */
@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

/* Vue Dropdown Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
