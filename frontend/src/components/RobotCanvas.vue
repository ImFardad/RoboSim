<template>
  <div class="glass-card canvas-card">
    <div class="canvas-header">
      <div class="status-indicator">
        <span class="pulse-dot"></span>
        <span class="status-text">SYS_LINK_ACTIVE</span>
      </div>
      <div class="direction-indicator">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
        <span>FRONT</span>
      </div>
    </div>
    
    <div class="canvas-container">
      <RobotGraphic 
        :bodyLevel="bodyLevel"
        :brainLevel="brainLevel"
        :engineLevel="engineLevel"
        :steeringLevel="steeringLevel"
        :steeringAngle="currentAngle"
        :wheelOffset="wheelOffset"
        :computedBatteryCapacity="computedBatteryCapacity"
        :computedMaxTasks="computedMaxTasks"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import RobotGraphic from './RobotGraphic.vue';

interface Props {
  bodyLevel: number;
  batteryLevel: number;
  brainLevel: number;
  engineLevel: number;
  steeringLevel: number;
  targetAngle: number;
  simThrottle: number;
  steeringRange: number;
  steeringSpeed: number;
  computedBatteryCapacity: number;
  computedMaxTasks: number;
  computedTotalWeight: number;
  computedEnginePower: number;
  computedAcceleration: number;
  computedTopSpeed: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:currentAngle', val: number): void;
  (e: 'update:currentVelocity', val: number): void;
}>();

let animationFrameId: number | null = null;
let lastTime = performance.now();

// Simulated internal states
const currentAngle = ref(0);
const simVelocity = ref(0);
const wheelOffset = ref(0);

// Reset simulated states if levels change
watch(() => props.steeringLevel, () => {
  currentAngle.value = 0;
  emit('update:currentAngle', 0);
});

function updateSimulationPhysics(dt: number) {
  // 1. Steering Transition
  const diffAngle = props.targetAngle - currentAngle.value;
  const speed = props.steeringSpeed; // degrees per second
  if (Math.abs(diffAngle) > 0.05) {
    const step = Math.sign(diffAngle) * speed * dt;
    if (Math.abs(step) >= Math.abs(diffAngle)) {
      currentAngle.value = props.targetAngle;
    } else {
      currentAngle.value += step;
    }
    emit('update:currentAngle', currentAngle.value);
  }

  // 2. Velocity & Rolling Treads Animation
  const targetVelocity = props.computedTopSpeed * (props.simThrottle / 100);
  const accel = props.computedAcceleration; // m/s²
  const diffVel = targetVelocity - simVelocity.value;

  if (Math.abs(diffVel) > 0.01) {
    const step = Math.sign(diffVel) * accel * dt;
    if (Math.abs(step) >= Math.abs(diffVel)) {
      simVelocity.value = targetVelocity;
    } else {
      simVelocity.value += step;
    }
    emit('update:currentVelocity', simVelocity.value);
  }

  // Wheel roll offset update
  wheelOffset.value = (wheelOffset.value - simVelocity.value * dt * 50);
}

function renderLoop() {
  const now = performance.now();
  const dt = (now - lastTime) / 1000; // delta time in seconds
  lastTime = now;

  updateSimulationPhysics(dt);

  animationFrameId = requestAnimationFrame(renderLoop);
}

// ---------------- Lifecycle Hooks ----------------

onMounted(() => {
  lastTime = performance.now();
  renderLoop();
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.canvas-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.canvas-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: #06b6d4;
  border-radius: 50%;
  box-shadow: 0 0 8px #06b6d4;
  animation: dotPulse 1.5s infinite ease-in-out;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.status-text {
  font-family: monospace;
  font-size: 11px;
  color: #06b6d4;
}

.direction-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: monospace;
  font-size: 11px;
  color: var(--text-muted);
}

.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-md);
  padding: 10px;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1;
}
</style>
