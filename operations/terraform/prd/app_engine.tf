resource "google_app_engine_application" "purchase-plan-prd" {
  project     = "purchase-plan-prd"
  location_id = "us-central"
}

resource "google_app_engine_domain_mapping" "domain_mapping" {
  domain_name = "purchaseplan.io"

  ssl_settings {
    ssl_management_type = "AUTOMATIC"
  }
}

resource "google_app_engine_domain_mapping" "www_domain_mapping" {
  domain_name = "www.purchaseplan.io"

  ssl_settings {
    ssl_management_type = "AUTOMATIC"
  }
}

data "google_app_engine_default_service_account" "default" {}

resource "google_project_iam_binding" "secretaccessor" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/secretmanager.secretAccessor"
  members = ["serviceAccount:${data.google_app_engine_default_service_account.default.email}"]
}

