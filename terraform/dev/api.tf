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
