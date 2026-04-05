# PixLift AI — apps/Makefile
# Usage:
#   make dev        — start full stack in dev mode (hot reload)
#   make dev-down   — stop and remove all dev containers
#   make up         — start full stack in production mode
#   make down       — stop production stack
#   make logs       — tail logs from all running containers
#   make ps         — show running containers

BACKEND_DIR  := ./backend
FRONTEND_DIR := ./frontend
PROJECT_NAME := upscaler-ai

COMPOSE_BACKEND_DEV  := docker compose -p $(PROJECT_NAME) -f $(BACKEND_DIR)/docker-compose.yml --profile dev
COMPOSE_FRONTEND_DEV := docker compose -p $(PROJECT_NAME) -f $(FRONTEND_DIR)/docker-compose.yml --profile dev
COMPOSE_BACKEND      := docker compose -p $(PROJECT_NAME) -f $(BACKEND_DIR)/docker-compose.yml
COMPOSE_FRONTEND     := docker compose -p $(PROJECT_NAME) -f $(FRONTEND_DIR)/docker-compose.yml

.PHONY: dev dev-down up down logs ps help env

## Copy .env.example → .env for any service that lacks a .env
env:
	@for dir in $(BACKEND_DIR) $(FRONTEND_DIR); do \
		if [ ! -f "$$dir/.env" ] && [ -f "$$dir/.env.example" ]; then \
			cp "$$dir/.env.example" "$$dir/.env"; \
			echo "  Created $$dir/.env from .env.example"; \
		fi; \
	done

## Start full stack — hot reload (backend uvicorn + frontend next dev)
dev: env
	@echo "→ Starting backend (dev)..."
	$(COMPOSE_BACKEND_DEV) up -d api-dev
	@echo "→ Starting frontend (dev)..."
	$(COMPOSE_FRONTEND_DEV) up -d web-dev
	@echo ""
	@echo "  Backend  → http://localhost:8000"
	@echo "  Frontend → http://localhost:3000"
	@echo "  API docs → http://localhost:8000/docs"
	@echo ""
	@echo "Run 'make logs' to tail output, 'make dev-down' to stop."

## Stop and remove all dev containers + networks
dev-down:
	@echo "→ Stopping dev stack..."
	$(COMPOSE_BACKEND_DEV) down
	$(COMPOSE_FRONTEND_DEV) down
	@echo "Done."

## Start full stack in production mode
up: env
	@echo "→ Starting backend (prod)..."
	$(COMPOSE_BACKEND) up -d api
	@echo "→ Starting frontend (prod)..."
	$(COMPOSE_FRONTEND) up -d web
	@echo ""
	@echo "  Backend  → http://localhost:8000"
	@echo "  Frontend → http://localhost:3000"

## Stop production stack
down:
	$(COMPOSE_BACKEND) down
	$(COMPOSE_FRONTEND) down

## Tail logs from all containers
logs:
	docker compose -p $(PROJECT_NAME) \
	  -f $(BACKEND_DIR)/docker-compose.yml \
	  -f $(FRONTEND_DIR)/docker-compose.yml \
	  logs -f

## Show running containers
ps:
	docker ps --filter "name=upscaler"

## Show available commands
help:
	@grep -E '^##' Makefile | sed 's/## /  /'
