<template>
  <div class="form-group">
    <label v-if="label" class="form-label" :for="id">{{ label }}</label>
    <div class="input-container">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="onInput"
        class="auth-input"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
      />
    </div>
    <span v-if="errorMsg" style="color: var(--error-color); font-size: 0.8rem; margin-top: 4px;">
      {{ errorMsg }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  label?: string;
  type?: string;
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errorMsg?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-input {
  width: 100%;
  padding: 14px 16px;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-glow);
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: var(--font-family);
  transition: var(--transition-fast);
}

.auth-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--primary-glow);
  background-color: rgba(0, 0, 0, 0.35);
}
</style>
