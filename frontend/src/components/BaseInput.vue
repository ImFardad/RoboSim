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
