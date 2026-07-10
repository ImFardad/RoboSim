# 🤖 RoboSim

> A programming-competition simulation platform where players code the "brains" of robots in TypeScript to battle in a deterministic, tick-based 2D arena.

RoboSim is a programming-game platform inspired by games like Robocode, Battlecode, and Halite. This repository implements a robust, secure, and modern monorepo architecture featuring a high-performance simulation engine, secure user authentication, database persistence, and a premium cyber-cockpit user dashboard.

---

## 🚀 Key Features

*   **🎮 Deterministic 2D Battle Arena**: Physics, collisions, and gameplay elements are 100% deterministic (using a seeded PRNG), ensuring perfectly reproducible match replays.
*   **💻 Monaco Code Editor Workspace**: A complete in-browser IDE with Monaco Editor, syntax highlighting, autocompletion, local changes caching, and file explorer sidebar.
*   **📡 Drag-and-Drop Telemetry HUD**: Floating HUD overlay showing real-time speed (m/s), acceleration (m/s²), chassis health (HP), energy units (EU), and distance scanner readouts (m) utilizing pointer events.
*   **⚙️ Physics Speed Multipliers**: Fast-forward and slow-motion controls (0.5x, 1x, 2x, 4x) running on correct physics step calculations.
*   **🔒 Secure JWT Authentication**: Full signup, login, and session persistence using JSON Web Tokens (JWT) and hashed passwords (`bcryptjs`).
*   **💾 Database Persistence**: Managed via Sequelize ORM with SQLite database integration.
*   **🎨 Premium Cyber-Dashboard**: Fully responsive dark-themed dashboard utilizing glassmorphism cards, micro-animations, custom input validation modals, and real-time password strength checks.
*   **🧩 Micro-Component Architecture**: Extremely modular and lightweight Vue 3 component structures built for performance and high maintainability.

---

## 🧱 Monorepo Architecture

```
RoboSim/
├── frontend/                  # Responsive SPA Client (Vue 3 + Vite + TypeScript)
│   ├── public/
│   │   ├── avatars/           # Origami robot profiles
│   │   └── favicon.svg        # Custom robot favicon logo
│   ├── src/
│   │   ├── components/        # UI components (BaseInput, AppHeader, TelemetryHUD)
│   │   ├── router/            # Vue Router config with authentication guards
│   │   ├── utils/             # Reactive session store and simulation physics
│   │   ├── views/             # Core pages (Login, Dashboard, Lab, Docs, Playground)
│   │   ├── App.vue            # Entry component restoring sessions
│   │   └── main.ts            # Bootstraps router, local fonts, and CSS
│   └── index.html
│
├── backend/                   # RESTful API Server (Express.js 5 + TypeScript + SQLite)
│   ├── src/
│   │   ├── db.ts              # Sequelize connection configurations
│   │   ├── index.ts           # App bootstrapper and route bindings
│   │   ├── middleware/        # JWT auth verification middleware
│   │   ├── models/            # Database schema definitions (User, Robot, Script)
│   │   └── routes/            # REST endpoint routers (auth, robot, scripts)
│   ├── .env.example           # Shared environment configurations
│   └── package.json
│
├── docs/                      # Platform Architecture & API Guidelines
│   ├── architecture.md        # Technical roadmap and architecture goals (English)
│   ├── auth-system.md         # Detailed Authentication API specification (English)
│   ├── robot-lab.md           # Robot Laboratory upgrade formulas & consumption (English)
│   ├── robot-system.md        # Robot Model and Upgrade APIs (English)
│   └── script-system.md       # Script Model and Code Playground APIs (English)
│
└── README.md                  # Root documentation (English)
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The server runs locally at `http://localhost:3000` and creates the `database.sqlite` file automatically.*

### 2. Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client dashboard opens locally at `http://localhost:5173`.*

---

## 📡 API Reference

Below is a summary of the core endpoints. For detailed payload schema and example payloads, refer to the respective guides in the `docs/` folder.

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Validates user information, hashes password, and creates account. Returns JWT. |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT. |
| `GET` | `/api/auth/me` | JWT Token | Returns authenticated commander profile info. |
| `GET` | `/api/robot` | JWT Token | Returns current active robot upgrades and components. |
| `PUT` | `/api/robot` | JWT Token | Updates robot component levels (Body, Engine, Battery, etc.). |
| `GET` | `/api/scripts` | JWT Token | Lists all saved custom scripts for the commander. |
| `POST` | `/api/scripts` | JWT Token | Creates a new TypeScript/JavaScript robot script. |
| `PUT` | `/api/scripts/:id` | JWT Token | Updates code content or renames a script file. |
| `DELETE` | `/api/scripts/:id` | JWT Token | Deletes a script file from the database. |
| `GET` | `/api/health` | Public | Returns server health and timestamps. |

---

## 🗺️ Project Roadmap

- [x] **Phase 1**: Initial Scaffold (Monorepo setup, local typography, health APIs)
- [x] **Phase 2**: Authentication & Profile (Sequelize/SQLite, JWT, session router guards)
- [x] **Phase 3**: Brain Laboratory (3D-like canvas visualizer, steering angle delay, hardware mass & speed formulas)
- [x] **Phase 4**: Monaco Scripting Playground (TypeScript Monaco compiler, file explorer, dirty indicators, pointer Telemetry HUD)
- [ ] **Phase 5**: Headless Combat Engine (`sim-core` logic, discrete tick loop, bullet raycasts, weapon subsystems)
- [ ] **Phase 6**: Replays, Battle Matchmaking, and Global Leaderboards

---

## 📄 License

Proprietary platform. © 2026 RoboSim Team. All rights reserved.
