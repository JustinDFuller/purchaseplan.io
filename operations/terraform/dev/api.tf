resource "google_project_service" "billing" {
  project = "purchase-plan-dev"
  service = "cloudbilling.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "resource-manager" {
  project = "purchase-plan-dev"
  service = "cloudresourcemanager.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "iam" {
  project = "purchase-plan-dev"
  service = "iam.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "appengine" {
  project = "purchase-plan-dev"
  service = "appengine.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "cloudbuild" {
  project = "purchase-plan-dev"
  service = "cloudbuild.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "secretmanager" {
  project = "purchase-plan-dev"
  service = "secretmanager.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "datastore" {
  project = "purchase-plan-dev"
  service = "datastore.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "bigquery" {
  project = "purchase-plan-dev"
  service = "bigquery.googleapis.com"

  disable_dependent_services = true
}
