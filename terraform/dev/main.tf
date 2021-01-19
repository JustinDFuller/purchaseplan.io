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
