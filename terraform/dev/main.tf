terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.52.0"
    }
  }

  backend "gcs" {
    bucket = "purchaseplanio-terraform-state"
    prefix = "purchase-plan/dev/us-central/state"
  }
}

provider "google" {
  project = local.project_name
  region  = var.region
}

resource "google_project_service" "billing" {
  project = local.project_name
  service = "cloudbilling.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "resource-manager" {
  project = local.project_name
  service = "cloudresourcemanager.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "iam" {
  project = local.project_name
  service = "iam.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "appengine" {
  project = local.project_name
  service = "appengine.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "cloudbuild" {
  project = local.project_name
  service = "cloudbuild.googleapis.com"

  disable_dependent_services = true
}
