<template>
  <div class="playground-layout">
    <!-- Header Toolbar (Workspace Control Center) -->
    <header class="workspace-toolbar">
      <div class="toolbar-left">
        <button @click="goBack" class="btn-toolbar btn-back" type="button" title="Back to Cockpit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Cockpit</span>
        </button>
        <div class="toolbar-divider"></div>
        <span class="workspace-title">Workspace: <strong class="text-cyan">{{ activeScript?.name || 'Loading...' }}</strong></span>
      </div>

      <!-- Center: Simulation Controls -->
      <div class="toolbar-center">
        <div class="sim-btn-group">
          <button 
            v-if="!isSimRunning" 
            @click="startSimulation" 
            class="btn-control btn-play"
            type="button"
            title="Compile & Run"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Run</span>
          </button>
          
          <button 
            v-else 
            @click="pauseSimulation" 
            class="btn-control btn-pause"
            type="button"
            title="Pause Simulation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            <span>Pause</span>
          </button>

          <button 
            @click="resetSimulation" 
            class="btn-control btn-reset"
            type="button"
            title="Reset Robot Coordinates"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            <span>Reset</span>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- Simulator Speed selector -->
        <div class="speed-selector">
          <span class="speed-label">Speed:</span>
          <div class="speed-buttons">
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

      <!-- Right: Actions & Profile -->
      <div class="toolbar-right">
        <!-- Telemetry Window Toggle -->
        <button 
          @click="isHudVisible = !isHudVisible" 
          :class="['btn-toolbar', { active: isHudVisible }]"
          type="button" 
          title="Toggle Floating HUD"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          <span>HUD</span>
        </button>

        <!-- Save button -->
        <button 
          @click="saveActiveScript" 
          class="btn-toolbar btn-save" 
          type="button" 
          title="Save Script (Ctrl + S)"
          :disabled="isSavingScript"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>{{ isSavingScript ? 'Saving...' : 'Save' }}</span>
        </button>
      </div>
    </header>

    <!-- Workspace split content -->
    <div class="workspace-body" ref="workspaceRef">
      
      <!-- Left Area (Canvas & Explorer) -->
      <div class="split-pane pane-left" :style="{ width: leftPanelWidth + '%' }">
        
        <!-- Nested File Explorer -->
        <div class="explorer-sidebar">
          <div class="explorer-header">
            <span class="explorer-title">SCRIPTS EXPLORER</span>
            <button @click="createNewScript" class="btn-new-file" type="button" title="New Script">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div class="explorer-files">
            <div 
              v-for="scr in scriptsList" 
              :key="scr.id"
              :class="['file-item', { active: activeScript?.id === scr.id }]"
              @click="selectScript(scr)"
              @dblclick="renameScript(scr)"
            >
              <div class="file-name-group">
                <svg class="file-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span class="file-name">{{ scr.name }}</span>
              </div>
              
              <button 
                v-if="scriptsList.length > 1" 
                @click.stop="deleteScript(scr)" 
                class="btn-delete-file" 
                type="button"
                title="Delete file"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 2D Arena Canvas view -->
        <div class="canvas-wrapper">
          <PlaygroundCanvas 
            v-if="!isLoadingRobot"
            :state="simState" 
            :levels="robotLevels" 
            :sensors="sensorData" 
          />

          <!-- Draggable HUD overlay -->
          <TelemetryHUD 
            v-if="isHudVisible && !isLoadingRobot"
            :hp="simState.hp"
            :maxHP="maxHP"
            :battery="simState.battery"
            :maxBattery="maxBattery"
            :speed="simState.speed"
            :accel="activeAccel"
            :steeringAngle="simState.steeringAngle"
            :wallDistance="sensorData.wallDistance"
            @close="isHudVisible = false"
          />
        </div>

      </div>

      <!-- Vertical Resizer Divider Handle -->
      <div class="resizer vertical-resizer" @pointerdown="startVerticalResize"></div>

      <!-- Right Area (Editor & Console) -->
      <div class="split-pane pane-right" :style="{ width: (100 - leftPanelWidth) + '%' }">
        
        <!-- Editor Top Half -->
        <div class="editor-pane" :style="{ height: editorHeight + '%' }">
          <div class="pane-header">
            <span class="pane-title">CODE EDITOR</span>
            <span class="file-path text-muted">{{ activeScript?.name }} - Unsaved changes are saved locally</span>
          </div>
          <!-- Monaco editor container -->
          <div class="monaco-host" ref="editorContainerRef"></div>
        </div>

        <!-- Horizontal Resizer Divider Handle -->
        <div class="resizer horizontal-resizer" @pointerdown="startHorizontalResize"></div>

        <!-- Console Bottom Half -->
        <div class="console-pane" :style="{ height: (100 - editorHeight) + '%' }">
          <div class="pane-header console-header">
            <span class="pane-title">CONSOLE TERMINAL</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { authFetch } from '../utils/auth';
import { GLOSSARY } from '../glossary';
import PlaygroundCanvas from '../components/PlaygroundCanvas.vue';
import TelemetryHUD from '../components/TelemetryHUD.vue';
import { RobotSimulation } from '../utils/simCore';
import type { SimState, RobotLevels, SensorData } from '../utils/simCore';

// Monaco imports & worker setups
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Define workers offline
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new jsonWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker();
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker();
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    return new editorWorker();
  }
};

interface ScriptFile {
  id: string;
  name: string;
  code: string;
}

const router = useRouter();

// Loading states
const isLoadingRobot = ref(true);
const isHudVisible = ref(true);
const isSavingScript = ref(false);

// Panel split ratios
const leftPanelWidth = ref(45); // width percentage of the left panel
const editorHeight = ref(65); // height percentage of the editor inside right pane

const workspaceRef = ref<HTMLDivElement | null>(null);
const editorContainerRef = ref<HTMLDivElement | null>(null);
const consoleRef = ref<HTMLDivElement | null>(null);

// Monaco Instance references
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;

// Database Sync File Explorer
const scriptsList = ref<ScriptFile[]>([]);
const activeScript = ref<ScriptFile | null>(null);
const activeCodeText = ref('');

// Robot Upgrades Specs
const robotLevels = ref<RobotLevels>({
  bodyLevel: 1,
  batteryLevel: 1,
  brainLevel: 1,
  engineLevel: 1,
  steeringLevel: 1
});

const maxHP = ref(100);
const maxBattery = ref(60000);

// Simulator Physics Engine state
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
const simSpeed = ref(1);
const activeAccel = ref(0);
let lastFrameTime = performance.now();
let simFrameId: number | null = null;

// Compiled sandboxed function ref
let activeThinkFn: ((sensors: SensorData) => { throttle: number; targetSteering: number }) | null = null;

const consoleLogs = ref<Array<{ type: 'info' | 'error' | 'log'; text: string; time: string }>>([]);

// Back navigation
function goBack() {
  pauseSimulation();
  router.push('/dashboard');
}

// ---------------- Panel resizing drag handlers ----------------

let workspaceWidth = 0;
let workspaceHeight = 0;

function startVerticalResize() {
  if (workspaceRef.value) {
    workspaceWidth = workspaceRef.value.getBoundingClientRect().width;
  }
  window.addEventListener('pointermove', onVerticalResize);
  window.addEventListener('pointerup', stopResize);
}

function onVerticalResize(e: PointerEvent) {
  if (workspaceRef.value) {
    const rect = workspaceRef.value.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const pct = (relativeX / workspaceWidth) * 100;
    // Clamp left pane width between 25% and 75%
    leftPanelWidth.value = Math.max(25, Math.min(75, pct));
  }
}

function startHorizontalResize() {
  if (workspaceRef.value) {
    workspaceHeight = workspaceRef.value.getBoundingClientRect().height;
  }
  window.addEventListener('pointermove', onHorizontalResize);
  window.addEventListener('pointerup', stopResize);
}

function onHorizontalResize(e: PointerEvent) {
  if (workspaceRef.value) {
    const rect = workspaceRef.value.getBoundingClientRect();
    // Toolbar is 50px high
    const relativeY = e.clientY - rect.top;
    const pct = (relativeY / workspaceHeight) * 100;
    // Clamp editor height between 25% and 80%
    editorHeight.value = Math.max(25, Math.min(80, pct));
  }
}

function stopResize() {
  window.removeEventListener('pointermove', onVerticalResize);
  window.removeEventListener('pointermove', onHorizontalResize);
  window.removeEventListener('pointerup', stopResize);
  // Force Monaco to adjust container bounds layout
  if (editorInstance) {
    editorInstance.layout();
  }
}

// ---------------- Database Sync File CRUD Operations ----------------

async function fetchScripts() {
  try {
    const res = await authFetch('/api/scripts');
    const data = await res.json();
    if (data.scripts && data.scripts.length > 0) {
      scriptsList.value = data.scripts;
      
      // Auto restore previous active script or load first
      const savedActiveId = localStorage.getItem('playground_active_script_id');
      const found = scriptsList.value.find(s => s.id === savedActiveId);
      selectScript(found || scriptsList.value[0]);
    }
  } catch (err) {
    addLog('error', 'Failed to load scripts list from backend.');
  }
}

function selectScript(script: ScriptFile) {
  activeScript.value = script;
  localStorage.setItem('playground_active_script_id', script.id);
  
  // Load local cached version of this file if exists, otherwise load database code
  const localCache = localStorage.getItem(`local_code_cache_${script.id}`);
  activeCodeText.value = localCache !== null ? localCache : script.code;

  if (editorInstance) {
    editorInstance.setValue(activeCodeText.value);
    
    // Switch Monaco language model based on extension
    const model = editorInstance.getModel();
    if (model) {
      const language = script.name.endsWith('.ts') ? 'typescript' : 'javascript';
      monaco.editor.setModelLanguage(model, language);
    }
  }
}

async function createNewScript() {
  const filename = prompt('Enter filename (must end with .ts or .js):', 'untitled.ts');
  if (!filename) return;

  const name = filename.trim();
  if (name === '') return;

  if (!name.endsWith('.ts') && !name.endsWith('.js')) {
    alert('Filename must end with .ts or .js');
    return;
  }

  try {
    const res = await authFetch('/api/scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code: GLOSSARY.defaultBotScript })
    });
    
    const data = await res.json();
    if (res.ok && data.script) {
      scriptsList.value.push(data.script);
      selectScript(data.script);
      addLog('info', `File "${name}" created successfully.`);
    } else {
      alert(data.error || 'Failed to create script file.');
    }
  } catch (err: any) {
    alert('Error connecting to backend API.');
  }
}

async function renameScript(script: ScriptFile) {
  const newName = prompt('Enter new filename:', script.name);
  if (!newName) return;

  const name = newName.trim();
  if (name === '' || name === script.name) return;

  if (!name.endsWith('.ts') && !name.endsWith('.js')) {
    alert('Filename must end with .ts or .js');
    return;
  }

  try {
    const res = await authFetch(`/api/scripts/${script.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    
    const data = await res.json();
    if (res.ok && data.script) {
      const idx = scriptsList.value.findIndex(s => s.id === script.id);
      if (idx !== -1) {
        scriptsList.value[idx].name = name;
      }
      addLog('info', `File renamed to "${name}".`);
    } else {
      alert(data.error || 'Failed to rename file.');
    }
  } catch (err) {
    alert('Error connecting to backend API.');
  }
}

async function deleteScript(script: ScriptFile) {
  if (scriptsList.value.length <= 1) return;
  
  const confirmDel = confirm(`Are you sure you want to delete "${script.name}"?`);
  if (!confirmDel) return;

  try {
    const res = await authFetch(`/api/scripts/${script.id}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      // Clean local caches
      localStorage.removeItem(`local_code_cache_${script.id}`);
      
      const idx = scriptsList.value.findIndex(s => s.id === script.id);
      if (idx !== -1) {
        scriptsList.value.splice(idx, 1);
      }
      
      // If deleted active, switch to first available
      if (activeScript.value?.id === script.id) {
        selectScript(scriptsList.value[0]);
      }
      addLog('info', `File "${script.name}" deleted successfully.`);
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete script.');
    }
  } catch (err) {
    alert('Error connecting to backend API.');
  }
}

// Save active file to database (Ctrl + S)
async function saveActiveScript() {
  if (!activeScript.value) return;

  isSavingScript.value = true;
  const currentCode = editorInstance ? editorInstance.getValue() : activeCodeText.value;

  try {
    const res = await authFetch(`/api/scripts/${activeScript.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: currentCode })
    });
    
    const data = await res.json();
    if (res.ok && data.script) {
      // Update local array object
      const idx = scriptsList.value.findIndex(s => s.id === activeScript.value!.id);
      if (idx !== -1) {
        scriptsList.value[idx].code = currentCode;
      }
      activeScript.value.code = currentCode;
      
      // Sync localstorage cache
      localStorage.setItem(`local_code_cache_${activeScript.value.id}`, currentCode);
      
      addLog('info', `Script "${activeScript.value.name}" saved successfully to cloud database.`);
    } else {
      addLog('error', `Failed to save script: ${data.error}`);
    }
  } catch (err) {
    addLog('error', 'Error synchronizing code file changes with database server.');
  } finally {
    isSavingScript.value = false;
  }
}

// ---------------- Simulation Executable Triggers ----------------

function loadRobotAndRunSimulation() {
  isLoadingRobot.value = true;
  authFetch('/api/robot')
    .then(res => res.json())
    .then(data => {
      if (data.robot) {
        robotLevels.value = {
          bodyLevel: data.robot.bodyLevel,
          batteryLevel: data.robot.batteryLevel,
          brainLevel: data.robot.brainLevel,
          engineLevel: data.robot.engineLevel,
          steeringLevel: data.robot.steeringLevel
        };
      }
    })
    .catch(() => {
      addLog('error', 'Failed to retrieve robot upgrades. Running level-1 hardware defaults.');
    })
    .finally(() => {
      simInstance = new RobotSimulation(robotLevels.value);
      maxHP.value = simInstance.maxHP;
      maxBattery.value = simInstance.maxBattery;
      
      simInstance.onCollision = (evt) => {
        // Log in unified metric units
        const speedMS = evt.impactSpeed / 40;
        const accelMS = evt.acceleration / 40;
        addLog(
          'error', 
          `Collision with ${evt.wall} wall! Speed: ${speedMS.toFixed(2)}m/s | Accel: ${accelMS.toFixed(2)}m/s² | Damage: ${evt.damage} HP`
        );
        if (simInstance!.state.hp <= 0) {
          addLog('error', 'Robot chassis structural integrity failed! Engine deactivated.');
          isSimRunning.value = false;
        }
      };

      updateReactiveStates();
      isLoadingRobot.value = false;
    });
}

function updateReactiveStates() {
  if (simInstance) {
    simState.value = { ...simInstance.state };
    sensorData.value = simInstance.getSensors();
  }
}

// Local Console logging wrapper
function addLog(type: 'info' | 'error' | 'log', text: string) {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  consoleLogs.value.push({ type, text, time: timeStr });
  
  setTimeout(() => {
    if (consoleRef.value) {
      consoleRef.value.scrollTop = consoleRef.value.scrollHeight;
    }
  }, 10);
}

function clearLogs() {
  consoleLogs.value = [];
}

// Compile & Execute script
function startSimulation() {
  if (!simInstance) return;

  clearLogs();

  if (simInstance.state.hp <= 0) {
    resetSimulation();
  }

  const currentCode = editorInstance ? editorInstance.getValue() : activeCodeText.value;
  addLog('info', 'Compiling decision script logic...');

  try {
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

    // Evaluates script body, binding a custom Console context and checking think presence
    const factory = new Function('console', `
      ${currentCode};
      if (typeof think !== 'function') {
        throw new Error("Function 'think(sensors)' not found. Make sure it is declared in the root scope.");
      }
      return think;
    `);

    const compiledFn = factory(sandboxConsole);

    // Initial output verification test
    const testSensors = simInstance.getSensors();
    const result = compiledFn(testSensors);

    if (!result || typeof result.throttle !== 'number' || typeof result.targetSteering !== 'number') {
      throw new Error("The return value of think(sensors) must be an object like: { throttle: 0.8, targetSteering: 0 }");
    }

    activeThinkFn = compiledFn;
    isSimRunning.value = true;
    lastFrameTime = performance.now();
    addLog('info', 'Script model loaded. Simulation starting...');
  } catch (err: any) {
    isSimRunning.value = false;
    addLog('error', `Compilation Error: ${err.message}`);
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

  let dt = (time - lastFrameTime) / 1000;
  lastFrameTime = time;
  if (dt > 0.1) dt = 0.1;

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

      // Update simulation step
      simInstance.step(dtStep, throttle, targetSteering);

      if (simInstance.state.battery <= 0 && simInstance.state.speed === 0) {
        addLog('error', 'Battery fully depleted. Simulation stopped.');
        isSimRunning.value = false;
        break;
      }
    }
    updateReactiveStates();
  } catch (err: any) {
    isSimRunning.value = false;
    addLog('error', `Runtime Error inside think(): ${err.message}`);
  }
}

// Global keyboard listeners for shortcuts
function handleGlobalKeys(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveActiveScript();
  }
}

// ---------------- Lifecycle Hooks ----------------

onMounted(() => {
  loadRobotAndRunSimulation();
  fetchScripts();
  window.addEventListener('keydown', handleGlobalKeys);

  // Initialize Monaco Editor inside Container Ref
  if (editorContainerRef.value) {
    editorInstance = monaco.editor.create(editorContainerRef.value, {
      value: activeCodeText.value,
      language: 'typescript',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 13,
      fontFamily: 'Consolas, "Courier New", monospace',
      minimap: { enabled: false },
      lineNumbers: 'on',
      tabSize: 2,
      cursorBlinking: 'smooth',
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      }
    });

    // Save changes to local component state (caches code)
    editorInstance.onDidChangeModelContent(() => {
      if (editorInstance && activeScript.value) {
        const val = editorInstance.getValue();
        activeCodeText.value = val;
        localStorage.setItem(`local_code_cache_${activeScript.value.id}`, val);
      }
    });

    // Monaco editor Ctrl+S Command injection
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveActiveScript();
    });
  }

  simFrameId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeys);
  if (simFrameId !== null) {
    cancelAnimationFrame(simFrameId);
  }
  if (editorInstance) {
    editorInstance.dispose();
  }
});
</script>

<style scoped>
/* Main Layout Workspace */
.playground-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #020617;
  color: var(--text-primary);
  overflow: hidden;
  font-family: var(--font-family);
}

/* 1. Header Toolbar */
.workspace-toolbar {
  height: 50px;
  background: #090d1a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 300;
  box-sizing: border-box;
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workspace-title {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.text-cyan {
  color: #06b6d4;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
}

/* Toolbar buttons */
.btn-toolbar {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-toolbar:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.08);
}

.btn-toolbar.active {
  background: rgba(6, 182, 212, 0.08);
  color: #06b6d4;
  border-color: rgba(6, 182, 212, 0.2);
}

.btn-back {
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.15);
}

.btn-back:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ffffff;
}

.btn-save {
  background: rgba(6, 182, 212, 0.08);
  color: #06b6d4;
  border-color: rgba(6, 182, 212, 0.15);
}

.btn-save:hover {
  background: rgba(6, 182, 212, 0.15);
  color: #ffffff;
}

/* Simulation Controls */
.sim-btn-group {
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.btn-control {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-fast);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-control:last-child {
  border-right: none;
}

.btn-control:hover {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
}

.btn-play {
  color: #4ade80;
}
.btn-play:hover {
  background: rgba(74, 222, 128, 0.08);
}

.btn-pause {
  color: #fbbf24;
}
.btn-pause:hover {
  background: rgba(251, 191, 36, 0.08);
}

/* Speed selectors */
.speed-selector {
  display: flex;
  align-items: center;
  gap: 6px;
}

.speed-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.speed-buttons {
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-sm);
  padding: 2px;
}

.speed-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  transition: var(--transition-fast);
  font-weight: 700;
}

.speed-btn:hover {
  color: var(--text-primary);
}

.speed-btn.active {
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.15);
}

/* 2. Workspace Layout Body */
.workspace-body {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* Split Panes */
.split-pane {
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.pane-left {
  display: grid;
  grid-template-columns: 180px 1fr;
  background-color: #050812;
  border-right: 1px solid rgba(255, 255, 255, 0.04);
}

.pane-right {
  flex-direction: column;
  background-color: #090d1a;
  border-left: 1px solid rgba(255, 255, 255, 0.04);
}

/* Resizers */
.resizer {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  z-index: 100;
  transition: background-color 0.2s;
}

.resizer:hover {
  background-color: #06b6d4;
}

.vertical-resizer {
  width: 4px;
  cursor: col-resize;
  height: 100%;
}

.horizontal-resizer {
  height: 4px;
  cursor: row-resize;
  width: 100%;
}

/* Explorer Sidebar */
.explorer-sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: #04060f;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.explorer-title {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--text-secondary);
}

.btn-new-file {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.btn-new-file:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #06b6d4;
}

.explorer-files {
  flex: 1;
  overflow-y: auto;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
  color: var(--text-secondary);
}

.file-item:hover {
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-primary);
}

.file-item.active {
  background: rgba(6, 182, 212, 0.08);
  color: #06b6d4;
  border-left: 2px solid #06b6d4;
  border-radius: 0 4px 4px 0;
}

.file-name-group {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.file-item.active .file-icon {
  color: #06b6d4;
}

.file-name {
  font-size: 0.8rem;
  font-weight: 500;
}

.btn-delete-file {
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}

.file-item:hover .btn-delete-file {
  display: block;
}

.btn-delete-file:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

/* 2D Arena Canvas Wrapper */
.canvas-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* Editor & Console panes */
.editor-pane,
.console-pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.pane-header {
  height: 32px;
  background: #070a14;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.pane-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--text-secondary);
}

.file-path {
  font-size: 0.7rem;
  margin-left: 12px;
  font-family: monospace;
}

.monaco-host {
  flex: 1;
  overflow: hidden;
  background-color: #1e1e1e; /* Monaco default dark */
}

/* Console logs */
.console-header {
  justify-content: space-between;
  background: #050810;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.console-logs {
  flex: 1;
  background: #03050b;
  overflow-y: auto;
  padding: 12px 16px;
  box-sizing: border-box;
  font-family: 'Consolas', monospace;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.console-placeholder {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-style: italic;
}

.console-line {
  font-size: 0.78rem;
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
  color: #cbd5e1;
}

.log-time {
  color: rgba(255, 255, 255, 0.2);
  margin-right: 8px;
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.clear-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

/* Loading skeleton */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(6, 182, 212, 0.15);
  border-radius: 50%;
  border-top-color: #06b6d4;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Custom Scrollbars */
.explorer-files::-webkit-scrollbar,
.console-logs::-webkit-scrollbar {
  width: 6px;
}
.explorer-files::-webkit-scrollbar-thumb,
.console-logs::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 3px;
}
</style>
