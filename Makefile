ifeq (,$(wildcard .env))
$(shell cp .env.example .env)
endif

include .env

genkey:
	node -e "console.log(require('crypto').randomBytes(128).toString('hex'))"

devrun:
	@docker exec -d $(COMPOSE_PROJECT_NAME)-server-1 yarn dev
	@docker exec -it $(COMPOSE_PROJECT_NAME)-client-1 yarn dev

devserver:
	docker exec -it $(COMPOSE_PROJECT_NAME)-server-1 yarn dev

devclient:
	docker exec -it $(COMPOSE_PROJECT_NAME)-client-1 yarn dev

devdown:
	docker compose down --remove-orphans

ifeq ($(OS),Windows_NT)
devup:
	docker compose up -d --remove-orphans

devinstall:
	@docker exec -it $(COMPOSE_PROJECT_NAME)-server-1 yarn
	@docker exec -it $(COMPOSE_PROJECT_NAME)-client-1 yarn
	@if not exist client\.env (copy client\.env.example client\.env)
	@if not exist server\.env (copy server\.env.example server\.env)

devsetup:
	@if not exist client\.env (copy client\.env.example client\.env)
	@if not exist server\.env (copy server\.env.example server\.env)

serverup:
	cd server && yarn dev

clientup:
	cd client && yarn dev
else
devup:
	USER=$$(id -u):$$(id -g) docker compose up -d --remove-orphans

devinstall:
	@docker exec -it -u $$(id -u):$$(id -g) $(COMPOSE_PROJECT_NAME)-server-1 yarn
	@docker exec -it -u $$(id -u):$$(id -g) $(COMPOSE_PROJECT_NAME)-client-1 yarn
	@test -f client/.env || cp client/.env.example client/.env
	@test -f server/.env || cp server/.env.example server/.env

devclean: devdown
	@docker rmi $$(docker images -a -q)
	@docker volume rm $$(docker volume ls -q)
	
endif