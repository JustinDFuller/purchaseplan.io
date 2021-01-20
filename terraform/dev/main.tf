terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.52.0"
    }
  }

  backend "gcs" {
    bucket = "purchase-plan-central-dev-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = "purchase-plan-central-dev"
  region  = "us-central1"
  zone    = "us-central1-a"
}

resource "google_project_service" "billing" {
  project = "purchase-plan-central-dev"
  service = "cloudbilling.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "resource-manager" {
  project = "purchase-plan-central-dev"
  service = "cloudresourcemanager.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "iam" {
  project = "purchase-plan-central-dev"
  service = "iam.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "appengine" {
  project = "purchase-plan-central-dev"
  service = "appengine.googleapis.com"

  disable_dependent_services = true
}
