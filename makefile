COMPOSE_FILE = docker-compose.dev.yml

.PHONY: up down logs build restart shell

up:
	docker compose -f $(COMPOSE_FILE) up -d --build

down:
	docker compose -f $(COMPOSE_FILE) down

build:
	docker compose -f $(COMPOSE_FILE) build

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

restart:
	docker compose -f $(COMPOSE_FILE) down
	docker compose -f $(COMPOSE_FILE) up -d --build

shell:
	docker compose -f $(COMPOSE_FILE) exec backend sh