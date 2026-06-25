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
