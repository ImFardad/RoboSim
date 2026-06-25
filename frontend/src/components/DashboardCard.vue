<template>
  <section class="grid-card">
    <h3>{{ title }}</h3>
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
