# 🤖 RoboSim

> A programming-competition simulation platform where players code the "brains" of robots in TypeScript to battle in a deterministic, tick-based 2D arena.

RoboSim is a programming-game platform inspired by games like Robocode, Battlecode, and Halite. This repository implements a robust, secure, and modern monorepo architecture featuring a high-performance simulation engine, secure user authentication, database persistence, and a premium cyber-cockpit user dashboard.

---

## 🚀 Key Features

*   **🎮 Deterministic 2D Battle Arena**: Physics, collisions, and gameplay elements are 100% deterministic (using a seeded PRNG), ensuring perfectly reproducible match replays.
*   **🔒 Secure JWT Authentication**: Full signup, login, and session persistence using JSON Web Tokens (JWT) and hashed passwords (`bcryptjs`).
*   **💾 Database Persistence**: Managed via Sequelize ORM with SQLite database integration.
*   **🎨 Premium Cyber-Dashboard**: Fully responsive dark-themed dashboard utilizing glassmorphism cards, micro-animations, input validators, and real-time password strength checks.
*   **🧩 Micro-Component Architecture**: Extremely modular and lightweight Vue 3 component structures built for performance and high maintainability.
*   **🇮🇷 RTL & Farsi Ready**: Fully localized interface supporting Right-To-Left layouts and optimized local typography (Vazirmatn).

---

## 🧱 Monorepo Architecture

```
RoboSim/
├── frontend/                  # Responsive SPA Client (Vue 3 + Vite + TypeScript)
│   ├── public/
│   │   └── favicon.svg        # Custom robot favicon logo
│   ├── src/
│   │   ├── assets/
│   │   │   └── auth-theme.css # CSS variables, animations, glassmorphism design system
│   │   ├── components/        # Micro-components (BaseInput, BaseButton, GlassCard, etc.)
│   │   ├── router/            # Vue Router config with authentication guards
│   │   ├── utils/             # Reactive session and token store managers
│   │   ├── views/             # Core pages (Login, Register, Dashboard)
│   │   ├── App.vue            # Entry component restoring sessions
│   │   └── main.ts            # Bootstraps router, local fonts, and CSS
│   └── index.html
│
├── backend/                   # RESTful API Server (Express.js 5 + TypeScript + SQLite)
│   ├── src/
│   │   ├── db.ts              # Sequelize connection configurations
│   │   ├── index.ts           # App bootstrapper and route bindings
│   │   ├── middleware/        # JWT auth verification middleware
│   │   ├── models/            # Database schema definitions (User model)
│   │   └── routes/            # REST endpoint routers (register, login, me)
│   ├── .env.example           # Shared environment configurations
│   └── package.json
│
├── docs/                      # Platform Architecture & API Guidelines
│   ├── architecture.md        # Technical roadmap and architecture goals (Farsi)
│   └── auth-system.md         # Detailed API specification & DB models (English)
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

Below is a summary of the core authentication endpoints. For detailed payload schema and example payloads, refer to [docs/auth-system.md](./docs/auth-system.md).

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Validates user information, hashes password, and creates account. Returns JWT. |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT. |
| `GET` | `/api/auth/me` | JWT Token | Validates current token and returns authenticated commander profile info. |
| `GET` | `/api/health` | Public | Returns server health and timestamps. |

---

## 🗺️ Project Roadmap

- [x] **Phase 1**: Initial Scaffold (Monorepo setup, Local Farsi fonts, health APIs)
- [x] **Phase 2**: Authentication & Cyber-Dashboard (Sequelize/SQLite, JWT, Micro-componentized Vue 3 views)
- [ ] **Phase 3**: Simulation Engine Core (`sim-core` logic, discrete tick loop, physics, PRNG seeders)
- [ ] **Phase 4**: Code Sandbox & Worker (Secure script environment for TS robot brains)
- [ ] **Phase 5**: Canvas Renderer (Real-time 2D top-down battlefield render on Frontend)
- [ ] **Phase 6**: Replays, Battle Matchmaking, and Global Leaderboards

---

## 📄 License

Proprietary platform. © 2026 RoboSim Team. All rights reserved.
