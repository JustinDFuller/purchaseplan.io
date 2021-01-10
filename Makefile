export GOOGLE_APPLICATION_CREDENTIALS=$(HOME)/.config/gcloud/application_default_credentials.json

run:
	@(cd ./frontend && npm start) & (cd ./backend && make dev);

build-frontend:
	@cd ./frontend && npm run build;

build-backend:
	@cd ./backend && make build;

