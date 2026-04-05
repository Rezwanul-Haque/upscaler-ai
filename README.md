# Upscaler AI

Full-stack AI image upscaling application.  
**Frontend** (Next.js 16) + **Backend** (FastAPI) — both following vertical slice + clean architecture.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS v4, TypeScript |
| Backend | FastAPI, SQLAlchemy 2, SQLite, Pillow |
| Containerisation | Docker, Docker Compose |
| Orchestration | GNU Make |

---

## Project Structure

```
upscaler/
├── Makefile              <- single entry point for all commands
├── README.md
│
├── backend/
│   ├── src/
│   │   ├── core/         <- config, database, exceptions, dependencies
│   │   ├── features/     <- vertical slices (health, upload, upscale, ai_models, waitlist)
│   │   │   ├── health/
│   │   │   ├── upload/
│   │   │   ├── upscale/
│   │   │   ├── ai_models/
│   │   │   └── waitlist/
│   │   ├── infra/        <- DB models, upscaler implementations, storage providers
│   │   └── main.py
│   ├── tests/
│   │   ├── unit/
│   │   └── e2e/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/          <- Next.js App Router pages
    │   │   ├── page.tsx        (landing page  ->  /)
    │   │   ├── lab/page.tsx    (upscaler lab  ->  /lab)
    │   │   ├── gallery/page.tsx (gallery      ->  /gallery)
    │   │   ├── terms/page.tsx  (terms         ->  /terms)
    │   │   ├── privacy/page.tsx (privacy      ->  /privacy)
    │   │   └── contact/page.tsx (contact      ->  /contact)
    │   ├── features/     <- vertical slices (landing, lab, upload)
    │   ├── infra/        <- HTTP client, typed API calls
    │   └── shared/       <- cross-feature components, hooks, types
    ├── Dockerfile
    ├── docker-compose.yml
    └── DESIGN.md         <- design system reference
```

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) >= 24
- [Docker Compose](https://docs.docker.com/compose/) v2 (ships with Docker Desktop)
- [GNU Make](https://www.gnu.org/software/make/)

---

## Quick Start

All commands are run from the project root directory.

### Development (hot reload)

```bash
make dev
```

Starts both services with source-mounted volumes so changes reflect instantly — no rebuild needed.  
On first run, `.env` files are auto-created from `.env.example` if they don't exist.

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

```bash
make dev-down      # stop and remove dev containers
```

### Production

```bash
make up            # build images and start production stack
make down          # stop production stack
```

### Other commands

```bash
make logs          # tail logs from all containers
make ps            # list running containers
make help          # show all available commands
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/upload` | Upload an image |
| `GET` | `/api/v1/upload/{id}` | Get image metadata |
| `GET` | `/api/v1/upload/{id}/file` | Serve the original image file |
| `GET` | `/api/v1/models` | List available AI models |
| `POST` | `/api/v1/upscale/jobs` | Create and queue an upscale job |
| `GET` | `/api/v1/upscale/jobs` | List jobs (supports `?status=completed`) |
| `GET` | `/api/v1/upscale/jobs/{id}` | Get job status and progress |
| `DELETE` | `/api/v1/upscale/jobs/{id}` | Cancel a job |
| `GET` | `/api/v1/upscale/jobs/{id}/download` | Download upscaled image (`?format=png\|jpg\|webp`) |
| `POST` | `/api/v1/waitlist` | Register email for waitlist |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, upload zone, features, CTA |
| `/lab` | Upscaler lab — comparison viewer, model selector, process controls |
| `/gallery` | Gallery — paginated grid of completed upscaled images |
| `/terms` | Terms of service |
| `/privacy` | Privacy protocol |
| `/contact` | Contact support |

---

## Running Without Docker

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
python -m uvicorn src.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

---

## Running Tests (Backend)

```bash
cd backend
pip install -r requirements-dev.txt
pytest                        # all tests
pytest tests/unit/            # unit tests only
pytest tests/e2e/             # e2e tests only
pytest --cov=src              # with coverage report
```

---

## Environment Variables

### Backend (`backend/.env.example`)

| Variable | Default | Description |
|---|---|---|
| `BRAND_NAME` | `Upscaler AI` | Brand name shown in API docs |
| `APP_ENV` | `development` | Environment name |
| `APP_PORT` | `8000` | Server port |
| `APP_DEBUG` | `true` | Enable debug logging |
| `DATABASE_URL` | `sqlite:///./data/upscaler.db` | Database connection string |
| `UPLOAD_DIR` | `./data/uploads` | Directory for uploaded images |
| `OUTPUT_DIR` | `./data/outputs` | Directory for upscaled images |
| `MAX_UPLOAD_SIZE_MB` | `50` | Maximum upload file size |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins |
| `UPSCALER_PROVIDER` | `pillow` | Upscaler engine |
| `STORAGE_PROVIDER` | `local` | Storage backend |

### Frontend (`frontend/.env.example`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |
| `NEXT_PUBLIC_BRAND_NAME` | `Upscaler AI` | Brand name shown in UI |

---

## Available AI Models

| Model ID | Name | Scale | Description |
|---|---|---|---|
| `pillow-lanczos` | Pillow Lanczos | 2x | High-quality Lanczos resampling — fast, no GPU required |
