export ENV="development"
export PORT=8080
export DATASTORE_EMULATOR_HOST=localhost:8081
export GOOGLE_CLOUD_PROJECT=purchase-plan-dev
export GOOGLE_APPLICATION_CREDENTIALS=$(HOME)/.config/gcloud/application_default_credentials.json
export PURCHASE_PLAN_IMAGE_BUCKET=purchase-plan-images-local

build:
	@go build ./cmd/server/main.go;

test:
	@ENV=test go test -race ./...;

run-watch:
	@rerun "$(MAKE) dev";

run: datastore-start
	@go run ./cmd/server/main.go;

datastore-start:
	@gcloud beta emulators datastore start --no-store-on-disk --quiet > /dev/null 2>&1 &
	@gcloud beta emulators datastore env-init --quiet > /dev/null 2>&1;

datastore-stop:
	@kill -9 `ps ax | grep 'CloudDatastore.jar' | grep -v grep | awk '{print $1}' | head -n 1`;

install:
	@curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-319.0.0-linux-x86_64.tar.gz;
	@tar -xf ./google-cloud-sdk-319.0.0-linux-x86_64.tar.gz;
	@./google-cloud-sdk/install.sh;
	@./google-cloud-sdk/bin/gcloud init;
	@gcloud components install cloud-datastore-emulator;
	@sudo apt update;
	@sudo apt install default-jre;
	@gcloud auth application-default login;
	@config/gcloud/application_default_credentials.json;
