resource "google_project_service" "billing" {
  project = "purchase-plan-prd"
  service = "cloudbilling.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "resource-manager" {
  project = "purchase-plan-prd"
  service = "cloudresourcemanager.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "iam" {
  project = "purchase-plan-prd"
  service = "iam.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "appengine" {
  project = "purchase-plan-prd"
  service = "appengine.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "cloudbuild" {
  project = "purchase-plan-prd"
  service = "cloudbuild.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "secretmanager" {
  project = "purchase-plan-prd"
  service = "secretmanager.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "datastore" {
  project = "purchase-plan-prd"
  service = "datastore.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "bigquery" {
  project = "purchase-plan-prd"
  service = "bigquery.googleapis.com"

  disable_dependent_services = true
}
