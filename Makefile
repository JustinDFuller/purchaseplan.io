export GOOGLE_APPLICATION_CREDENTIALS=$(HOME)/.config/gcloud/application_default_credentials.json

init-purchase:
	@(cd ./purchase/frontend && npm install) & (cd ./purchase/e2e && npm install) & (cd ./backend && go mod download);

run-purchase:
	@(cd ./purchase/frontend && make run) & (cd ./backend && make run-watch);

build-purchase-frontend:
	@cd ./purchase/frontend && make build;

build-backend:
	@cd ./backend && make build-server;

build-cron:
	@cd ./backend && make build-cron;

test-purchase:
	@($(MAKE) run) & (sleep 10 && cd ./purchase/e2e && npm test);

stop:
	@kill -9 `sudo netstat -nlp | grep :3000 | awk '{print $7}' | cut -d'/' -f1`;
	@kill -9 `sudo netstat -nlp | grep :8080 | awk '{print $7}' | cut -d'/' -f1`;

terraform-dev:
	@cd ./terraform/dev && terraform plan;

terraform-dev-apply:
	@cd ./terraform/dev && terraform apply;

terraform-prd:
	@cd ./terraform/prd && terraform plan;

terraform-prd-apply:
	@cd ./terraform/prd && terraform apply;

terraform-remote:
	@cd ./terraform/remote && \
		terraform plan \
		-var="billing_account=Purchase Plan" \
		-var="org_id=911410357820";

terraform-remote-apply:
	@cd ./terraform/remote && \
		terraform apply \
		-var="billing_account=Purchase Plan" \
		-var="org_id=911410357820";
