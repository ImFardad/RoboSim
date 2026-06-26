<template>
  <button :type="type" class="auth-btn" :disabled="disabled || isLoading">
    <span v-if="isLoading" class="spinner"></span>
    <span>{{ isLoading ? loadingText : text }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  text: string;
  loadingText?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'submit',
  disabled: false,
  isLoading: false,
  loadingText: 'در حال پردازش...',
});
</script>

<style scoped>
.auth-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--primary-color), hsl(var(--primary-h), var(--primary-s), 42%));
  border: none;
  border-radius: var(--border-radius-sm);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-family);
  transition: var(--transition-smooth);
  box-shadow: 0 4px 12px var(--primary-glow);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-glow);
  filter: brightness(1.1);
}

.auth-btn:active:not(:disabled) {
  transform: translateY(0);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}
</style>
