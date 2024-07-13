.PHONY: up down build migrate migrate-generate migrate-push

up:
	@docker compose up -d

down:
	@docker compose down

build:
	@docker compose build

migrate:
	@DATABASE_URL=postgres://postgres:postgres@localhost:5432/larky_link_dev pnpm -F @larky-link/app exec drizzle-kit migrate

migrate-generate:
	@DATABASE_URL=postgres://postgres:postgres@localhost:5432/larky_link_dev pnpm -F @larky-link/app exec drizzle-kit generate

migrate-push:
	@DATABASE_URL=postgres://postgres:postgres@localhost:5432/larky_link_dev pnpm -F @larky-link/app exec drizzle-kit push
