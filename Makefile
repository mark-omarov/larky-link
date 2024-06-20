.PHONY: dev
dev:
	@pnpm exec next dev

.PHONY: generate-migration
generate-migration:
	@pnpm exec dotenvx run -f ./.env.local -- pnpm exec drizzle-kit generate

.PHONY: migrate
migrate:
	@pnpm exec dotenvx run -f ./.env.local -- pnpm exec drizzle-kit migrate
