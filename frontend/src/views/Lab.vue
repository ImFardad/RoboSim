<template>
  <div class="lab-container">
    <!-- Header -->
    <LabHeader 
      :isSaving="isSaving" 
      :isLoading="isLoading"
      @back="goBack"
      @save="saveConfiguration"
    />

    <!-- Main Grid Content -->
    <div class="lab-grid-layout">
      <!-- Left Panel: 2D Canvas & Simulator Controls -->
      <section class="left-panel">
        <RobotCanvas 
          :bodyLevel="bodyLevel"
          :batteryLevel="batteryLevel"
          :brainLevel="brainLevel"
          :engineLevel="engineLevel"
          :steeringLevel="steeringLevel"
          :targetAngle="targetAngle"
          :simThrottle="simThrottle"
          :steeringRange="steeringRange"
          :steeringSpeed="steeringSpeed"
          :computedBatteryCapacity="computedBatteryCapacity"
          :computedMaxTasks="computedMaxTasks"
          :computedTotalWeight="computedTotalWeight"
          :computedEnginePower="computedEnginePower"
          :computedAcceleration="computedAcceleration"
          :computedTopSpeed="computedTopSpeed"
          v-model:currentAngle="simAngle"
          v-model:currentVelocity="simVelocity"
        />

        <!-- Steering Simulator Slider -->
        <SteeringSimulator 
          v-model="targetAngle"
          :steeringRange="steeringRange"
          :simAngle="simAngle"
          @reset="resetSteering"
        />

        <!-- Propulsion & Motion Simulator Slider -->
        <MotionSimulator 
          v-model="simThrottle"
          :simVelocity="simVelocity"
          :activeSimAcceleration="activeSimAcceleration"
          @reset="resetThrottle"
        />
      </section>

      <!-- Right Panel: Configurations & Consolidated Specs -->
      <section class="right-panel">
        <!-- Configuration Deck -->
        <div class="glass-card configs-card">
          <!-- Body Upgrader -->
          <UpgradeRow
            :title="GLOSSARY.bodyUpgradeTitle"
            :desc="GLOSSARY.bodyUpgradeDesc"
            :level="bodyLevel"
            :maxLevel="5"
            :specText="`HP: <strong>${computedHP.toFixed(2)}</strong> <span class='stat-divider'>|</span> Weight: <strong>${computedBodyWeight.toFixed(2)} kg</strong>`"
            @change-level="changeLevel('body', $event)"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </template>
          </UpgradeRow>

          <!-- Battery Upgrader -->
          <UpgradeRow
            :title="GLOSSARY.batteryUpgradeTitle"
            :desc="GLOSSARY.batteryUpgradeDesc"
            :level="batteryLevel"
            :maxLevel="5"
            :specText="`Capacity: <strong>${computedBatteryCapacity.toLocaleString()} EU</strong> <span class='stat-divider'>|</span> Weight: <strong>${computedBatteryWeight.toFixed(2)} kg</strong>`"
            @change-level="changeLevel('battery', $event)"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                <line x1="22" y1="11" x2="22" y2="13"></line>
              </svg>
            </template>
          </UpgradeRow>

          <!-- Brain Upgrader -->
          <UpgradeRow
            :title="GLOSSARY.brainUpgradeTitle"
            :desc="GLOSSARY.brainUpgradeDesc"
            :level="brainLevel"
            :maxLevel="4"
            :specText="`Concurrent Tasks: <strong>${computedMaxTasks}</strong> <span class='stat-divider'>|</span> Weight: <strong>2.00 kg</strong>`"
            @change-level="changeLevel('brain', $event)"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"></path>
              </svg>
            </template>
          </UpgradeRow>

          <!-- Engine Upgrader -->
          <UpgradeRow
            :title="GLOSSARY.engineUpgradeTitle"
            :desc="GLOSSARY.engineUpgradeDesc"
            :level="engineLevel"
            :maxLevel="5"
            :specText="`Power: <strong>${computedEnginePower.toFixed(2)} N</strong> <span class='stat-divider'>|</span> Weight: <strong>5.00 kg</strong>`"
            @change-level="changeLevel('engine', $event)"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </template>
          </UpgradeRow>

          <!-- Steering Upgrader -->
          <UpgradeRow
            :title="GLOSSARY.steeringUpgradeTitle"
            :desc="GLOSSARY.steeringUpgradeDesc"
            :level="steeringLevel"
            :maxLevel="3"
            :specText="`Steering Range: <strong>±${steeringRange}°</strong> <span class='stat-divider'>|</span> Speed: <strong>${steeringSpeed}°/s</strong>`"
            @change-level="changeLevel('steering', $event)"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                <path d="M2 12h20"></path>
              </svg>
            </template>
          </UpgradeRow>

          <!-- Static Distance Sensors Info -->
          <UpgradeRow
            :title="GLOSSARY.sensorsInfoTitle"
            :desc="GLOSSARY.sensorsInfoDesc"
            isStatic
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </template>
          </UpgradeRow>
        </div>

        <!-- Specifications Summary Table -->
        <SpecsGrid 
          :hp="computedHP"
          :totalWeight="computedTotalWeight"
          :enginePower="computedEnginePower"
          :acceleration="computedAcceleration"
          :topSpeed="computedTopSpeed"
          :maxTasks="computedMaxTasks"
          :steeringRange="steeringRange"
          :steeringSpeed="steeringSpeed"
          :batteryCapacity="computedBatteryCapacity"
          :idleTime="computedIdleTime"
          :formattedMoveTime="formattedMoveTime"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
import { useToast } from '../utils/toast';
import { GLOSSARY } from '../glossary';
import UpgradeRow from '../components/UpgradeRow.vue';
import RobotCanvas from '../components/RobotCanvas.vue';
import LabHeader from '../components/LabHeader.vue';
import SteeringSimulator from '../components/SteeringSimulator.vue';
import MotionSimulator from '../components/MotionSimulator.vue';
import SpecsGrid from '../components/SpecsGrid.vue';

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

// Simulated simulator inputs
const targetAngle = ref(0);
const simAngle = ref(0);
const simThrottle = ref(0);
const simVelocity = ref(0);

// ---------------- Formulas & Computations ----------------

// 1. Durability
const computedHP = computed(() => {
  return 100 * (1 + (bodyLevel.value - 1) * 0.20);
});

// 2. Weights
const computedBodyWeight = computed(() => {
  return 50 * Math.pow(1.10, bodyLevel.value - 1);
});

// 3. Battery Capacity
const computedBatteryWeight = computed(() => {
  return 10 * Math.pow(1.15, batteryLevel.value - 1);
});

const computedTotalWeight = computed(() => {
  return computedBodyWeight.value + computedBatteryWeight.value + 15;
});

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
  if (steeringLevel.value === 1) return 60;
  if (steeringLevel.value === 2) return 70;
  return 80;
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

// Real-time simulated active acceleration (scaled by absolute throttle)
const activeSimAcceleration = computed(() => {
  return computedAcceleration.value * (Math.abs(simThrottle.value) / 100);
});

// 8. Battery Times
const computedIdleTime = computed(() => {
  return (computedBatteryCapacity.value / 20) / 60;
});

const computedMoveTimeSeconds = computed(() => {
  const engineConsumption = 280 * (1 + (engineLevel.value - 1) * 0.05);
  const totalConsumption = 20 + engineConsumption;
  return computedBatteryCapacity.value / totalConsumption;
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

function resetThrottle() {
  simThrottle.value = 0;
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

// ---------------- Lifecycle Hooks ----------------

onMounted(async () => {
  await loadConfiguration();
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

/* ---------------- Config Panel ---------------- */
.configs-card {
  padding: 8px 24px;
}
</style>
