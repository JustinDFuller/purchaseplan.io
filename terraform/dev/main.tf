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

data "google_organization" "purchaseplanio" {
  organization = "organizations/911410357820"
}

data "google_billing_account" "purchase-plan" {
  display_name = "Purchase Plan"
  open         = true
}

resource "google_folder" "purchase-plan" {
  display_name = "Purchase Plan"
  parent       = data.google_organization.purchaseplanio.name
}

resource "google_folder" "purchase-plan-central" {
  display_name = "Purchase Plan Central"
  parent       = google_folder.purchase-plan.name
}

resource "google_project" "purchase-plan-central-dev" {
  folder_id       = google_folder.purchase-plan-central.id
  name            = "purchase-plan-central-dev"
  project_id      = "purchase-plan-central-dev"
  billing_account = data.google_billing_account.purchase-plan.id
}

resource "google_storage_bucket" "terraform-state" {
  project  = google_project.purchase-plan-central-dev.project_id
  name     = "purchase-plan-central-dev-terraform-state"
  location = "US"
}

