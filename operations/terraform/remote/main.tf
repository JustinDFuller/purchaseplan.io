# Remote Terraform Configuration

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.52.0"
    }
  }

  backend "gcs" {
    bucket = "purchaseplanio-terraform"
    prefix = "state/remote"
  }
}

variable "org_id" {
  type        = number
  description = "The numerical ID of the organization"
}

variable "billing_account" {
  type        = string
  description = "The billing account name"
}

provider "google" {
  project = "shared-terraform-state"
}

data "google_billing_account" "billing" {
  display_name = var.billing_account
  open         = true
}

resource "google_project" "shared-terraform-state" {
  name            = "shared-terraform-state"
  project_id      = "shared-terraform-state"
  org_id          = var.org_id
  billing_account = data.google_billing_account.billing.id
}

resource "google_storage_bucket" "shared-terraform-state" {
  project                     = "shared-terraform-state"
  name                        = "purchaseplanio-terraform"
  location                    = "US"
  force_destroy               = true
  uniform_bucket_level_access = true
}

resource "google_project_service" "file" {
  project = "shared-terraform-state"
  service = "file.googleapis.com"

  disable_dependent_services = true
}
