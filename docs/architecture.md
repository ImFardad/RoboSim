# 🏗 RoboSim Architecture

Official design and architectural reference for the **RoboSim** platform — a deterministic, programming-competition simulation environment where commanders code the "brains" of their robots in TypeScript to compete in a 2D arena.

This document is maintained dynamically throughout the development lifecycle to record system blueprints, architecture decisions, technology stacks, project structure, and the overall roadmap.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Platform Objectives](#2-platform-objectives)
3. [Key Architectural Decisions](#3-key-architectural-decisions)
4. [Technology Stack](#4-technology-stack)
5. [Project Structure](#5-project-structure)
6. [Completed Features (Phases 1-3)](#6-completed-features-phases-1-3)
7. [Target Architecture](#7-target-architecture)
8. [Setup & Running Instructions](#8-setup--running-instructions)
9. [Development Roadmap](#9-development-roadmap)

---

## 1. Project Overview

**RoboSim** is a programming-game simulation platform. Commanders design and upload modular robot hardware upgrades and write autonomous decision logic scripts in TypeScript. The scripts run in a local sandbox to control the steering, propulsion, and scans of their robot in a top-down, discrete 2D arena.

The platform draws inspiration from games like **Robocode**, **Battlecode**, **Halite**, and **Core War**.

---

## 2. Platform Objectives

### Core Goals

| # | Goal | Description |
|---|-----|-------------|
| 1 | **2D Battle Arena** | Top-down physical environment where robots navigate, scan, and compete. |
| 2 | **Programmable Decision Scripts** | Commanders code autonomous logic scripts to control robot actuators. |
| 3 | **Online Tournament Platform** | Code uploads, server-side match execution, replay logs, and rankings. |
| 4 | **100% Deterministic Engine** | Fully reproducible match runs using a seeded PRNG for replay integrity. |

### Design Guidelines
*   **Zero External Dependencies at Runtime**: No external CDNs, fonts, or third-party APIs are loaded during runtime. Everything (including typography) is hosted locally.
*   **Separation of Engine from Visuals**: The physics simulation engine is decoupled from the DOM. It can run in the browser canvas or as a headless CLI process in Node.js.
*   **High Aesthetics**: Sleek dark-mode dashboard interfaces utilizing glassmorphism cards, micro-animations, custom input validation modals, and draggable elements.

---

## 3. Key Architectural Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Arena Dimension** | 2D Top-down Canvas | Simplicity, high render performance in browsers. |
| **Time Model** | Discrete Tick-based (60 ticks/s) | Balances smooth physics with simple state delta tracking. |
| **Robot Language** | TypeScript / JavaScript | Shared with the core codebase, quick learning curve, easy sandbox integration. |
| **قطعیت (Determinism)** | Seeded mulberry32 PRNG | Allows compact replay logs (Seed + Code) and server validation. |
| **Script Sandbox** | Context-bound Function (`think(sensors)`) | Secure execution environment. Can be migrated to a Web Worker context. |

---

## 4. Technology Stack

### Frontend
*   **Vue 3**: Composition API (reactive script setups) for modular layout structures.
*   **Vite**: Rapid hot-module reloading and bundling.
*   **TypeScript**: Static analysis and type safety for both app components and user scripts.
*   **@fontsource/vazirmatn**: Local typography bundle for clean layout styling.
*   **Monaco Editor**: Integrated code editor providing syntax highlighting, auto-completion, and command bindings (Ctrl+S saving).

### Backend
*   **Express.js 5**: High-performance routing framework.
*   **Sequelize ORM**: Connects to an **SQLite** database storing credentials, robot specs, and script codes.
*   **bcryptjs & JWT**: Secure password hashing and token-based API authentication.

---

## 5. Project Structure

```
RoboSim/
├── frontend/                  # SPA Client (Vue 3 + Vite + TypeScript)
│   ├── public/
│   │   ├── avatars/           # Origami robot profiles
│   │   └── favicon.svg        # Robot favicon
│   ├── src/
│   │   ├── components/        # Reusable UI widgets (Toast, AppHeader, AppSidebar, TelemetryHUD)
│   │   ├── router/            # Vue Router with authenticated view guards
│   │   ├── utils/             # auth logic, simulation math, API fetch utilities
│   │   ├── views/             # Views (Login, Register, Dashboard, Lab, Docs, Playground)
│   │   ├── App.vue            # Layout root with session bootsrap
│   │   └── main.ts            # App initializer
│   └── index.html
│
├── backend/                   # API Server (Express.js 5 + TS + SQLite)
│   ├── src/
│   │   ├── db.ts              # SQLite database configuration
│   │   ├── index.ts           # Server start, cors, health, script routes
│   │   ├── middleware/        # JWT validation layers
│   │   ├── models/            # Database schema (User, Robot, Script)
│   │   └── routes/            # REST routes (auth, robot, scripts)
│   ├── database.sqlite        # Active local database instance
│   └── package.json
│
├── docs/                      # Technical Documentation
│   ├── architecture.md        # This file (English Architecture Blueprint)
│   ├── auth-system.md         # API Authentication Specifications
│   ├── robot-lab.md           # Robot Laboratory upgrade specs and formulas
│   └── robot-system.md        # Robot Model and Upgrade APIs
│
└── README.md                  # Main developer guide
```

---

## 6. Completed Features (Phases 1-3)

### ✅ Authentication & Session Guards
*   Local database persistence utilizing SQLite and Sequelize.
*   Secure JWT-based login, signup, and validation flows.
*   Premium login card with real-time password strength algorithms.
*   Router route guards preventing unauthorized navigation.

### ✅ Brain Laboratory (Robot Assembly Lab)
*   Modular upgrades (Body, Battery, Brain, Engine, Steering) with customized specs.
*   Interactive 2D Canvas rendering the active robot color, wheel deflection, and steering lag.
*   Dynamic mass, acceleration, top speed, and power drain formula engines.
*   Glassmorphic UI cards stretching to full screen width with aligned headings.

### ✅ Monaco Scripting Playground (Arena)
*   **File Explorer Sidebar**: SQLite-backed script listing with file create, rename, and delete options.
*   **Monaco Code Editor**: Full code editing panel with TypeScript validation, autocomplete, and local caching.
*   **Dirty Star Indicators**: Star marker `*` displayed next to script names in the explorer tree and header workspace title if modifications are unsaved.
*   **Glassmorphic Confirm Dialogs**: Replaces default browser alerts/prompts with dark blurred modals checking for unsaved edits.
*   **Telemetry HUD**: Floating HUD overlay showing real-time speed (m/s), acceleration (m/s²), chassis health (HP), energy units (EU), and distance scanner readouts (m). Binds drag-and-drop actions to pointer move listeners.
*   **Tick Physics Loop**: Supports slow-motion and high-speed simulation speed multipliers (0.5x, 1x, 2x, 4x) running on correct physics substeps.

---

## 7. Target Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (UI + Canvas Renderer)                      │
│   • Displays 2D Arena & visualizes raycasts.        │
│   • Manages simulation state controls (Speed).      │
│   • Monaco Code editor for script programming.      │
└──────────────┬──────────────────────────────────────┘
               │ HTTP / SQLite Sync
┌──────────────▼──────────────────────────────────────┐
│  Backend (Express)                                   │
│   • Syncs robot upgrades and script buffers.        │
│   • Headless execution of matches.                  │
│   • Stores match logs and player rankings.          │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│  Simulation Engine (sim-core)                        │
│   ⭐ DOM-free, runnable in both Node.js & browser.   │
│   • Discrete tick calculations + seeded PRNG.       │
│   • Bicycle kinematic physics and wall collisions.  │
│   • HP Integrity & EU Battery core systems.         │
└─────────────────────────────────────────────────────┘
```

---

## 8. Setup & Running Instructions

### Prerequisites
*   Node.js v18 or higher
*   npm v9 or higher

### Running Backend
```bash
cd backend
npm install
npm run dev
```
*Runs at `http://localhost:3000` and creates `database.sqlite` automatically.*

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```
*Runs at `http://localhost:5173`.*

---

## 9. Development Roadmap

- [x] **Phase 1** — Monorepo Scaffolding (frontend, backend, docs)
- [x] **Phase 2** — Authentication & Session Guards
- [x] **Phase 3** — Brain Laboratory (Robot Canvas & upgraded physics formulas)
- [x] **Phase 3.5** — Scripting Playground (Monaco, file tree, HUD overlay, glassmorphic modals)
- [ ] **Phase 4** — Platform Simulation Engine (sim-core)
  - [ ] Game types & multiplayer configs.
  - [ ] Weapon subsystems & target scanning radars.
  - [ ] Built-in combat bot scripts (sitting ducks, spinner bots, trackers).
- [ ] **Phase 5** — Tournament matchmaking, rankings, and replay viewer.

---

*Last Updated: July 2026 - Phase 3.5 Completed*
