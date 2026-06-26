<template>
  <div class="lab-container">
    <!-- Header -->
    <header class="lab-nav">
      <div class="nav-left">
        <button @click="goBack" class="back-btn" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>{{ GLOSSARY.backToDashboardBtn }}</span>
        </button>
        <span class="nav-title">{{ GLOSSARY.labTitle }}</span>
      </div>
      <div class="nav-right">
        <button 
          @click="saveConfiguration" 
          :disabled="isSaving || isLoading"
          class="save-config-btn"
          type="button"
        >
          <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <svg v-else class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <span>{{ isSaving ? GLOSSARY.savingConfigText : GLOSSARY.saveConfigBtn }}</span>
        </button>
      </div>
    </header>

    <!-- Main Grid Content -->
    <div class="lab-grid-layout">
      <!-- Left Panel: 2D Canvas & Steering Simulator -->
      <section class="left-panel">
        <div class="glass-card canvas-card">
          <div class="canvas-header">
            <div class="status-indicator">
              <span class="pulse-dot"></span>
              <span class="status-text">SYS_LINK_ACTIVE</span>
            </div>
            <div class="direction-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              <span>FRONT</span>
            </div>
          </div>
          
          <div class="canvas-container">
            <canvas ref="robotCanvas" width="400" height="400" class="robot-canvas"></canvas>
          </div>
        </div>

        <!-- Steering Simulator Slider -->
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
              <span class="target-angle-badge">{{ GLOSSARY.steerAngleLabel }} {{ targetAngle }}°</span>
              <span>+{{ steeringRange }}°</span>
            </div>
            <input 
              v-model.number="targetAngle"
              type="range" 
              :min="-steeringRange" 
              :max="steeringRange" 
              step="1"
              class="steer-range-slider"
            />
            <div class="sim-feedback-row">
              <span class="actual-angle-badge">
                {{ GLOSSARY.currentAngleLabel }} <strong class="neon-text">{{ Math.round(currentAngle) }}°</strong>
              </span>
              <button @click="resetSteering" class="reset-steer-btn" type="button">Reset</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Panel: Configurations & Consolidated Specs -->
      <section class="right-panel">
        <!-- Configuration Deck -->
        <div class="glass-card configs-card">
          <!-- Body Upgrader -->
          <div class="component-upgrade-row">
            <div class="comp-info">
              <div class="comp-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <h3>{{ GLOSSARY.bodyUpgradeTitle }}</h3>
              </div>
              <p class="comp-desc">{{ GLOSSARY.bodyUpgradeDesc }}</p>
              <div class="comp-current-stats">
                <span>HP: <strong>{{ computedHP }}</strong></span>
                <span class="stat-divider">|</span>
                <span>Weight: <strong>{{ computedBodyWeight.toFixed(2) }} kg</strong></span>
              </div>
            </div>
            <div class="comp-controls">
              <button @click="changeLevel('body', -1)" :disabled="bodyLevel <= 1" class="lvl-btn" type="button">-</button>
              <div class="level-indicator">
                <span v-for="n in 5" :key="n" :class="['dot', { active: n <= bodyLevel }]"></span>
              </div>
              <button @click="changeLevel('body', 1)" :disabled="bodyLevel >= 5" class="lvl-btn" type="button">+</button>
            </div>
          </div>

          <!-- Battery Upgrader -->
          <div class="component-upgrade-row">
            <div class="comp-info">
              <div class="comp-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                  <line x1="22" y1="11" x2="22" y2="13"></line>
                </svg>
                <h3>{{ GLOSSARY.batteryUpgradeTitle }}</h3>
              </div>
              <p class="comp-desc">{{ GLOSSARY.batteryUpgradeDesc }}</p>
              <div class="comp-current-stats">
                <span>Capacity: <strong>{{ computedBatteryCapacity.toLocaleString() }} EU</strong></span>
                <span class="stat-divider">|</span>
                <span>Weight: <strong>{{ computedBatteryWeight.toFixed(2) }} kg</strong></span>
              </div>
            </div>
            <div class="comp-controls">
              <button @click="changeLevel('battery', -1)" :disabled="batteryLevel <= 1" class="lvl-btn" type="button">-</button>
              <div class="level-indicator">
                <span v-for="n in 5" :key="n" :class="['dot', { active: n <= batteryLevel }]"></span>
              </div>
              <button @click="changeLevel('battery', 1)" :disabled="batteryLevel >= 5" class="lvl-btn" type="button">+</button>
            </div>
          </div>

          <!-- Brain Upgrader -->
          <div class="component-upgrade-row">
            <div class="comp-info">
              <div class="comp-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"></path>
                </svg>
                <h3>{{ GLOSSARY.brainUpgradeTitle }}</h3>
              </div>
              <p class="comp-desc">{{ GLOSSARY.brainUpgradeDesc }}</p>
              <div class="comp-current-stats">
                <span>Concurrent Tasks: <strong>{{ computedMaxTasks }}</strong></span>
                <span class="stat-divider">|</span>
                <span>Weight: <strong>2.00 kg</strong></span>
              </div>
            </div>
            <div class="comp-controls">
              <button @click="changeLevel('brain', -1)" :disabled="brainLevel <= 1" class="lvl-btn" type="button">-</button>
              <div class="level-indicator">
                <span v-for="n in 4" :key="n" :class="['dot', { active: n <= brainLevel }]"></span>
              </div>
              <button @click="changeLevel('brain', 1)" :disabled="brainLevel >= 4" class="lvl-btn" type="button">+</button>
            </div>
          </div>

          <!-- Engine Upgrader -->
          <div class="component-upgrade-row">
            <div class="comp-info">
              <div class="comp-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <h3>{{ GLOSSARY.engineUpgradeTitle }}</h3>
              </div>
              <p class="comp-desc">{{ GLOSSARY.engineUpgradeDesc }}</p>
              <div class="comp-current-stats">
                <span>Power: <strong>{{ computedEnginePower }} N</strong></span>
                <span class="stat-divider">|</span>
                <span>Weight: <strong>5.00 kg</strong></span>
              </div>
            </div>
            <div class="comp-controls">
              <button @click="changeLevel('engine', -1)" :disabled="engineLevel <= 1" class="lvl-btn" type="button">-</button>
              <div class="level-indicator">
                <span v-for="n in 5" :key="n" :class="['dot', { active: n <= engineLevel }]"></span>
              </div>
              <button @click="changeLevel('engine', 1)" :disabled="engineLevel >= 5" class="lvl-btn" type="button">+</button>
            </div>
          </div>

          <!-- Steering Upgrader -->
          <div class="component-upgrade-row">
            <div class="comp-info">
              <div class="comp-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <path d="M2 12h20"></path>
                </svg>
                <h3>{{ GLOSSARY.steeringUpgradeTitle }}</h3>
              </div>
              <p class="comp-desc">{{ GLOSSARY.steeringUpgradeDesc }}</p>
              <div class="comp-current-stats">
                <span>Steering Range: <strong>±{{ steeringRange }}°</strong></span>
                <span class="stat-divider">|</span>
                <span>Speed: <strong>{{ steeringSpeed }}°/s</strong></span>
              </div>
            </div>
            <div class="comp-controls">
              <button @click="changeLevel('steering', -1)" :disabled="steeringLevel <= 1" class="lvl-btn" type="button">-</button>
              <div class="level-indicator">
                <span v-for="n in 3" :key="n" :class="['dot', { active: n <= steeringLevel }]"></span>
              </div>
              <button @click="changeLevel('steering', 1)" :disabled="steeringLevel >= 3" class="lvl-btn" type="button">+</button>
            </div>
          </div>

          <!-- Static Distance Sensors Info -->
          <div class="component-upgrade-row static-row">
            <div class="comp-info">
              <div class="comp-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <h3>{{ GLOSSARY.sensorsInfoTitle }}</h3>
              </div>
              <p class="comp-desc">{{ GLOSSARY.sensorsInfoDesc }}</p>
            </div>
            <div class="comp-controls">
              <div class="static-badge">STATIC</div>
            </div>
          </div>
        </div>

        <!-- Specifications Summary Table -->
        <div class="glass-card specs-card">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            <span>{{ GLOSSARY.specsHeader }}</span>
          </h2>

          <div class="specs-grid">
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.hpStat }}</span>
              <span class="spec-val neon-green">{{ computedHP }} HP</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.weightStat }}</span>
              <span class="spec-val">{{ computedTotalWeight.toFixed(2) }} kg</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.enginePowerStat }}</span>
              <span class="spec-val">{{ computedEnginePower }} N</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.accelStat }}</span>
              <span class="spec-val">{{ computedAcceleration.toFixed(2) }} m/s²</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.speedStat }}</span>
              <span class="spec-val">{{ computedTopSpeed.toFixed(2) }} m/s</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.tasksStat }}</span>
              <span class="spec-val neon-cyan">{{ computedMaxTasks }} Threads</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.steerRangeStat }}</span>
              <span class="spec-val">±{{ steeringRange }}°</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.steerSpeedStat }}</span>
              <span class="spec-val">{{ steeringSpeed }}°/s</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.batteryCapStat }}</span>
              <span class="spec-val">{{ computedBatteryCapacity.toLocaleString() }} EU</span>
            </div>
            <div class="spec-tile">
              <span class="spec-label">{{ GLOSSARY.idleTimeStat }}</span>
              <span class="spec-val neon-cyan">{{ computedIdleTime.toFixed(1) }} Min</span>
            </div>
            <div class="spec-tile span-2">
              <span class="spec-label">{{ GLOSSARY.moveTimeStat }}</span>
              <span class="spec-val neon-orange">{{ formattedMoveTime }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
import { useToast } from '../utils/toast';
import { GLOSSARY } from '../glossary';

const router = useRouter();
const { getAuthHeaders } = useAuth();
const { showSuccess, showError } = useToast();

const API_BASE = 'http://localhost:3000/api';

// Loading and Saving states
const isLoading = ref(true);
const isSaving = ref(false);

// Upgradable Component Levels
const bodyLevel = ref(1);
const batteryLevel = ref(1);
const brainLevel = ref(1);
const engineLevel = ref(1);
const steeringLevel = ref(1);

// Steering Deflection Simulator variables
const targetAngle = ref(0);
const currentAngle = ref(0);

// Canvas Reference
const robotCanvas = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
let lastTime = performance.now();

// ---------------- Formulas & Computations ----------------

// 1. Durability
const computedHP = computed(() => {
  return 100 * (1 + (bodyLevel.value - 1) * 0.20);
});

// 2. Weights
const computedBodyWeight = computed(() => {
  return 50 * Math.pow(1.10, bodyLevel.value - 1);
});

const computedBatteryWeight = computed(() => {
  return 10 * Math.pow(1.15, batteryLevel.value - 1);
});

const computedTotalWeight = computed(() => {
  // W_body + W_battery + W_engine (5) + W_steering (5) + W_brain (2) + W_sensors (3) + W_additional (0)
  return computedBodyWeight.value + computedBatteryWeight.value + 15;
});

// 3. Battery Capacity
const computedBatteryCapacity = computed(() => {
  return 60000 * (1 + (batteryLevel.value - 1) * 0.25);
});

// 4. Brain Concurrent Tasks
const computedMaxTasks = computed(() => {
  return 2 + (brainLevel.value - 1);
});

// 5. Engine Thrust
const computedEnginePower = computed(() => {
  return 100 * (1 + (engineLevel.value - 1) * 0.05);
});

// 6. Steering Limits
const steeringRange = computed(() => {
  if (steeringLevel.value === 1) return 60; // ±60 (120 total)
  if (steeringLevel.value === 2) return 70; // ±70 (140 total)
  return 80; // ±80 (160 total)
});

const steeringSpeed = computed(() => {
  if (steeringLevel.value === 1) return 45;
  if (steeringLevel.value === 2) return 65;
  return 90;
});

// 7. Mobility Specs
const computedAcceleration = computed(() => {
  return computedEnginePower.value / computedTotalWeight.value;
});

const computedTopSpeed = computed(() => {
  return computedEnginePower.value / (computedTotalWeight.value * 0.3);
});

// 8. Battery Times
const computedIdleTime = computed(() => {
  // Capacity / 20 EU/s = idle duration in seconds
  return (computedBatteryCapacity.value / 20) / 60; // in minutes
});

const computedMoveTimeSeconds = computed(() => {
  // Engine power rate at 100% throttle = 280 * (1 + (engineLevel - 1) * 0.05)
  const engineConsumption = 280 * (1 + (engineLevel.value - 1) * 0.05);
  const totalConsumption = 20 + engineConsumption; // 20 EU/s idle consumption + engine
  return computedBatteryCapacity.value / totalConsumption; // in seconds
});

const formattedMoveTime = computed(() => {
  const totalSecs = computedMoveTimeSeconds.value;
  const mins = Math.floor(totalSecs / 60);
  const secs = Math.round(totalSecs % 60);
  return `${mins}m ${secs}s (at 100% throttle)`;
});

// ---------------- Methods & API Handlers ----------------

function goBack() {
  router.push('/dashboard');
}

function resetSteering() {
  targetAngle.value = 0;
}

function changeLevel(component: string, delta: number) {
  if (component === 'body') {
    const next = bodyLevel.value + delta;
    if (next >= 1 && next <= 5) bodyLevel.value = next;
  } else if (component === 'battery') {
    const next = batteryLevel.value + delta;
    if (next >= 1 && next <= 5) batteryLevel.value = next;
  } else if (component === 'brain') {
    const next = brainLevel.value + delta;
    if (next >= 1 && next <= 4) brainLevel.value = next;
  } else if (component === 'engine') {
    const next = engineLevel.value + delta;
    if (next >= 1 && next <= 5) engineLevel.value = next;
  } else if (component === 'steering') {
    const next = steeringLevel.value + delta;
    if (next >= 1 && next <= 3) {
      steeringLevel.value = next;
      // Clamp simulated steering slider if bounds decreased
      const maxRange = steeringRange.value;
      if (Math.abs(targetAngle.value) > maxRange) {
        targetAngle.value = Math.sign(targetAngle.value) * maxRange;
      }
    }
  }
}

async function loadConfiguration() {
  isLoading.value = true;
  try {
    const res = await fetch(`${API_BASE}/robot`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    if (res.ok && data.robot) {
      bodyLevel.value = data.robot.bodyLevel;
      batteryLevel.value = data.robot.batteryLevel;
      brainLevel.value = data.robot.brainLevel;
      engineLevel.value = data.robot.engineLevel;
      steeringLevel.value = data.robot.steeringLevel;
    } else {
      showError(data.error || GLOSSARY.loadErrorToast);
    }
  } catch (err) {
    console.error('Failed to load robot config:', err);
    showError(GLOSSARY.loadErrorToast);
  } finally {
    isLoading.value = false;
  }
}

async function saveConfiguration() {
  if (isSaving.value) return;
  isSaving.value = true;

  try {
    const res = await fetch(`${API_BASE}/robot`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        bodyLevel: bodyLevel.value,
        batteryLevel: batteryLevel.value,
        brainLevel: brainLevel.value,
        engineLevel: engineLevel.value,
        steeringLevel: steeringLevel.value,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      showSuccess(data.message || GLOSSARY.saveSuccessToast);
    } else {
      showError(data.error || GLOSSARY.saveErrorToast);
    }
  } catch (err) {
    console.error('Failed to save robot config:', err);
    showError(GLOSSARY.saveErrorToast);
  } finally {
    isSaving.value = false;
  }
}

// ---------------- Canvas Animation Loop ----------------

function drawRobot(ctx: CanvasRenderingContext2D) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Clear Canvas
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Blueprint Tech Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSpacing = 20;
  for (let x = 0; x < width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw grid crosshairs in center
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // Faint blueprint circles
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 120, 0, Math.PI * 2);
  ctx.arc(width / 2, height / 2, 175, 0, Math.PI * 2);
  ctx.stroke();

  // Draw arrow indicating front
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('▲ FRONT DIRECTION', width / 2, 25);

  const cx = width / 2;
  const cy = height / 2;

  // 2. Draw Rear Wheels (Engine Power)
  // Left: center (cx - 95, cy + 30) -> (105, 230)
  // Right: center (cx + 95, cy + 30) -> (295, 230)
  const wheelW = 22;
  const wheelH = 46;
  const rearY = cy + 32;
  const rWheelsX = [cx - 90, cx + 90];

  rWheelsX.forEach((wheelCx) => {
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;

    // Outer Tyre rectangle
    ctx.beginPath();
    ctx.rect(wheelCx - wheelW / 2, rearY - wheelH / 2, wheelW, wheelH);
    ctx.fill();
    ctx.stroke();

    // Tread markings based on Engine Level
    if (engineLevel.value >= 3) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      for (let offset = -18; offset <= 18; offset += 9) {
        ctx.beginPath();
        ctx.moveTo(wheelCx - wheelW / 2, rearY + offset);
        ctx.lineTo(wheelCx + wheelW / 2, rearY + offset);
        ctx.stroke();
      }
    }

    // Engine gear cap if Level 5
    if (engineLevel.value === 5) {
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(wheelCx, rearY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 3. Draw Chassis (Body)
  // Square centered at (cx, cy) -> 160 x 160
  const bodySize = 150;
  ctx.save();
  ctx.translate(cx, cy);

  // Gradient based on level
  const bodyGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, bodySize / 2);
  if (bodyLevel.value <= 2) {
    bodyGrad.addColorStop(0, '#1e293b');
    bodyGrad.addColorStop(1, '#0f172a');
  } else {
    bodyGrad.addColorStop(0, '#0f172a');
    bodyGrad.addColorStop(1, '#020617');
  }

  // Draw Rounded Chassis Base
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = bodyLevel.value === 5 ? '#06b6d4' : 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = bodyLevel.value >= 4 ? 3 : 2;

  ctx.beginPath();
  const radius = 16;
  ctx.roundRect(-bodySize / 2, -bodySize / 2, bodySize, bodySize, radius);
  ctx.fill();
  ctx.stroke();

  // Level-specific Chassis plating details
  if (bodyLevel.value >= 2) {
    // Inner frame detail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-bodySize / 2 + 10, -bodySize / 2 + 10, bodySize - 20, bodySize - 20, radius - 4);
    ctx.stroke();
  }

  if (bodyLevel.value >= 3) {
    // Corner reinforcement plates
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    const capSize = 18;
    ctx.fillRect(-bodySize / 2, -bodySize / 2, capSize, capSize);
    ctx.fillRect(bodySize / 2 - capSize, -bodySize / 2, capSize, capSize);
    ctx.fillRect(-bodySize / 2, bodySize / 2 - capSize, capSize, capSize);
    ctx.fillRect(bodySize / 2 - capSize, bodySize / 2 - capSize, capSize, capSize);
  }

  if (bodyLevel.value >= 4) {
    // Carbon fiber armor texture stripes
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
    ctx.lineWidth = 4;
    for (let offset = -bodySize; offset < bodySize; offset += 16) {
      ctx.beginPath();
      ctx.moveTo(offset, -bodySize / 2);
      ctx.lineTo(offset + bodySize, bodySize / 2);
      ctx.stroke();
    }
  }

  if (bodyLevel.value === 5) {
    // Neon glow line inside
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-bodySize / 2 + 6, -bodySize / 2 + 6, bodySize - 12, bodySize - 12, radius - 2);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow
  }

  ctx.restore();

  // 4. Draw Front Wheels (Steering) - Rotated by currentAngle
  // Left: center (cx - 90, cy - 32) -> (110, 168)
  // Right: center (cx + 90, cy - 32) -> (290, 168)
  const frontY = cy - 32;
  const fWheelsX = [cx - 90, cx + 90];

  fWheelsX.forEach((wheelCx) => {
    ctx.save();
    ctx.translate(wheelCx, frontY);
    ctx.rotate((currentAngle.value * Math.PI) / 180);

    // Wheel outline
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.rect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
    ctx.fill();
    ctx.stroke();

    // Wheel tread lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let offset = -14; offset <= 14; offset += 7) {
      ctx.beginPath();
      ctx.moveTo(-wheelW / 2, offset);
      ctx.lineTo(wheelW / 2, offset);
      ctx.stroke();
    }

    // Steering servo detail
    if (steeringLevel.value >= 2) {
      ctx.fillStyle = '#475569';
      ctx.fillRect(-4, -wheelH / 2 + 4, 8, wheelH - 8);
    }
    if (steeringLevel.value === 3) {
      // Glowing neon spinner hubcap
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });

  // 5. Draw Brain Processor (Centered, Pulsing core)
  // Core circle radius 22px
  const brainRadius = 22;
  ctx.save();
  ctx.translate(cx, cy);

  // Circuit connections (tracks extending to chassis edges)
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  const pulseIntensity = 0.4 + 0.4 * Math.sin(performance.now() / 200);

  // Connection line drawing function
  const drawTrack = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Glowing dot traveling on line
    const t = (performance.now() % 1200) / 1200;
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;
    ctx.fillStyle = `rgba(6, 182, 212, ${pulseIntensity})`;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  // Level 1: 2 paths (Up and Down)
  if (brainLevel.value >= 1) {
    drawTrack(0, -brainRadius, 0, -bodySize / 2 + 10);
    drawTrack(0, brainRadius, 0, bodySize / 2 - 10);
  }
  // Level 2: +1 path (3 total)
  if (brainLevel.value >= 2) {
    drawTrack(brainRadius * 0.8, -brainRadius * 0.6, bodySize / 2 - 10, -bodySize / 2 + 10);
  }
  // Level 3: +1 path (4 total)
  if (brainLevel.value >= 3) {
    drawTrack(-brainRadius, 0, -bodySize / 2 + 10, 0);
  }
  // Level 4: +1 path (5 total) + circular neon bus tracks
  if (brainLevel.value >= 4) {
    drawTrack(brainRadius, 0, bodySize / 2 - 10, 0);
    
    // Outer processor bus ring
    ctx.strokeStyle = `rgba(6, 182, 212, ${pulseIntensity * 0.3})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, brainRadius + 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Microprocessor Square Chip body
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-20, -20, 40, 40, 4);
  ctx.fill();
  ctx.stroke();

  // Central glowing core
  ctx.fillStyle = `rgba(6, 182, 212, ${0.4 + pulseIntensity * 0.4})`;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0; // reset shadow

  ctx.restore();

  // 6. Draw HUD overlays
  ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.font = '9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`SYS_STEER: ${Math.round(currentAngle.value)} DEG`, 15, height - 25);
  ctx.fillText(`SYS_BODY_LVL: ${bodyLevel.value}`, 15, height - 12);
  ctx.textAlign = 'right';
  ctx.fillText(`BAT_CAP: ${computedBatteryCapacity.value} EU`, width - 15, height - 25);
  ctx.fillText(`THR_MAX: ${computedMaxTasks} LNK`, width - 15, height - 12);
}

function updateSteeringSimulation(dt: number) {
  const diff = targetAngle.value - currentAngle.value;
  const speed = steeringSpeed.value; // degrees per second
  if (Math.abs(diff) > 0.05) {
    const step = Math.sign(diff) * speed * dt;
    if (Math.abs(step) >= Math.abs(diff)) {
      currentAngle.value = targetAngle.value;
    } else {
      currentAngle.value += step;
    }
  }
}

function renderLoop() {
  const now = performance.now();
  const dt = (now - lastTime) / 1000; // delta time in seconds
  lastTime = now;

  if (robotCanvas.value) {
    const ctx = robotCanvas.value.getContext('2d');
    if (ctx) {
      updateSteeringSimulation(dt);
      drawRobot(ctx);
    }
  }

  animationFrameId = requestAnimationFrame(renderLoop);
}

// ---------------- Lifecycle Hooks ----------------

onMounted(async () => {
  await loadConfiguration();
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
/* ---------------- Main Layout ---------------- */
.lab-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 24px;
  background-color: var(--bg-color);
  color: var(--text-primary);
}

.lab-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-glow);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-glow);
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  transform: translateX(-2px);
}

.save-config-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--primary-color) 0%, hsl(var(--primary-h), var(--primary-s), 45%) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.save-config-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--primary-glow);
  filter: brightness(1.1);
}

.save-config-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ---------------- Grid Structure ---------------- */
.lab-grid-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 24px;
  flex-grow: 1;
}

@media (max-width: 1024px) {
  .lab-grid-layout {
    grid-template-columns: 1fr;
  }
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ---------------- Canvas Panel ---------------- */
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

.robot-canvas {
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 400px;
  display: block;
}

/* ---------------- Steering Simulator Panel ---------------- */
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

/* ---------------- Config Panel ---------------- */
.configs-card {
  padding: 8px 24px;
}

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

.comp-title-row h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.comp-title-row svg {
  color: var(--primary-color);
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

.comp-current-stats strong {
  color: var(--text-secondary);
}

.stat-divider {
  color: rgba(255, 255, 255, 0.05);
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

/* ---------------- Specifications Summary ---------------- */
.specs-card {
  padding: 24px;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 480px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
  .specs-grid .span-2 {
    grid-column: span 1 !important;
  }
}

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

/* Neon accent overrides */
.neon-text {
  color: #06b6d4;
  text-shadow: 0 0 6px rgba(6, 182, 212, 0.3);
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
