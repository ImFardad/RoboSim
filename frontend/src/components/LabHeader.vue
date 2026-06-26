<template>
  <header class="lab-nav">
    <div class="nav-left">
      <button @click="$emit('back')" class="back-btn" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>{{ GLOSSARY.backToDashboardBtn }}</span>
      </button>
      <span class="nav-title">{{ GLOSSARY.labTitle }}</span>
    </div>
    <div class="nav-right">
      <button 
        @click="$emit('save')" 
        :disabled="isSaving || isLoading"
        class="save-config-btn"
        type="button"
      >
        <svg v-if="!isSaving" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        <svg v-else class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        <span>{{ isSaving ? GLOSSARY.savingConfigText : GLOSSARY.saveConfigBtn }}</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { GLOSSARY } from '../glossary';

defineProps<{
  isSaving: boolean;
  isLoading: boolean;
}>();

defineEmits<{
  (e: 'back'): void;
  (e: 'save'): void;
}>();
</script>

<style scoped>
.lab-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-glow);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-glow);
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  transform: translateX(-2px);
}

.save-config-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--primary-color) 0%, hsl(var(--primary-h), var(--primary-s), 45%) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.save-config-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--primary-glow);
  filter: brightness(1.1);
}

.save-config-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
