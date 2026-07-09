<template>
  <div class="docs-container">
    <!-- Navbar -->
    <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

    <!-- Sidebar Left Navigation Drawer -->
    <AppSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" activeMenu="docs" />

    <!-- Main Docs Layout -->
    <main class="docs-content">
      <div class="docs-header-title">
        <h1>RoboSim Documentation Guide</h1>
        <p>Master the mechanics of robot physics, sensors, engine controls, and scripting.</p>
      </div>

      <div class="docs-workspace">
        <!-- Navigation Menu -->
        <aside class="docs-nav glass-card">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['nav-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
            type="button"
          >
            <span class="nav-icon" v-html="tab.icon"></span>
            <span>{{ tab.name }}</span>
          </button>
        </aside>

        <!-- Category Content -->
        <section class="docs-body glass-card">
          
          <!-- TAB 1: OVERVIEW -->
          <div v-if="activeTab === 'overview'" class="tab-pane">
            <h2>1. System Overview</h2>
            <p>Welcome to <strong>RoboSim</strong> — the tactical, deterministic combat-robotics programming platform. Here, commanders configure physical components in the Brain Laboratory, write control code, and execute local simulations to test maneuverability and logic before joining matches.</p>
            
            <div class="info-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div>
                <strong>Core Philosophy:</strong> The simulation engine runs in discrete ticks (60 ticks/second) and is completely deterministic. With identical script logic and initial seeds, the simulation results will be exactly identical.
              </div>
            </div>

            <h3>Simulation Cycle</h3>
            <p>Every tick (approximately 16.6ms), the simulation engine performs the following operations:</p>
            <ol class="ordered-list">
              <li>Populates physical sensor values (velocities, heading, battery, and wall distances).</li>
              <li>Passes the <code>sensors</code> payload to your script's <code>think(sensors)</code> entry function.</li>
              <li>Evaluates your controller logic and retrieves the returned action commands (throttle & steering).</li>
              <li>Applies physical forces (acceleration, wheel rotation rate, drag, and collision checks) to advance the robot state.</li>
              <li>Drains energy capacity based on engine load and processor idling.</li>
            </ol>
          </div>

          <!-- TAB 2: SENSORS API -->
          <div v-if="activeTab === 'sensors'" class="tab-pane">
            <h2>2. Sensor Telemetry API</h2>
            <p>The <code>sensors</code> object passed to the <code>think(sensors)</code> function provides real-time read-only parameters from the robot’s active telemetry components.</p>
            
            <table class="docs-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Units</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>sensors.x</code></td>
                  <td>number</td>
                  <td>pixels</td>
                  <td>X coordinate inside the arena (0 to 1000).</td>
                </tr>
                <tr>
                  <td><code>sensors.y</code></td>
                  <td>number</td>
                  <td>pixels</td>
                  <td>Y coordinate inside the arena (0 to 1000).</td>
                </tr>
                <tr>
                  <td><code>sensors.speed</code></td>
                  <td>number</td>
                  <td>m/s</td>
                  <td>Current linear speed (meters/second). Positive is forward, negative is reverse.</td>
                </tr>
                <tr>
                  <td><code>sensors.heading</code></td>
                  <td>number</td>
                  <td>degrees</td>
                  <td>Orientation angle (0 to 360°). 270° points straight North, 0° points East.</td>
                </tr>
                <tr>
                  <td><code>sensors.steeringAngle</code></td>
                  <td>number</td>
                  <td>degrees</td>
                  <td>Current angle of the front steering wheels (relative to chassis axis).</td>
                </tr>
                <tr>
                  <td><code>sensors.hp</code></td>
                  <td>number</td>
                  <td>HP</td>
                  <td>Chassis structural health. Hitting walls at high speeds drains HP.</td>
                </tr>
                <tr>
                  <td><code>sensors.battery</code></td>
                  <td>number</td>
                  <td>EU</td>
                  <td>Remaining energy storage in the battery core.</td>
                </tr>
                <tr>
                  <td><code>sensors.maxBattery</code></td>
                  <td>number</td>
                  <td>EU</td>
                  <td>Maximum energy capacity of your current battery core level.</td>
                </tr>
                <tr>
                  <td><code>sensors.wallDistance.front</code></td>
                  <td>number</td>
                  <td>pixels</td>
                  <td>Orthogonal raycast distance from front to the closest boundary wall.</td>
                </tr>
                <tr>
                  <td><code>sensors.wallDistance.back</code></td>
                  <td>number</td>
                  <td>pixels</td>
                  <td>Raycast distance to the wall directly behind the robot.</td>
                </tr>
                <tr>
                  <td><code>sensors.wallDistance.left</code></td>
                  <td>number</td>
                  <td>pixels</td>
                  <td>Raycast distance to the wall on the left side.</td>
                </tr>
                <tr>
                  <td><code>sensors.wallDistance.right</code></td>
                  <td>number</td>
                  <td>pixels</td>
                  <td>Raycast distance to the wall on the right side.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 3: ENGINE CONTROL -->
          <div v-if="activeTab === 'engine'" class="tab-pane">
            <h2>3. Engine Commands (Actions)</h2>
            <p>Your <code>think(sensors)</code> controller function must return an object instructing the propulsion engine and steering servos. The return payload must conform to the following schema:</p>
            
            <pre class="code-block"><code>return {
  throttle: number,       // propulsion speed command
  targetSteering: number  // steering angle command
};</code></pre>

            <h3>Command Parameters</h3>
            <ul class="docs-list">
              <li>
                <strong><code>throttle</code></strong> <em>(Range: -1.0 to 1.0)</em>:
                Defines the propulsion force. <code>1.0</code> represents 100% full-throttle forward, <code>-1.0</code> represents 100% full-throttle reverse, and <code>0</code> cuts off power.
              </li>
              <li>
                <strong><code>targetSteering</code></strong> <em>(Range: -MaxSteering to +MaxSteering)</em>:
                Defines the front-wheel angle target in degrees. Positive angles turn the wheel clockwise (right), negative angles turn the wheel counter-clockwise (left). Commands exceeding limits are clamped to the maximum range of the steering servos.
              </li>
            </ul>

            <div class="warning-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div>
                <strong>Latent Servo Turn:</strong> Wheels do not turn instantly. They move towards <code>targetSteering</code> at your steering servos' speed rating (e.g. 45°/s). High-velocity cornering requires early steering target calibration.
              </div>
            </div>
          </div>

          <!-- TAB 4: UPGRADES PHYSICS -->
          <div v-if="activeTab === 'physics'" class="tab-pane">
            <h2>4. Physical Specs & Formulas</h2>
            <p>A robot's performance changes dynamically based on component levels upgraded inside the **Brain Laboratory**. Below are the mathematical formulas governing the chassis specs:</p>

            <div class="formulas-grid">
              <div class="formula-card">
                <h5>Chassis Max HP</h5>
                <p class="formula-math">$$\text{Max HP} = 100 \times (1 + (\text{Level} - 1) \times 0.20)$$</p>
                <span class="formula-note">Adds +20% HP per tier.</span>
              </div>
              <div class="formula-card">
                <h5>Vehicle Weight</h5>
                <p class="formula-math">$$W_{\text{body}} = 50 \times 1.10^{\text{Level} - 1}$$</p>
                <span class="formula-note">Adds +10% body mass per tier.</span>
              </div>
              <div class="formula-card">
                <h5>Engine Power</h5>
                <p class="formula-math">$$\text{Power} = 100 \times (1 + (\text{Level} - 1) \times 0.05)$$</p>
                <span class="formula-note">Adds +5% N force per tier.</span>
              </div>
              <div class="formula-card">
                <h5>Battery Capacity</h5>
                <p class="formula-math">$$\text{Capacity} = 60,000 \times (1 + (\text{Level} - 1) \times 0.25)$$</p>
                <span class="formula-note">Adds +25% capacity per tier.</span>
              </div>
            </div>

            <h3>Mobility Metrics</h3>
            <p>Propulsion statistics are derived from weight-to-power ratios:</p>
            <ul class="docs-list">
              <li><strong>Total Weight (kg)</strong>: \(W_{\text{body}} + W_{\text{battery}} + 15\text{ kg}\) (fixed parts weight).</li>
              <li><strong>Acceleration (\(\text{m/s}^2\))</strong>: \(\frac{\text{Engine Power}}{\text{Total Weight}}\)</li>
              <li><strong>Top Speed (m/s)</strong>: \(\frac{\text{Engine Power}}{\text{Total Weight} \times 0.3}\)</li>
            </ul>

            <div class="info-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div>
                <strong>Metric Grid Ratio:</strong> 1 meter in real-world physics matches exactly 40 pixels inside the simulation coordinate grid.
              </div>
            </div>
          </div>

        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';

const isSidebarOpen = ref(false);
const activeTab = ref('overview');

const tabs = [
  {
    id: 'overview',
    name: '1. Overview',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  },
  {
    id: 'sensors',
    name: '2. Sensors API',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
  },
  {
    id: 'engine',
    name: '3. Engine Control',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`
  },
  {
    id: 'physics',
    name: '4. Physical Specs',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`
  }
];
</script>

<style scoped>
.docs-container {
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.docs-content {
  flex: 1;
  padding: 40px;
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.docs-header-title {
  margin-bottom: 30px;
}

.docs-header-title h1 {
  font-size: 2.2rem;
  margin: 0 0 8px 0;
}

.docs-header-title p {
  color: var(--text-secondary);
  margin: 0;
}

.docs-workspace {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 30px;
  align-items: start;
}

/* Nav Menu Left Column */
.docs-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
}

.nav-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
  text-align: left;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  border-color: var(--border-glow);
}

.nav-btn.active {
  background-color: var(--primary-glow);
  color: var(--text-primary);
  border-color: rgba(79, 70, 229, 0.3);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.nav-btn:hover .nav-icon,
.nav-btn.active .nav-icon {
  color: var(--primary-color);
}

/* Docs Body Right Column */
.docs-body {
  padding: 30px;
  min-height: 500px;
  box-sizing: border-box;
}

.tab-pane h2 {
  font-size: 1.6rem;
  margin: 0 0 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
}

.tab-pane h3 {
  font-size: 1.25rem;
  margin: 24px 0 12px 0;
}

.tab-pane p {
  line-height: 1.6;
  color: var(--text-secondary);
  margin-top: 0;
  margin-bottom: 16px;
}

.ordered-list {
  margin: 16px 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.ordered-list li strong {
  color: var(--text-primary);
}

.docs-list {
  margin: 16px 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* API Info Alerts */
.info-alert {
  display: flex;
  gap: 12px;
  background: rgba(6, 182, 212, 0.06);
  border: 1px solid rgba(6, 182, 212, 0.25);
  border-radius: var(--border-radius-sm);
  padding: 16px;
  margin: 24px 0;
  color: #e2e8f0;
  line-height: 1.6;
  font-size: 0.9rem;
}

.info-alert svg {
  color: #06b6d4;
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-alert {
  display: flex;
  gap: 12px;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: var(--border-radius-sm);
  padding: 16px;
  margin: 24px 0;
  color: #e2e8f0;
  line-height: 1.6;
  font-size: 0.9rem;
}

.warning-alert svg {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Documentation Table */
.docs-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 0.9rem;
}

.docs-table th {
  background: rgba(255, 255, 255, 0.03);
  text-align: left;
  padding: 12px 16px;
  font-weight: 700;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.docs-table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  line-height: 1.5;
}

.docs-table tr:hover {
  background: rgba(255, 255, 255, 0.01);
}

.docs-table code {
  background: rgba(6, 182, 212, 0.08);
  color: #06b6d4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

/* Fenced Code block formatting */
.code-block {
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-sm);
  padding: 16px;
  overflow-x: auto;
  margin: 20px 0;
}

.code-block code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.5;
}

/* Formulas grid */
.formulas-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 20px 0;
}

.formula-card {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--border-radius-sm);
  padding: 16px;
}

.formula-card h5 {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.formula-math {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  text-align: center;
  margin: 0 0 10px 0;
  color: #06b6d4;
}

.formula-note {
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 992px) {
  .docs-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .docs-content {
    padding: 24px 16px;
  }
  .docs-body {
    padding: 20px;
  }
  .formulas-grid {
    grid-template-columns: 1fr;
  }
}
</style>
