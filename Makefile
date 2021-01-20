export GOOGLE_APPLICATION_CREDENTIALS=$(HOME)/.config/gcloud/application_default_credentials.json

run:
	@(cd ./frontend && npm start) & (cd ./backend && make dev);

build-frontend:
	@cd ./frontend && npm run build;

build-backend:
	@cd ./backend && make build;

terraform-dev-central:
	@cd ./terraform/dev && \
		terraform plan \
		-var="environment=dev" \
		-var="region=central" \
		-var="multiregion=US" \
		-var="product_name=purchase-plan" \
		-var="billing_account=purchase-plan" \
		-var="org_name=purchaseplanio" \
		-var="org_id=911410357820";
