<template>
  <div :class="['sidebar-drawer', { open: isOpen }]">
    <div class="sidebar-header">
      <span class="sidebar-title">Base Control</span>
      <button 
        @click="$emit('close')" 
        class="sidebar-close-btn" 
        aria-label="Close sidebar menu"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Sidebar Menu Navigation links -->
    <nav class="sidebar-menu">
      <a href="#" :class="['menu-item', { active: activeMenu === 'dashboard' }]" @click.prevent="navigate('/dashboard')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
        <span>Dashboard</span>
      </a>
      <a href="#" :class="['menu-item', { active: activeMenu === 'arena' }]" @click.prevent="showAlert(GLOSSARY.arenaFeatureAlert)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m16.2 7.8-8.4 8.4M12 2v2M12 20v2M20 12h-2M4 12H2"></path>
        </svg>
        <span>{{ GLOSSARY.arenaCardTitle }}</span>
      </a>
      <a href="#" :class="['menu-item', { active: activeMenu === 'lab' }]" @click.prevent="navigate('/lab')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"></path>
        </svg>
        <span>{{ GLOSSARY.robotsCardTitle }}</span>
      </a>
      <a href="#" :class="['menu-item', { active: activeMenu === 'history' }]" @click.prevent="showAlert(GLOSSARY.historyFeatureAlert)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"></path>
        </svg>
        <span>{{ GLOSSARY.historyCardTitle }}</span>
      </a>
    </nav>
  </div>

  <!-- Sidebar Overlay Drawer Closer -->
  <div v-if="isOpen" @click="$emit('close')" class="sidebar-overlay"></div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { GLOSSARY } from '../glossary';

defineProps<{
  isOpen: boolean;
  activeMenu?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();

function navigate(path: string) {
  emit('close');
  router.push(path);
}

function showAlert(message: string) {
  alert(message);
}
</script>

<style scoped>
.sidebar-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: rgba(10, 14, 23, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid var(--border-glow);
  z-index: 500;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);
}

.sidebar-drawer.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.sidebar-close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: var(--transition-fast);
}

.sidebar-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.sidebar-menu {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
  border: 1px solid transparent;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  border-color: var(--border-glow);
}

.menu-item.active {
  background-color: var(--primary-glow);
  color: var(--text-primary);
  border-color: rgba(79, 70, 229, 0.3);
}

.menu-item svg {
  color: var(--text-muted);
  transition: var(--transition-fast);
}

.menu-item:hover svg,
.menu-item.active svg {
  color: var(--primary-color);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 400;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
