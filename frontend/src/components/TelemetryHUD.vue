<template>
  <div 
    class="telemetry-hud glass-card" 
    :style="{ transform: `translate(${posX}px, ${posY}px)` }"
  >
    <!-- Header serving as drag handle -->
    <div 
      class="hud-header" 
      @pointerdown="startDrag"
      @pointermove="onDrag"
      @pointerup="stopDrag"
    >
      <div class="hud-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
        </svg>
        <span>Telemetry HUD</span>
      </div>
      <button @click="$emit('close')" class="hud-close-btn" type="button" aria-label="Close HUD">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Telemetry Stats Content -->
    <div class="hud-content">
      <!-- HP Integrity Bar -->
      <div class="hud-metric">
        <div class="metric-info">
          <span class="label">Chassis Integrity</span>
          <span class="value">{{ Math.round(hp) }} / {{ Math.round(maxHP) }} HP</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar hp" :style="{ width: (hp / maxHP * 100) + '%' }"></div>
        </div>
      </div>

      <!-- Battery Energy Bar -->
      <div class="hud-metric">
        <div class="metric-info">
          <span class="label">Power Reserve</span>
          <span class="value">{{ Math.round(battery) }} / {{ Math.round(maxBattery) }} EU</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar battery" :style="{ width: (battery / maxBattery * 100) + '%' }"></div>
        </div>
      </div>

      <!-- Dynamic physical readings (Metric units) -->
      <div class="hud-grid">
        <div class="hud-grid-item">
          <span class="label">Velocity</span>
          <span class="value text-cyan">{{ (Math.abs(speed) / 40).toFixed(2) }} m/s</span>
        </div>
        <div class="hud-grid-item">
          <span class="label">Acceleration</span>
          <span class="value text-cyan">{{ (accel / 40).toFixed(2) }} m/s²</span>
        </div>
        <div class="hud-grid-item">
          <span class="label">Steering angle</span>
          <span class="value text-cyan">{{ Math.round(steeringAngle) }}°</span>
        </div>
      </div>

      <!-- Orthogonal Raycast distances -->
      <div class="hud-scanners">
        <span class="section-label">Orthogonal Scanners</span>
        <div class="scanner-row">
          <div class="scanner-item">
            <span class="direction">FRONT</span>
            <span class="dist">{{ (wallDistance.front / 40).toFixed(1) }} m</span>
          </div>
          <div class="scanner-item">
            <span class="direction">BACK</span>
            <span class="dist">{{ (wallDistance.back / 40).toFixed(1) }} m</span>
          </div>
        </div>
        <div class="scanner-row">
          <div class="scanner-item">
            <span class="direction">LEFT</span>
            <span class="dist">{{ (wallDistance.left / 40).toFixed(1) }} m</span>
          </div>
          <div class="scanner-item">
            <span class="direction">RIGHT</span>
            <span class="dist">{{ (wallDistance.right / 40).toFixed(1) }} m</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  hp: number;
  maxHP: number;
  battery: number;
  maxBattery: number;
  speed: number;
  accel: number;
  steeringAngle: number;
  wallDistance: {
    front: number;
    back: number;
    left: number;
    right: number;
  };
}

defineProps<Props>();
defineEmits<{
  (e: 'close'): void;
}>();

// Dragging position state
const posX = ref(30);
const posY = ref(30);

let isDragging = false;
let startX = 0;
let startY = 0;
let startPosX = 0;
let startPosY = 0;

function startDrag(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement;
  el.setPointerCapture(e.pointerId);
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  startPosX = posX.value;
  startPosY = posY.value;
}

function onDrag(e: PointerEvent) {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  // Update coords (clamp within viewport limits roughly)
  posX.value = startPosX + dx;
  posY.value = startPosY + dy;
}

function stopDrag(e: PointerEvent) {
  if (!isDragging) return;
  const el = e.currentTarget as HTMLElement;
  el.releasePointerCapture(e.pointerId);
  isDragging = false;
}
</script>

<style scoped>
.telemetry-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  z-index: 200;
  cursor: default;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  user-select: none;
  touch-action: none;
}

.hud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: grab;
}

.hud-header:active {
  cursor: grabbing;
}

.hud-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-primary);
}

.hud-title svg {
  color: #06b6d4;
}

.hud-close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: var(--transition-fast);
}

.hud-close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.hud-content {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hud-metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.metric-info .label {
  color: var(--text-secondary);
}

.metric-info .value {
  font-family: monospace;
  font-weight: 700;
}

.progress-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
}

.progress-bar.hp {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.progress-bar.battery {
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
}

.hud-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding: 10px 0;
}

.hud-grid-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
}

.hud-grid-item .label {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.hud-grid-item .value {
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
}

.text-cyan {
  color: #06b6d4;
}

.hud-scanners {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.scanner-row {
  display: flex;
  gap: 8px;
}

.scanner-item {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  padding: 4px 8px;
  font-family: monospace;
}

.scanner-item .direction {
  font-size: 0.6rem;
  color: var(--text-muted);
}

.scanner-item .dist {
  font-size: 0.7rem;
  font-weight: 700;
  color: #06b6d4;
}
</style>
