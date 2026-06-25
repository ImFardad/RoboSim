<template>
  <section class="grid-card">
    <h3>
      <span class="card-icon-wrapper" v-if="$slots.icon">
        <slot name="icon" />
      </span>
      <span>{{ title }}</span>
    </h3>
    <p>{{ desc }}</p>
    <button @click="$emit('action')" class="card-action">
      {{ actionText }}
    </button>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  desc: string;
  actionText: string;
}

defineProps<Props>();

defineEmits<{
  (e: 'action'): void;
}>();
</script>

<style scoped>
.card-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  margin-right: 8px;
}
</style>
