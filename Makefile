.PHONY: install
install:
	@pnpm install

.PHONY: dev
dev:
	@docker compose -f docker-compose.dev.yml up --remove-orphans

.PHONY: dev-rebuild
dev-rebuild:
	@docker compose -f docker-compose.dev.yml build

.PHONY: migrate
migrate:
	@DATABASE_URL=postgres://postgres:postgres@localhost:5432/larky_link_dev pnpm --filter @larky-link/app exec drizzle-kit migrate

.PHONY: migrate-generate
migrate-generate:
	@DATABASE_URL=postgres://postgres:postgres@localhost:5432/larky_link_dev pnpm --filter @larky-link/app exec drizzle-kit generate

.PHONY: migrate-push
migrate-push:
	@DATABASE_URL=postgres://postgres:postgres@localhost:5432/larky_link_dev pnpm --filter @larky-link/app exec drizzle-kit push
