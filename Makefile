export GOOGLE_APPLICATION_CREDENTIALS=$(HOME)/.config/gcloud/application_default_credentials.json

run:
	@(cd ./frontend && npm start) & (cd ./backend && make dev);

build-frontend:
	@cd ./frontend && npm run build;

build-backend:
	@cd ./backend && make build;

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
