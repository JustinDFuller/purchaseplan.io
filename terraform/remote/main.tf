# Remote Terraform Configuration

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.52.0"
    }
  }

  backend "gcs" {
    bucket = "purchaseplanio-terraform-state"
    prefix = "remote/state"
  }
}

provider "google" {
  project = "terraform-state-prd-us-central"
}

resource "google_storage_bucket" "terraform-state" {
  project  = "terraform-state-prd-us-central"
  name     = "purchaseplanio-terraform-state"
  location = "US"
}
