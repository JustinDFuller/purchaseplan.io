export GOOGLE_APPLICATION_CREDENTIALS=$(HOME)/.config/gcloud/application_default_credentials.json

run:
	@(cd ./frontend && npm start) & (cd ./api && make dev);

build-frontend:
	@cd ./frontend && npm run build;

build-api:
	@cd ./api && make build;

