<template>
  <div :class="['component-upgrade-row', { 'static-row': isStatic }]">
    <div class="comp-info">
      <div class="comp-title-row">
        <!-- Slot for SVG Icon -->
        <slot name="icon" />
        <h3>{{ title }}</h3>
      </div>
      <p class="comp-desc">{{ desc }}</p>
      <div v-if="specText" class="comp-current-stats">
        <span v-html="specText"></span>
      </div>
    </div>
    <div class="comp-controls">
      <template v-if="!isStatic">
        <button 
          @click="$emit('change-level', -1)" 
          :disabled="level <= 1" 
          class="lvl-btn" 
          type="button"
          aria-label="Decrease level"
        >
          -
        </button>
        <div class="level-indicator">
          <span 
            v-for="n in maxLevel" 
            :key="n" 
            :class="['dot', { active: n <= level }]"
          ></span>
        </div>
        <button 
          @click="$emit('change-level', 1)" 
          :disabled="level >= maxLevel" 
          class="lvl-btn" 
          type="button"
          aria-label="Increase level"
        >
          +
        </button>
      </template>
      <div v-else class="static-badge">
        STATIC
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  desc: string;
  level?: number;
  maxLevel?: number;
  specText?: string;
  isStatic?: boolean;
}

withDefaults(defineProps<Props>(), {
  level: 1,
  maxLevel: 5,
  specText: '',
  isStatic: false,
});

defineEmits<{
  (e: 'change-level', delta: number): void;
}>();
</script>

<style scoped>
.component-upgrade-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-glow);
  gap: 20px;
}

.component-upgrade-row:last-child {
  border-bottom: none;
}

.comp-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.comp-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comp-title-row :deep(svg) {
  color: var(--primary-color);
  flex-shrink: 0;
}

.comp-title-row h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.comp-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.comp-current-stats {
  font-family: monospace;
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  gap: 8px;
}

.comp-current-stats :deep(strong) {
  color: var(--text-secondary);
}

.comp-current-stats :deep(.stat-divider) {
  color: rgba(255, 255, 255, 0.05);
  margin: 0 4px;
}

.comp-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.lvl-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border-glow);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-fast);
}

.lvl-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--border-focus);
}

.lvl-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.level-indicator {
  display: flex;
  gap: 4px;
}

.level-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: var(--transition-fast);
}

.level-indicator .dot.active {
  background: var(--primary-color);
  box-shadow: 0 0 6px var(--primary-glow);
  border-color: transparent;
}

.static-badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-glow);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  font-family: monospace;
  padding: 4px 10px;
  border-radius: 4px;
}
</style>
