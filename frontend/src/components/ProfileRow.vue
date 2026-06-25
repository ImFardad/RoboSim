<template>
  <div class="profile-row">
    <span>{{ label }}:</span>
    <span :style="valueStyle">{{ value || '' }}</span>
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue';

interface Props {
  label: string;
  value?: string | null;
  valueStyle?: StyleValue;
}

withDefaults(defineProps<Props>(), {
  value: '',
});
</script>
