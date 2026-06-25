<template>
  <div class="profile-row">
    <span>{{ label }}:</span>
    <span :style="valueStyle">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { StyleValue } from 'vue';

interface Props {
  label: string;
  value: string;
  valueStyle?: StyleValue;
}

defineProps<Props>();
</script>
