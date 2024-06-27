.PHONY: install
install:
	@pnpm install

.PHONY: dev
dev:
	docker compose -f docker-compose.dev.yml up --remove-orphans

.PHONY: dev-rebuild
dev-rebuild:
	docker compose -f docker-compose.dev.yml build

	
