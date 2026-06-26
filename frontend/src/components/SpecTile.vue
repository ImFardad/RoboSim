<template>
  <div :class="['spec-tile', { 'span-2': span2 }]">
    <span class="spec-label">{{ label }}</span>
    <span :class="['spec-val', accentClass]">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label: string;
  value: string | number;
  span2?: boolean;
  accent?: 'green' | 'cyan' | 'orange' | '';
}

const props = withDefaults(defineProps<Props>(), {
  span2: false,
  accent: '',
});

const accentClass = computed(() => {
  if (props.accent === 'green') return 'neon-green';
  if (props.accent === 'cyan') return 'neon-cyan';
  if (props.accent === 'orange') return 'neon-orange';
  return '';
});
</script>

<style scoped>
.spec-tile {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-glow);
  border-radius: var(--border-radius-sm);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: var(--transition-fast);
}

.spec-tile:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
}

.spec-tile.span-2 {
  grid-column: span 2;
}

.spec-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-val {
  font-size: 15px;
  font-weight: 700;
  font-family: monospace;
  color: var(--text-primary);
}

.neon-green {
  color: var(--success-color);
  text-shadow: 0 0 6px var(--success-glow);
}

.neon-cyan {
  color: #06b6d4;
  text-shadow: 0 0 6px rgba(6, 182, 212, 0.3);
}

.neon-orange {
  color: #f97316;
  text-shadow: 0 0 6px rgba(249, 115, 22, 0.2);
}
</style>
