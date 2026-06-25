<template>
  <div v-if="message" :class="['alert', typeClass]">
    <span>{{ icon }} {{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type: 'danger' | 'success';
  message?: string | null;
}

const props = defineProps<Props>();

const typeClass = computed(() => {
  return props.type === 'success' ? 'alert-success' : 'alert-danger';
});

const icon = computed(() => {
  return props.type === 'success' ? '✅' : '⚠️';
});
</script>
