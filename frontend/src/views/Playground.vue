<template>
  <div class="playground-container">
    <!-- Navbar -->
    <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

    <!-- Sidebar Left Navigation -->
    <AppSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" activeMenu="playground" />

    <!-- Main Workspace -->
    <main class="playground-content" v-if="user">
      <div class="playground-header">
        <h1>{{ GLOSSARY.playgroundTitle }}</h1>
        <p>{{ GLOSSARY.playgroundSubtitle }}</p>
      </div>

      <!-- Main Columns -->
      <div class="playground-grid" v-if="!isLoadingRobot">
        
        <!-- Left Side: Simulation Canvas & Controls -->
        <div class="sim-panel glass-card">
          <PlaygroundCanvas 
            :state="simState" 
            :levels="robotLevels" 
            :sensors="sensorData" 
          />

          <!-- Live Robot Status Bar -->
          <div class="robot-hud">
            <div class="hud-item">
              <span class="hud-label">HP:</span>
              <div class="hud-bar-bg">
                <div 
                  class="hud-bar-fill hp-fill" 
                  :style="{ width: (simState.hp / maxHP * 100) + '%' }"
                ></div>
              </div>
              <span class="hud-value">{{ Math.round(simState.hp) }} / {{ Math.round(maxHP) }}</span>
            </div>

            <div class="hud-item">
              <span class="hud-label">Energy:</span>
              <div class="hud-bar-bg">
                <div 
                  class="hud-bar-fill battery-fill" 
                  :style="{ width: (simState.battery / maxBattery * 100) + '%' }"
                ></div>
              </div>
              <span class="hud-value">{{ Math.round(simState.battery) }} / {{ Math.round(maxBattery) }} EU</span>
            </div>

            <div class="hud-row-grid">
              <div class="hud-sub-item">
                <span class="hud-label">Speed:</span>
                <span class="hud-value text-cyan">{{ Math.round(Math.abs(simState.speed)) }} px/s</span>
              </div>
              <div class="hud-sub-item">
                <span class="hud-label">Accel:</span>
                <span class="hud-value text-cyan">{{ Math.round(activeAccel) }} px/s²</span>
              </div>
              <div class="hud-sub-item">
                <span class="hud-label">Steer:</span>
                <span class="hud-value text-cyan">{{ Math.round(simState.steeringAngle) }}°</span>
              </div>
            </div>
          </div>

          <!-- Controls panel -->
          <div class="sim-controls">
            <div class="control-buttons">
              <button 
                v-if="!isSimRunning" 
                @click="startSimulation" 
                class="btn btn-primary"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>{{ GLOSSARY.runSimBtn }}</span>
              </button>

              <button 
                v-else 
                @click="pauseSimulation" 
                class="btn btn-warning"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                <span>{{ GLOSSARY.stopSimBtn }}</span>
              </button>

              <button 
                @click="resetSimulation" 
                class="btn btn-secondary"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                </svg>
                <span>{{ GLOSSARY.resetSimBtn }}</span>
              </button>
            </div>

            <!-- Simulation Speed multiplier -->
            <div class="speed-selector">
              <span class="speed-label">Simulation Speed:</span>
              <div class="speed-btn-group">
                <button 
                  v-for="multiplier in [1, 2, 4]" 
                  :key="multiplier"
                  :class="['speed-btn', { active: simSpeed === multiplier }]"
                  @click="simSpeed = multiplier"
                  type="button"
                >
                  {{ multiplier }}x
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Code Editor, Logs & Collapsible Documentation -->
        <div class="editor-panel">
          
          <!-- Collapsible API Documentation Drawer -->
          <div class="docs-section glass-card" :class="{ collapsed: isDocsCollapsed }">
            <div class="docs-header" @click="isDocsCollapsed = !isDocsCollapsed">
              <div class="docs-header-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>{{ GLOSSARY.docsTitle }}</span>
              </div>
              <svg 
                class="arrow-icon" 
                :class="{ rotated: !isDocsCollapsed }"
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            <div class="docs-content" v-show="!isDocsCollapsed">
                <div class="docs-group">
                  <h4 class="text-cyan">{{ GLOSSARY.docsSensorsDesc }}</h4>
                  <ul class="docs-list">
                    <li><code>sensors.x</code> , <code>sensors.y</code> : Robot position coordinates inside the virtual arena (0 to 1000).</li>
                    <li><code>sensors.speed</code> : Current linear velocity (pixels/second).</li>
                    <li><code>sensors.heading</code> : Robot orientation angle (0 to 360 degrees. 270 is facing North).</li>
                    <li><code>sensors.steeringAngle</code> : Current front wheel deflection angle (degrees).</li>
                    <li><code>sensors.hp</code> : Robot chassis structural integrity (HP).</li>
                    <li><code>sensors.battery</code> : Remaining electrical power capacity (EU).</li>
                    <li><code>sensors.wallDistance.front</code> : Raycast distance from front to the closest boundary wall.</li>
                    <li><code>sensors.wallDistance.back</code> : Raycast distance from back to the wall.</li>
                    <li><code>sensors.wallDistance.left</code> : Raycast distance from left to the wall.</li>
                    <li><code>sensors.wallDistance.right</code> : Raycast distance from right to the wall.</li>
                  </ul>
                </div>

                <div class="docs-group">
                  <h4 class="text-cyan">{{ GLOSSARY.docsActionsDesc }}</h4>
                  <ul class="docs-list">
                    <li><code>throttle</code> : Engine drive throttle force (from <code>-1.0</code> full reverse to <code>+1.0</code> full forward).</li>
                    <li><code>targetSteering</code> : Desired steering deflection angle in degrees (clamped to your maximum wheel deflection bounds).</li>
                  </ul>
                </div>
              </div>
          </div>

          <!-- Code Editor Wrapper -->
          <div class="editor-section glass-card">
            <div class="editor-toolbar">
              <h3>{{ GLOSSARY.editorTitle }}</h3>
              <span class="editor-hint">TypeScript/JavaScript</span>
            </div>

            <!-- Custom Editor with Line Numbers -->
            <div class="code-editor-container">
              <div class="line-numbers" ref="lineNumbersRef">
                <div v-for="n in lineCount" :key="n" class="line-number">{{ n }}</div>
              </div>
              <textarea 
                v-model="userCode" 
                @scroll="syncScroll"
                @keydown.tab.prevent="insertTab"
                class="code-textarea"
                ref="textareaRef"
                spellcheck="false"
                autocomplete="off"
              ></textarea>
            </div>
          </div>

          <!-- Local Console log Area -->
          <div class="console-section glass-card">
            <div class="console-header">
              <h3>{{ GLOSSARY.consoleTitle }}</h3>
              <button @click="clearLogs" class="clear-btn" type="button">Clear Console</button>
            </div>

            <div class="console-logs" ref="consoleRef">
              <div v-if="consoleLogs.length === 0" class="console-placeholder">
                {{ GLOSSARY.consolePlaceholder }}
              </div>
              <div 
                v-for="(log, idx) in consoleLogs" 
                :key="idx" 
                :class="['console-line', log.type]"
              >
                <span class="log-time">[{{ log.time }}]</span>
                <span class="log-text">{{ log.text }}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Loading skeleton -->
      <div v-else class="loading-container glass-card">
        <div class="spinner"></div>
        <p>Booting processor algorithms and downloading robot telemetry...</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAuth } from '../utils/auth';
import { authFetch } from '../utils/auth';
import { GLOSSARY } from '../glossary';
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';
import PlaygroundCanvas from '../components/PlaygroundCanvas.vue';
import { RobotSimulation } from '../utils/simCore';
import type { SimState, RobotLevels, SensorData } from '../utils/simCore';

const { user } = useAuth();
const isSidebarOpen = ref(false);
const isLoadingRobot = ref(true);

const isDocsCollapsed = ref(false);

// Active Robot Configuration
const robotLevels = ref<RobotLevels>({
  bodyLevel: 1,
  batteryLevel: 1,
  brainLevel: 1,
  engineLevel: 1,
  steeringLevel: 1
});

// Max specs derived
const maxHP = ref(100);
const maxBattery = ref(60000);

// Editor & Local Logs
const userCode = ref('');
const consoleLogs = ref<Array<{ type: 'info' | 'error' | 'log'; text: string; time: string }>>([]);

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const lineNumbersRef = ref<HTMLDivElement | null>(null);
const consoleRef = ref<HTMLDivElement | null>(null);

// Simulation Runtime Engine
let simInstance: RobotSimulation | null = null;
const simState = ref<SimState>({
  x: 500,
  y: 500,
  vx: 0,
  vy: 0,
  speed: 0,
  heading: 270,
  steeringAngle: 0,
  hp: 100,
  battery: 60000,
  throttle: 0,
  targetSteering: 0
});
const sensorData = ref<SensorData>({
  x: 500,
  y: 500,
  speed: 0,
  heading: 270,
  steeringAngle: 0,
  hp: 100,
  battery: 60000,
  maxBattery: 60000,
  wallDistance: { front: 500, back: 500, left: 500, right: 500 }
});

const isSimRunning = ref(false);
const simSpeed = ref(1); // 1x, 2x, 4x speed Multipliers
const activeAccel = ref(0); // Realtime acceleration value
let lastFrameTime = performance.now();
let simFrameId: number | null = null;

// Sandboxed Runtime Executable
let activeThinkFn: ((sensors: SensorData) => { throttle: number; targetSteering: number }) | null = null;

// count line count for custom code textarea
const lineCount = computed(() => {
  const lines = userCode.value.split('\n');
  return lines.length || 1;
});

// Load Code and levels from localstorage & backend API
async function loadData() {
  // 1. Restore written code from localstorage
  const storedCode = localStorage.getItem('playground_code');
  userCode.value = storedCode || GLOSSARY.defaultBotScript;

  // 2. Fetch Robot Levels
  try {
    const res = await authFetch('/api/robot');
    const data = await res.json();
    if (data.robot) {
      robotLevels.value = {
        bodyLevel: data.robot.bodyLevel,
        batteryLevel: data.robot.batteryLevel,
        brainLevel: data.robot.brainLevel,
        engineLevel: data.robot.engineLevel,
        steeringLevel: data.robot.steeringLevel
      };
    }
  } catch (err) {
    addLog('error', 'Failed to load robot configuration from server. Starting simulator with level-1 defaults.');
  } finally {
    // Instantiate engine
    simInstance = new RobotSimulation(robotLevels.value);
    maxHP.value = simInstance.maxHP;
    maxBattery.value = simInstance.maxBattery;
    
    // Bind Collision Handler
    simInstance.onCollision = (evt) => {
      addLog(
        'error', 
        `High speed collision with ${evt.wall} wall! Impact speed: ${Math.round(evt.impactSpeed)}px/s | Damage sustained: ${evt.damage} HP`
      );
      if (simInstance!.state.hp <= 0) {
        addLog('error', 'Critical chassis systems destroyed! Robot has ceased operations.');
        isSimRunning.value = false;
      }
    };

    updateReactiveStates();
    isLoadingRobot.value = false;
  }
}

// Sync reactive properties with simulation engine class
function updateReactiveStates() {
  if (simInstance) {
    simState.value = { ...simInstance.state };
    sensorData.value = simInstance.getSensors();
  }
}

// Sync Scrolling of Line Numbers
function syncScroll() {
  if (textareaRef.value && lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = textareaRef.value.scrollTop;
  }
}

// Insert indent tabs instead of changing text focus
function insertTab() {
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const spaces = '  '; // 2 spaces for tab
  userCode.value = userCode.value.substring(0, start) + spaces + userCode.value.substring(end);
  // Reset cursor position
  setTimeout(() => {
    el.selectionStart = el.selectionEnd = start + spaces.length;
  }, 0);
}

// Custom Local Console logs
function addLog(type: 'info' | 'error' | 'log', text: string) {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  consoleLogs.value.push({ type, text, time: timeStr });
  
  // Auto scroll console to bottom
  setTimeout(() => {
    if (consoleRef.value) {
      consoleRef.value.scrollTop = consoleRef.value.scrollHeight;
    }
  }, 10);
}

function clearLogs() {
  consoleLogs.value = [];
}

// Save Code to localstorage whenever edited
watch(userCode, (newCode) => {
  localStorage.setItem('playground_code', newCode);
});

// Compile and Execute Code
function startSimulation() {
  if (!simInstance) return;

  // Clear previous outputs
  clearLogs();

  // If robot is already dead, auto-reset it first
  if (simInstance.state.hp <= 0) {
    resetSimulation();
  }

  addLog('info', 'Analyzing script syntax and uploading instruction sets...');

  try {
    // Capture user logs using sandboxed console parameter
    const sandboxConsole = {
      log: (...args: any[]) => {
        const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        addLog('log', text);
      },
      error: (...args: any[]) => {
        const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        addLog('error', text);
      },
      info: (...args: any[]) => {
        const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        addLog('info', text);
      }
    };

    // Evaluates script body, binding a custom Console context and checking the presence of a 'think' function
    const factory = new Function('console', `
      ${userCode.value};
      if (typeof think !== 'function') {
        throw new Error("Function think(sensors) not found. Please ensure it is declared correctly.");
      }
      return think;
    `);

    const compiledFn = factory(sandboxConsole);

    // Initial test call to verify execution outputs
    const testSensors = simInstance.getSensors();
    const result = compiledFn(testSensors);

    if (!result || typeof result.throttle !== 'number' || typeof result.targetSteering !== 'number') {
      throw new Error("The think function must return an object containing throttle and targetSteering numbers.");
    }

    // Success! Bind Fn
    activeThinkFn = compiledFn;
    isSimRunning.value = true;
    lastFrameTime = performance.now();
    addLog('info', 'Processor core loaded successfully. Simulation is running.');
  } catch (err: any) {
    isSimRunning.value = false;
    addLog('error', `Compile/Syntax Error: ${err.message}`);
  }
}

function pauseSimulation() {
  isSimRunning.value = false;
  addLog('info', 'Simulation paused.');
}

function resetSimulation() {
  if (simInstance) {
    simInstance.reset();
    activeAccel.value = 0;
    updateReactiveStates();
    addLog('info', 'Robot position and physics state reset successfully.');
  }
}

// Tick Simulation Loop
function tick(time: number) {
  simFrameId = requestAnimationFrame(tick);
  
  if (!isSimRunning.value || !simInstance || !activeThinkFn) {
    lastFrameTime = time;
    return;
  }

  // Calculate elapsed time (limit delta to avoid physics explosion on background tabs)
  let dt = (time - lastFrameTime) / 1000;
  lastFrameTime = time;
  if (dt > 0.1) dt = 0.1;

  // Run calculation steps at chosen speed multiplier
  const substeps = simSpeed.value;
  const dtStep = dt / substeps;

  try {
    for (let s = 0; s < substeps; s++) {
      const sensors = simInstance.getSensors();
      const action = activeThinkFn(sensors);

      const throttle = action.throttle ?? 0;
      const targetSteering = action.targetSteering ?? 0;

      // Track acceleration dynamically: a = (F/m) - (damping * speed)
      const forceMultiplier = 160;
      const activeThrottle = simInstance.state.battery > 0 ? throttle : 0;
      const engineForce = activeThrottle * simInstance.enginePower * forceMultiplier;
      const accel = (engineForce / simInstance.totalWeight) - (1.2 * simInstance.state.speed);
      activeAccel.value = accel;

      // Move simulation step
      simInstance.step(dtStep, throttle, targetSteering);

      // If battery died mid-step, notify
      if (simInstance.state.battery <= 0 && simInstance.state.speed === 0) {
        addLog('error', 'Battery depleted. Simulation stopped.');
        isSimRunning.value = false;
        break;
      }
    }
    updateReactiveStates();
  } catch (err: any) {
    isSimRunning.value = false;
    addLog('error', `Runtime error in think function: ${err.message}`);
  }
}

// ---------------- Lifecycle Hooks ----------------
onMounted(() => {
  loadData();
  simFrameId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  if (simFrameId !== null) {
    cancelAnimationFrame(simFrameId);
  }
});
</script>

<style scoped>
.playground-container {
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.playground-content {
  flex: 1;
  padding: 40px;
  max-width: 1360px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.playground-header {
  margin-bottom: 30px;
}

.playground-header h1 {
  font-size: 2.2rem;
  margin: 0 0 8px 0;
}

.playground-header p {
  color: var(--text-secondary);
  margin: 0;
}

.playground-grid {
  display: grid;
  grid-template-columns: 600px 1fr;
  gap: 32px;
  align-items: start;
}

/* Left Panel: Simulator */
.sim-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

/* Robot HUD Status Bars */
.robot-hud {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-sm);
  padding: 16px;
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hud-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  width: 55px;
  font-weight: 600;
}

.hud-bar-bg {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.hud-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.1s linear;
}

.hp-fill {
  background: linear-gradient(90deg, #ef4444, #f87171);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.battery-fill {
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

.hud-value {
  font-size: 0.85rem;
  font-family: monospace;
  font-weight: 700;
  width: 100px;
  text-align: left;
}

.hud-row-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 12px;
}

.hud-sub-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.01);
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.02);
}

.hud-sub-item .hud-label {
  font-size: 0.8rem;
  width: auto;
}

.hud-sub-item .hud-value {
  width: auto;
  font-size: 0.8rem;
}

.text-cyan {
  color: #06b6d4;
}

/* Simulation Controls */
.sim-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

.control-buttons {
  display: flex;
  gap: 12px;
}

.control-buttons .btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: var(--border-radius-sm);
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-fast);
  border: none;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(6, 182, 212, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.35);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.2);
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.speed-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.speed-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.speed-btn-group {
  display: flex;
  gap: 4px;
}

.speed-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
}

.speed-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.speed-btn.active {
  background: var(--primary-glow);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

/* Right Panel: Editor & Logs */
.editor-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Collapsible API Docs accordion */
.docs-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.docs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.01);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  user-select: none;
}

.docs-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 0.95rem;
}

.docs-header-title svg {
  color: #06b6d4;
}

.arrow-icon {
  color: var(--text-muted);
  transition: transform 0.25s ease;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.docs-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 240px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.15);
  font-size: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
}

/* Custom docs scrollbar */
.docs-content::-webkit-scrollbar {
  width: 5px;
}
.docs-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}

.docs-group h4 {
  margin: 0 0 6px 0;
  font-size: 0.9rem;
  font-weight: 700;
}

.docs-list {
  margin: 0;
  padding-right: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--text-secondary);
}

.docs-list li code {
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: monospace;
}

/* Editor Section */
.editor-section {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 10px;
}

.editor-toolbar h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.editor-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: monospace;
}

.code-editor-container {
  display: grid;
  grid-template-columns: 45px 1fr;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius-sm);
  height: 350px;
  overflow: hidden;
  position: relative;
}

.line-numbers {
  background: #090d1a;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: hidden;
  user-select: none;
}

.line-number {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.2);
  line-height: 1.5;
  height: 20px;
}

.code-textarea {
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 12px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.5;
  white-space: pre;
  overflow: auto;
  tab-size: 2;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.code-textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.code-textarea::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

/* Console logs area */
.console-section {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.console-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.clear-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.console-logs {
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-sm);
  height: 140px;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-sizing: border-box;
}

.console-logs::-webkit-scrollbar {
  width: 6px;
}
.console-logs::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

.console-placeholder {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-style: italic;
}

.console-line {
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
}

.console-line.info {
  color: #38bdf8;
}

.console-line.error {
  color: #f87171;
}

.console-line.log {
  color: #e2e8f0;
}

.log-time {
  color: rgba(255, 255, 255, 0.25);
  margin-right: 6px;
  font-weight: 600;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(6, 182, 212, 0.15);
  border-radius: 50%;
  border-top-color: #06b6d4;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1200px) {
  .playground-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .sim-panel {
    align-items: center;
  }
  .playground-canvas-container {
    width: 100%;
    max-width: 500px;
  }
}
@media (max-width: 768px) {
  .playground-content {
    padding: 24px 16px;
  }
}
</style>
