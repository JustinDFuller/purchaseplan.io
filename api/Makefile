export PGUSER=postgres
export PGDB=postgres
export PGSSLMODE=disable
export PGPASSWORD=testpassword
export PORT=8080
export DATASTORE_EMULATOR_HOST=localhost:8081

dev-watch:
	@rerun "$(MAKE) dev";

dev: datastore-start
	@go run ./cmd/server/main.go;

datastore-start:
	@gcloud beta emulators datastore start --no-store-on-disk --quiet > /dev/null 2>&1 &
	@gcloud beta emulators datastore env-init --quiet > /dev/null 2>&1;

datastore-stop:
	@PID=`ps ax | grep 'CloudDatastore.jar' | grep -v grep | awk '{print $1}'` [[ ! -z $(PID) ]] && kill -s $(PID);

install:
	@curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-319.0.0-linux-x86_64.tar.gz;
	@tar -xf ./google-cloud-sdk-319.0.0-linux-x86_64.tar.gz;
	@./google-cloud-sdk/install.sh;
	@./google-cloud-sdk/bin/gcloud init;
	@gcloud components install cloud-datastore-emulator;
	@sudo apt update;
	@sudo apt install default-jre;
