<template>
  <div class="toast-container">
    <TransitionGroup name="toast-slide">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast-item', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../utils/toast';

const { toasts, removeToast } = useToast();

function getIcon(type: string): string {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '⚠️';
    default: return 'ℹ️';
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 380px;
  width: 100%;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: rgba(16, 22, 35, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.toast-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.toast-success::before { background-color: var(--success-color); }
.toast-error::before { background-color: var(--error-color); }
.toast-info::before { background-color: var(--primary-color); }

.toast-success { border: 1px solid rgba(16, 185, 129, 0.15); }
.toast-error { border: 1px solid rgba(239, 68, 68, 0.15); }
.toast-info { border: 1px solid rgba(79, 70, 229, 0.15); }

.toast-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.toast-message {
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  transition: var(--transition-fast);
}

.toast-close:hover {
  color: var(--text-primary);
}

/* Animations */
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
.toast-slide-leave-active {
  position: absolute;
  width: 100%;
}
</style>
