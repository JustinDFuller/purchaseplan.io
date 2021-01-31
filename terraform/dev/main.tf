# Terraform for dev central

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.52.0"
    }
  }

  backend "gcs" {
    bucket = "purchaseplanio-terraform"
    prefix = "state/purchase-plan-dev"
  }
}

provider "google" {
  project = "purchase-plan-dev"
  region  = "us-central"
}

data "google_organization" "org" {
  organization = "organizations/911410357820"
}

data "google_billing_account" "billing" {
  display_name = "Purchase Plan"
  open         = true
}

resource "google_project" "purchase-plan-dev" {
  name            = "purchase-plan-dev"
  project_id      = "purchase-plan-dev"
  billing_account = data.google_billing_account.billing.id
}


