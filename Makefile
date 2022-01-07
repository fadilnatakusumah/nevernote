# Development
run-db:
	docker-compose -f ./docker-compose.dev.yml up

build:
	cd server && docker build -t api-server .
	cd web && docker build -t react-web .

run:
	docker-compose up


build-run:
	$(MAKE) build && $(MAKE) run