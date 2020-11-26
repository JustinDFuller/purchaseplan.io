export PGUSER=postgres
export PGDB=postgres
export PGSSLMODE=disable
export PGPASSWORD=testpassword

dev: dev-database
	@PGHOST=`sudo docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' purchase-saving-planner-pg` \
	rerun "go run ./cmd/server/main.go";

dev-database: dev-database-stop
	@echo "Starting postgres docker container.";
	@sudo docker run --name purchase-saving-planner-pg -e POSTGRES_PASSWORD=testpassword -d postgres;
	@sleep 15;
	@echo "Started postgres docker container.";

dev-database-stop:
	@echo "Stopping postgres docker container.";
	@sudo docker stop purchase-saving-planner-pg || true;
	@sudo docker rm purchase-saving-planner-pg || true;
	@echo "Stopped postgres docker container.";
