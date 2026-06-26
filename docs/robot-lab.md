# Robot Construction Laboratory Specification

This document defines the physics equations, upgrade progression, weight structures, battery consumption, and visual rendering parameters for the **Robot Construction Laboratory**.

---

## 1. Physical Attributes & Component Formulas

A robot's physical attributes are calculated dynamically from the upgrade levels of its components.

### Modular Weight System
The total mass of the robot is the sum of the individual weights of all components:
$$\text{Total Weight} = W_{\text{body}} + W_{\text{battery}} + W_{\text{engine}} + W_{\text{steering}} + W_{\text{brain}} + W_{\text{sensors}} + \sum W_{\text{additional}}$$

Where the default component weights are:
- $W_{\text{engine}} = 5 \text{ kg}$ (Fixed)
- $W_{\text{steering}} = 5 \text{ kg}$ (Fixed)
- $W_{\text{brain}} = 2 \text{ kg}$ (Fixed)
- $W_{\text{sensors}} = 3 \text{ kg}$ (Fixed)
- $\sum W_{\text{additional}} = 0 \text{ kg}$ (Reserved for future sensor and equipment attachments)

---

### A. Body (Chassis) - 5 Levels
Defines the robot's health (impact durability) and chassis weight.
- **Base HP**: $100 \text{ HP}$ (Level 1)
- **Base Weight**: $50 \text{ kg}$ (Level 1)
- **Upgrades**:
  - Each level adds $+20\%$ to Max HP (cumulative).
  - Each level adds $+10\%$ to Body Weight (cumulative).
- **Formulas**:
  - $\text{Max HP} = 100 \times (1 + (\text{Level} - 1) \times 0.20)$
  - $W_{\text{body}} = 50 \times (1.10)^{\text{Level} - 1}$

| Level | Max HP | Body Weight ($W_{\text{body}}$) |
|:---:|:---:|:---:|
| 1 (Default) | $100 \text{ HP}$ | $50.00 \text{ kg}$ |
| 2 | $120 \text{ HP}$ | $55.00 \text{ kg}$ |
| 3 | $140 \text{ HP}$ | $60.50 \text{ kg}$ |
| 4 | $160 \text{ HP}$ | $66.55 \text{ kg}$ |
| 5 | $180 \text{ HP}$ | $73.20 \text{ kg}$ |

---

### B. Battery (Power Core) - 5 Levels
Stores the electrical charge of the robot. Has no visual rendering on the canvas.
- **Base Capacity**: $60,000 \text{ Energy Units (EU)}$ (Level 1)
- **Base Weight**: $10 \text{ kg}$ (Level 1)
- **Upgrades**:
  - Each level adds $+25\%$ to Capacity (cumulative).
  - Each level adds $+15\%$ to Battery Weight (cumulative).
- **Formulas**:
  - $\text{Capacity} = 60,000 \times (1 + (\text{Level} - 1) \times 0.25)$
  - $W_{\text{battery}} = 10 \times (1.15)^{\text{Level} - 1}$

| Level | Capacity | Battery Weight ($W_{\text{battery}}$) |
|:---:|:---:|:---:|
| 1 (Default) | $60,000 \text{ EU}$ | $10.00 \text{ kg}$ |
| 2 | $75,000 \text{ EU}$ | $11.50 \text{ kg}$ |
| 3 | $90,000 \text{ EU}$ | $13.23 \text{ kg}$ |
| 4 | $105,000 \text{ EU}$ | $15.21 \text{ kg}$ |
| 5 | $120,000 \text{ EU}$ | $17.49 \text{ kg}$ |

---

### C. Brain (Processor) - 4 Levels
Determines maximum concurrent tasks (files containing controller code executing at the same time).
- **Base Tasks**: $2$ concurrent threads (Level 1)
- **Upgrades**: Each level adds $+1$ concurrent thread.
- **Formulas**:
  - $\text{Max Concurrent Tasks} = 2 + (\text{Level} - 1)$
- **Weight**: Fixed $2 \text{ kg}$.

| Level | Max Tasks | Weight |
|:---:|:---:|:---:|
| 1 (Default) | $2$ Tasks | $2.0 \text{ kg}$ |
| 2 | $3$ Tasks | $2.0 \text{ kg}$ |
| 3 | $4$ Tasks | $2.0 \text{ kg}$ |
| 4 | $5$ Tasks | $2.0 \text{ kg}$ |

---

### D. Rear Wheels (Engine Power) - 5 Levels
Provides drive thrust to accelerate the robot.
- **Base Power**: $100 \text{ N}$ (Newton force, Level 1)
- **Upgrades**: Each level adds $+5\%$ to engine power.
- **Formula**:
  - $\text{Engine Power} = 100 \times (1 + (\text{Level} - 1) \times 0.05)$
- **Weight**: Fixed $5 \text{ kg}$.
- **Composite Mobility Stats**:
  - $\text{Acceleration} = \frac{\text{Engine Power}}{\text{Total Weight}} \text{ (m/s²)}$
  - $\text{Top Speed} = \frac{\text{Engine Power}}{\text{Total Weight} \times 0.3} \text{ (m/s)}$

| Level | Engine Power | Weight |
|:---:|:---:|:---:|
| 1 (Default) | $100 \text{ N}$ | $5.0 \text{ kg}$ |
| 2 | $105 \text{ N}$ | $5.0 \text{ kg}$ |
| 3 | $110 \text{ N}$ | $5.0 \text{ kg}$ |
| 4 | $115 \text{ N}$ | $5.0 \text{ kg}$ |
| 5 | $120 \text{ N}$ | $5.0 \text{ kg}$ |

---

### E. Front Wheels (Steering Servos) - 3 Levels
Defines steering wheel deflection range and response speed.
- **Base Range**: $120^\circ$ ($\pm 60^\circ$ from center, Level 1)
- **Base Steering Speed**: $45^\circ/\text{sec}$ (Level 1)
- **Upgrades**:
  - Level 2: $140^\circ$ range ($\pm 70^\circ$), $65^\circ/\text{sec}$ steering speed.
  - Level 3: $160^\circ$ range ($\pm 80^\circ$), $90^\circ/\text{sec}$ steering speed.
- **Weight**: Fixed $5 \text{ kg}$.

| Level | Steering Range | Steering Speed | Weight |
|:---:|:---:|:---:|:---:|
| 1 (Default) | $120^\circ$ | $45^\circ/\text{s}$ | $5.0 \text{ kg}$ |
| 2 | $140^\circ$ | $65^\circ/\text{s}$ | $5.0 \text{ kg}$ |
| 3 | $160^\circ$ | $90^\circ/\text{s}$ | $5.0 \text{ kg}$ |

---

### F. Distance Sensors (Static Core Device)
Equips the robot with 4 orthogonal distance scanners (Front, Back, Left, Right).
- **Level**: Static (no upgrades).
- **Weight**: Fixed $3 \text{ kg}$.
- *Note: Sensors have no visual rendering on the laboratory canvas per user request.*

---

## 2. Power Consumption Calculations

Energy units are consumed based on active component usage. Matches last at most 10 minutes (600 seconds).

1. **Idle Power Consumption ($P_{\text{idle}}$)**:
   - Brain active + 4 distance sensors.
   - Total idle consumption = $20 \text{ EU/s}$.
     - Brain: $12 \text{ EU/s}$
     - 4 distance sensors: $2 \text{ EU/s}$ each ($8 \text{ EU/s}$ total).
   - Under Level 1 battery ($60,000 \text{ EU}$), the idle run time is:
     $$\text{Time}_{\text{idle}} = \frac{60000 \text{ EU}}{20 \text{ EU/s}} = 3000 \text{ s} \text{ (50 minutes)}$$

2. **Engine Power Consumption ($P_{\text{engine}}$)**:
   - Base engine consumption (Level 1) at $100\%$ throttle = $280 \text{ EU/s}$.
   - Upgrading engine level increases consumption rate by $+5\%$ per level (representing high-output motor coils).
     $$P_{\text{engine}}(\text{Level}, \text{Throttle}) = 280 \times (1 + (\text{Level} - 1) \times 0.05) \times \text{Throttle} \text{ EU/s}$$
   - Total consumption rate at full throttle for Level 1 components:
     $$P_{\text{total}} = P_{\text{idle}} + P_{\text{engine}}(1, 1.0) = 20 + 280 = 300 \text{ EU/s}$$
   - Continuous full throttle duration under Level 1 battery:
     $$\text{Time}_{\text{full}} = \frac{60000 \text{ EU}}{300 \text{ EU/s}} = 200 \text{ s} \text{ (3 minutes and 20 seconds)}$$

3. **Steering Servos Consumption**:
   - Small transient consumption when steering wheels are turning = $30 \text{ EU/s}$ (negligible).

---

## 3. 2D Canvas Renderer Specification

The Left Panel renders the top-down physical assembly of the robot in real-time.
The canvas runs a render loop using `requestAnimationFrame` to animate wheel angles.

### Rendering Elements:
1. **Body (Chassis)**:
   - Drawn as a centered square ($160\text{px} \times 160\text{px}$).
   - Renders with rounded corners and a dark carbon plate style.
   - Higher levels add armored plating layers, border details, and titanium accents.
2. **Brain (Processor)**:
   - Drawn as a pulsing circular microchip at the exact center ($45\text{px}$ diameter).
   - Higher levels render more internal neon-cyan paths (matching concurrent tasks count).
3. **Rear Wheels (Engine)**:
   - Two rectangles ($24\text{px} \times 48\text{px}$) on the lower-left and lower-right edges of the body.
   - Higher levels add dual-tire treads or larger engine gear rims.
4. **Front Wheels (Steering)**:
   - Two rectangles ($24\text{px} \times 48\text{px}$) on the upper-left and upper-right edges of the body.
   - **Steering Simulation**: Maintains a `currentSteeringAngle` state. In each animation frame, `currentSteeringAngle` moves towards a `targetSteeringAngle` (bound to a UI slider) at the current steering speed (e.g. $45^\circ/\text{s}$, $65^\circ/\text{s}$, $90^\circ/\text{s}$). The front wheels are drawn rotated around their centers by `currentSteeringAngle`.

---

## 4. Robot Assembly Profiles (Examples)

The following three examples illustrate how different component levels balance mobility, durability, and energy usage.

### Profile A: "Base Crawler" (Starter Kit - All Level 1)
- **Levels**: Body: 1 | Battery: 1 | Brain: 1 | Engine: 1 | Steering: 1
- **Weights**: Body ($50\text{kg}$) + Battery ($10\text{kg}$) + Fixed ($15\text{kg}$) + Additional ($0\text{kg}$) = **$75.0\text{ kg}$**
- **Durability**: **$100\text{ HP}$**
- **Battery Capacity**: **$60,000\text{ EU}$**
- **Engine Power**: **$100\text{ N}$**
- **Acceleration**: **$1.33\text{ m/s²}$**
- **Top Speed**: **$4.44\text{ m/s}$**
- **Steering**: Max angle $\pm 60^\circ$ at $45^\circ/\text{s}$
- **Concurrency**: 2 Tasks
- **Battery Life**:
  - Idle: **50.0 Minutes**
  - Continuous 100% Throttle: **3 Minutes 20 Seconds**

---

### Profile B: "Heavy Juggernaut" (Tanky & Power-Optimized)
- **Levels**: Body: 5 | Battery: 4 | Brain: 2 | Engine: 5 | Steering: 1
- **Weights**: Body ($73.2\text{kg}$) + Battery ($15.2\text{kg}$) + Fixed ($15\text{kg}$) + Additional ($0\text{kg}$) = **$103.4\text{ kg}$**
- **Durability**: **$180\text{ HP}$**
- **Battery Capacity**: **$105,000\text{ EU}$**
- **Engine Power**: **$120\text{ N}$**
- **Acceleration**: **$1.16\text{ m/s²}$** (Slower acceleration due to heavy armor weight)
- **Top Speed**: **$3.87\text{ m/s}$**
- **Steering**: Max angle $\pm 60^\circ$ at $45^\circ/\text{s}$
- **Concurrency**: 3 Tasks
- **Battery Life**:
  - Idle: **87.5 Minutes**
  - Continuous 100% Throttle: **4 Minutes 55 Seconds**

---

### Profile C: "Swift Interceptor" (Lightweight Speedster)
- **Levels**: Body: 1 | Battery: 2 | Brain: 4 | Engine: 4 | Steering: 3
- **Weights**: Body ($50.0\text{kg}$) + Battery ($11.5\text{kg}$) + Fixed ($15\text{kg}$) + Additional ($0\text{kg}$) = **$76.5\text{ kg}$**
- **Durability**: **$100\text{ HP}$**
- **Battery Capacity**: **$75,000\text{ EU}$**
- **Engine Power**: **$115\text{ N}$**
- **Acceleration**: **$1.50\text{ m/s²}$** (High acceleration due to low weight)
- **Top Speed**: **$5.01\text{ m/s}$**
- **Steering**: Max angle $\pm 80^\circ$ at $90^\circ/\text{s}$
- **Concurrency**: 5 Tasks
- **Battery Life**:
  - Idle: **62.5 Minutes**
  - Continuous 100% Throttle: **3 Minutes 39 Seconds**

---

## 5. Specification Comparison Table

| Attribute | Base Crawler | Heavy Juggernaut | Swift Interceptor |
| :--- | :---: | :---: | :---: |
| **Component Levels** | `[1, 1, 1, 1, 1]` | `[5, 4, 2, 5, 1]` | `[1, 2, 4, 4, 3]` |
| **Structural Health (HP)** | $100$ | $180$ | $100$ |
| **Total Weight (kg)** | $75.00$ | $103.41$ | $76.50$ |
| **Acceleration (m/s²)** | $1.33$ | $1.16$ | $1.50$ |
| **Top Speed (m/s)** | $4.44$ | $3.87$ | $5.01$ |
| **Steering Bounds** | $\pm 60^\circ$ | $\pm 60^\circ$ | $\pm 80^\circ$ |
| **Steering Speed** | $45^\circ/\text{s}$ | $45^\circ/\text{s}$ | $90^\circ/\text{s}$ |
| **Max Concurrent Tasks** | 2 | 3 | 5 |
| **Battery Capacity** | $60,000\text{ EU}$ | $105,000\text{ EU}$ | $75,000\text{ EU}$ |
| **Idle Duration** | $50.0\text{ min}$ | $87.5\text{ min}$ | $62.5\text{ min}$ |
| **Full Throttle Duration** | $3\text{m } 20\text{s}$ | $4\text{m } 55\text{s}$ | $3\text{m } 39\text{s}$ |
