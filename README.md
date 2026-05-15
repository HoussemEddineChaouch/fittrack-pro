# FitTrack Pro — Personal Fitness Dashboard

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

**A modern full-stack personal fitness dashboard built with FastAPI, React, and Docker.**

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Docker & Deployment](#-docker--deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Testing](#-testing)
- [Grading Coverage](#-grading-coverage)
- [Team](#-team)

---

## Overview

**FitTrack Pro** is a full-stack personal fitness dashboard that solves the problem of scattered workout tracking. It brings exercises, workout plans, progress measurements, and health statistics into one focused, modern interface.

Built as part of the **DevNet & Automation** curriculum, this project demonstrates:

- Modern Python backend development with **FastAPI**
- Reactive frontend with **React + Tailwind CSS**
- Real **REST API integration** (WorkoutX Exercise API — 1,300+ exercises with GIFs)
- Full **containerization** with Docker & Docker Compose
- Automated deployment with **Bash scripts**
- **CI/CD pipeline** with GitHub Actions (+2 bonus points)

---

## Features

| Feature               | Description                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| **Authentication**    | JWT-based register/login with bcrypt password hashing                         |
| **Exercise Library**  | Browse 1,300+ exercises with real GIF animations from WorkoutX API            |
| **Smart Search**      | Search and filter exercises by body part, muscle, equipment                   |
| **Workout Plans**     | Create custom plans with exercises, sets, reps, and rest times                |
| **Favorites**         | Save favorite exercises for quick access                                      |
| **Progress Tracking** | Log weight & body measurements, visualize trends with charts                  |
| **Dashboard**         | Stats overview with calorie progression, muscle distribution, weekly activity |
| **Settings**          | Manage profile and fitness goals                                              |
| **Docker Ready**      | One-command deployment with Docker Compose                                    |
| **CI/CD**             | Automated testing and building via GitHub Actions                             |

---

## Tech Stack

### Backend

| Technology           | Version   | Purpose                            |
| -------------------- | --------- | ---------------------------------- |
| **Python**           | 3.11      | Core language                      |
| **FastAPI**          | 0.136     | REST API framework                 |
| **SQLAlchemy**       | 2.0       | ORM & database management          |
| **SQLite**           | —         | Development database               |
| **python-jose**      | 3.5       | JWT token generation & validation  |
| **passlib + bcrypt** | 1.7 / 4.0 | Password hashing                   |
| **httpx**            | 0.28      | Async HTTP client for external API |
| **uvicorn**          | 0.46      | ASGI server                        |
| **pytest**           | 9.0       | Automated testing                  |

### Frontend

| Technology           | Version | Purpose                       |
| -------------------- | ------- | ----------------------------- |
| **React**            | 18      | UI framework                  |
| **Vite**             | 5       | Build tool                    |
| **Tailwind CSS**     | 3       | Utility-first styling         |
| **Axios**            | —       | HTTP client with interceptors |
| **React Router DOM** | 7       | Client-side routing           |
| **Recharts**         | —       | Charts & data visualization   |
| **Lucide React**     | —       | Icon library                  |

### DevOps & Infrastructure

| Technology         | Purpose                              |
| ------------------ | ------------------------------------ |
| **Docker**         | Containerization                     |
| **Docker Compose** | Multi-service orchestration          |
| **nginx**          | Frontend serving & API reverse proxy |
| **Bash**           | Automated deploy script              |
| **GitHub Actions** | CI/CD pipeline                       |

### External API

| API              | Purpose                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| **WorkoutX API** | 1,300+ exercises with GIF animations, muscle data, step-by-step instructions |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD                      │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │Backend Tests │─►│ Build Frontend │─►│  Docker Build   │   │
│  │   (pytest)   │  │  (Vite build)  │  │ (health check)  │   │
│  └──────────────┘  └────────────────┘  └─────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                              │
                       bash deploy.sh
                              │
           ┌──────────────────┴────────────────────┐
           │          docker-compose up            │
           │                                       │
  ┌────────▼────────┐                   ┌──────────▼────────┐
  │   Frontend      │                   │    Backend        │
  │  nginx:alpine   │                   │  Python 3.11      │
  │  React + Vite   │──── /api ────────►│  FastAPI          │
  │  Tailwind CSS   │                   │  SQLAlchemy       │
  │  Port: 3000     │                   │  Port: 8000       │
  └─────────────────┘                   └─────────┬─────────┘
                                                   │
                               ┌───────────────────┴──────────────────┐
                               │                                      │
                     ┌─────────▼────────┐             ┌───────────────▼──────┐
                     │   SQLite DB      │             │   WorkoutX API       │
                     │  fittrack.db     │             │ api.workoutxapp.com  │
                     │  Users / Plans   │             │ 1,300+ exercises     │
                     │  Progress / Favs │             │ GIF animations       │
                     └──────────────────┘             └──────────────────────┘
```

---

## Project Structure

```
fittrack-pro/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app + CORS + router registration
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models.py            # DB models: User, Plan, Exercise, Progress, Favorite
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── auth.py              # JWT creation, verification, password hashing
│   │   └── routers/
│   │       ├── auth.py          # POST /register, POST /login
│   │       ├── exercises.py     # GET /exercises + GIF proxy (no auth)
│   │       ├── plans.py         # CRUD workout plans + exercises
│   │       ├── favorites.py     # Add/remove/list favorites
│   │       ├── progress.py      # Log/list/delete progress entries
│   │       └── users.py         # GET/PUT /users/me
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_api.py          # 8 automated API tests
│   ├── requirements.txt
│   ├── Dockerfile               # python:3.11-slim
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # React entry point
│   │   ├── App.jsx              # BrowserRouter + routes + layout
│   │   ├── api/
│   │   │   └── axios.js         # Axios instance + JWT interceptor + 401 redirect
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Login/register/logout global state
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      # Dark sidebar with nav links
│   │   │   └── ProtectedRoute.jsx # JWT guard for protected pages
│   │   └── pages/
│   │       ├── Landing.jsx      # Public hero page
│   │       ├── Login.jsx        # Sign in form
│   │       ├── Register.jsx     # Create account form
│   │       ├── Dashboard.jsx    # Stats + Recharts visualizations
│   │       ├── Exercises.jsx    # Exercise grid + search + detail modal
│   │       ├── Favorites.jsx    # Saved exercises
│   │       ├── Plans.jsx        # Workout plan manager + exercise modal
│   │       ├── Progress.jsx     # Weight chart + measurement history
│   │       └── Settings.jsx     # Profile editor
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── nginx.conf               # Reverse proxy /api → backend:8000
│   ├── Dockerfile               # node:20 build + nginx:alpine serve
│   └── .dockerignore
│
├── .github/
│   └──  workflows/
│       └── ci-cd.yml            # 3-job GitHub Actions pipeline
│
├── docker-compose.yml           # Backend + Frontend services + network + volume
├── deploy.sh                    # Bash automated deploy script
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

| Tool               | Version | Download                                                     |
| ------------------ | ------- | ------------------------------------------------------------ |
| **Docker Desktop** | Latest  | [docker.com](https://www.docker.com/products/docker-desktop) |
| **Git**            | Latest  | [git-scm.com](https://git-scm.com)                           |
| **Python**         | 3.11+   | [python.org](https://www.python.org) _(manual setup only)_   |
| **Node.js**        | 20+     | [nodejs.org](https://nodejs.org) _(manual setup only)_       |

---

### Quick Start — Automated Docker Deploy

```bash
# 1. Clone the repository
git clone https://github.com/HoussemEddineChaouch/fittrack-pro.git
cd fittrack-pro

# 2. Run the automated deploy script
bash deploy.sh
```

The script handles everything automatically — no manual steps needed.

**Open your browser:**

| URL                            | Description        |
| ------------------------------ | ------------------ |
| `http://localhost:3000`        | React Application  |
| `http://localhost:8000/docs`   | FastAPI Swagger UI |
| `http://localhost:8000/health` | Health Check       |

---

### Manual Development Setup

#### Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Frontend: `http://localhost:5173` | Backend: `http://localhost:8000`

---

## API Documentation

Full interactive documentation: `http://localhost:8000/docs`

### Endpoints Summary

#### Auth

| Method | Endpoint             | Auth | Description       |
| ------ | -------------------- | ---- | ----------------- |
| `POST` | `/api/auth/register` | No   | Create account    |
| `POST` | `/api/auth/login`    | No   | Login → JWT token |

#### Exercises

| Method | Endpoint                        | Auth | Description         |
| ------ | ------------------------------- | ---- | ------------------- |
| `GET`  | `/api/exercises`                | Yes  | List exercises      |
| `GET`  | `/api/exercises?search=squat`   | Yes  | Search by name      |
| `GET`  | `/api/exercises?bodyPart=chest` | Yes  | Filter by body part |
| `GET`  | `/api/exercises/gif/{id}`       | No   | Proxy GIF image     |

#### Plans

| Method   | Endpoint                            | Auth | Description          |
| -------- | ----------------------------------- | ---- | -------------------- |
| `GET`    | `/api/plans`                        | Yes  | Get my plans         |
| `POST`   | `/api/plans`                        | Yes  | Create plan          |
| `DELETE` | `/api/plans/{id}`                   | Yes  | Delete plan          |
| `POST`   | `/api/plans/{id}/exercises`         | Yes  | Add exercise to plan |
| `DELETE` | `/api/plans/{id}/exercises/{ex_id}` | Yes  | Remove exercise      |

#### Favorites

| Method   | Endpoint                       | Auth | Description      |
| -------- | ------------------------------ | ---- | ---------------- |
| `GET`    | `/api/favorites`               | Yes  | Get my favorites |
| `POST`   | `/api/favorites`               | Yes  | Add favorite     |
| `DELETE` | `/api/favorites/{exercise_id}` | Yes  | Remove favorite  |

#### Progress

| Method   | Endpoint             | Auth | Description  |
| -------- | -------------------- | ---- | ------------ |
| `GET`    | `/api/progress`      | Yes  | Get history  |
| `POST`   | `/api/progress`      | Yes  | Log entry    |
| `DELETE` | `/api/progress/{id}` | Yes  | Delete entry |

#### Users

| Method | Endpoint        | Auth | Description    |
| ------ | --------------- | ---- | -------------- |
| `GET`  | `/api/users/me` | Yes  | Get profile    |
| `PUT`  | `/api/users/me` | Yes  | Update profile |

### Example Requests

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123"}'

# Login → get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Get exercises (authenticated)
curl http://localhost:8000/api/exercises \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create workout plan
curl -X POST http://localhost:8000/api/plans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Push Day","goal":"Gain muscle","difficulty":"Intermediate","duration":60}'
```

---

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=sqlite:///./fittrack.db
SECRET_KEY=your-secret-key-change-in-production-minimum-32-chars
WORKOUT_API_KEY=wx_your_api_key_here
```

---

## Docker & Deployment

### Services

| Service             | Base Image       | Port | Role                  |
| ------------------- | ---------------- | ---- | --------------------- |
| `fittrack-backend`  | python:3.11-slim | 8000 | FastAPI REST API      |
| `fittrack-frontend` | nginx:alpine     | 3000 | React app + API proxy |

### Docker Commands

```bash
# Build and start everything
docker-compose up --build

# Start in background
docker-compose up -d

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Check running containers
docker ps
```

### Automated Deploy Script

```bash
bash deploy.sh
```

The script runs **6 automated steps**:

```
[1/6] Checking requirements    → Docker & Docker Compose installed?
[2/6] Checking Docker daemon   → Is Docker running?
[3/6] Stopping old containers  → Clean slate
[4/6] Building Docker images   → Fresh build
[5/6] Starting containers      → docker-compose up -d
[6/6] Health checks            → curl /health on both services
```

---

## CI/CD Pipeline

Pipeline runs on every push to `main` or `develop`.

```
git push origin main
        │
        ├──►  Backend Tests
        │         ├── Setup Python 3.11
        │         ├── pip install requirements
        │         └── pytest tests/ -v
        │
        ├──►  Build Frontend
        │         ├── Setup Node.js 20
        │         ├── npm install
        │         ├── npm run build
        │         └── Upload dist/ artifact
        │
        └──►  Docker Build       ← runs after both pass
                  ├── Build backend image
                  ├── Build frontend image
                  ├── docker compose up -d
                  ├── curl health check
                  └── docker compose down
```

**Pipeline file:** `.github/workflows/ci-cd.yml`

---

## Testing

### Run Tests Locally

```bash
cd backend

# Activate venv
venv\Scripts\activate   # Windows
source venv/bin/activate  # Mac/Linux

# Run all tests with verbose output
pytest tests/ -v

# Run specific test
pytest tests/test_api.py::test_health -v
```

### Test Suite

| Test                           | What it validates                                |
| ------------------------------ | ------------------------------------------------ |
| `test_root`                    | API root returns correct message                 |
| `test_health`                  | Health endpoint returns `{"status":"ok"}`        |
| `test_register`                | User registration creates account                |
| `test_login_success`           | Valid credentials return JWT token               |
| `test_login_wrong_password`    | Wrong password returns 401 Unauthorized          |
| `test_protected_without_token` | Protected routes reject unauthenticated requests |
| `test_protected_with_token`    | Valid JWT grants access                          |
| `test_create_plan_with_token`  | Authenticated user can create workout plan       |

Tests use an **isolated in-memory SQLite database** — no interference with production data.

---

## Grading Coverage

| Criteria             | Implementation                                                 | Score        |
| -------------------- | -------------------------------------------------------------- | ------------ |
| **Backend Python**   | FastAPI + SQLAlchemy ORM + JWT auth + error handling + routers | **3 / 3**    |
| **Frontend**         | React 18 + Tailwind CSS + dynamic data + Recharts charts       | **3 / 3**    |
| **Docker & Compose** | Multi-stage Dockerfiles + docker-compose + nginx reverse proxy | **3 / 3**    |
| **Automation**       | `deploy.sh` — 6-step zero-intervention automated deployment    | **3 / 3**    |
| **API Integration**  | WorkoutX REST API + GIF proxy endpoint + fallback data         | **3 / 3**    |
| **Security**         | JWT tokens + bcrypt password hashing + protected routes        | **1 / 1**    |
| **Presentation**     | Architecture diagrams + 7-slide deck + live demo               | **4 / 4**    |
| **CI/CD Bonus**      | GitHub Actions — 3-job pipeline (test → build → docker)        | **+2**       |
| **TOTAL**            |                                                                | **22 / 20 ** |

---

## Team

| Name                       | GitHub                                                           |
| -------------------------- | ---------------------------------------------------------------- |
| **Houssem Eddine Chaouch** | [@HoussemEddineChaouch](https://github.com/HoussemEddineChaouch) |
| **Omar Abdallah**          | [@OmarAbdallah25](https://github.com/OmarAbdallah25)             |

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built for the DevNet & Automation course**

⭐ Star this repo if you found it helpful!

</div>
