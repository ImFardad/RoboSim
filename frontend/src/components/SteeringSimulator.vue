<template>
  <div class="glass-card simulator-card">
    <h2 class="section-title">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m16.2 7.8-8.4 8.4M12 2v2M12 20v2M20 12h-2M4 12H2"></path>
      </svg>
      <span>{{ GLOSSARY.simulatorTitle }}</span>
    </h2>
    <p class="section-desc">{{ GLOSSARY.simulatorDesc }}</p>

    <div class="slider-group">
      <div class="slider-labels">
        <span>-{{ steeringRange }}°</span>
        <span class="target-angle-badge">{{ GLOSSARY.steerAngleLabel }} {{ modelValue }}°</span>
        <span>+{{ steeringRange }}°</span>
      </div>
      <input 
        :value="modelValue"
        @input="onInput"
        type="range" 
        :min="-steeringRange" 
        :max="steeringRange" 
        step="1"
        class="steer-range-slider"
      />
      <div class="sim-feedback-row">
        <span class="actual-angle-badge">
          {{ GLOSSARY.currentAngleLabel }} <strong class="neon-text">{{ Math.round(simAngle) }}°</strong>
        </span>
        <button @click="$emit('reset')" class="reset-steer-btn" type="button">Reset</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GLOSSARY } from '../glossary';

const props = defineProps<{
  modelValue: number;
  steeringRange: number;
  simAngle: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'reset'): void;
}>();

function onInput(event: Event) {
  const val = Number((event.target as HTMLInputElement).value);
  emit('update:modelValue', val);
}
</script>

<style scoped>
.simulator-card {
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}

.section-title svg {
  color: var(--primary-color);
}

.section-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.5;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-family: monospace;
  font-size: 12px;
  color: var(--text-muted);
  align-items: center;
}

.target-angle-badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-glow);
  padding: 4px 10px;
  border-radius: 4px;
  color: var(--text-primary);
  font-weight: 600;
}

.steer-range-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.steer-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  box-shadow: 0 0 8px var(--primary-glow);
  border: 2px solid #fff;
  transition: 0.1s;
}

.steer-range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.sim-feedback-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.actual-angle-badge {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

.reset-steer-btn {
  background: transparent;
  border: none;
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
}

.reset-steer-btn:hover {
  text-decoration: underline;
}

.neon-text {
  color: #06b6d4;
  text-shadow: 0 0 6px rgba(6, 182, 212, 0.3);
}
</style>
