# Terraform For Organization Structure

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.52.0"
    }
  }

  /* backend "gcs" {
    bucket = "purchase-plan-central-dev-terraform-state"
    prefix = "terraform/state"
  }*/
}

variable "org_id" {
  type        = number
  description = "The numerical ID of the organization"
}

variable "org_name" {
  type        = string
  description = "The display name of the organization"
}

variable "billing_account" {
  type        = string
  description = "The billing account name"
}

variable "products" {
  type        = list(string)
  description = "The names of the products for this project"
}

variable "environments" {
  type        = list(string)
  description = "The environments to create for each product"
  default     = ["dev", "prd"]
}

variable "regions" {
  type        = list(string)
  description = "The regions to create for each environment"
  default     = ["us-east", "us-central"]
}

locals {
  environments = merge(flatten([
    for product in var.products : [
      for environment in var.environments : {
        ("${product}-${environment}") = (product)
      }
    ]
  ])...)

  regions = merge(flatten([
    for product in var.products : flatten([
      for environment in var.environments : flatten([
        for region in var.regions : {
          ("${product}-${environment}-${region}") = ("${product}-${environment}")
        }
      ])
    ])
  ])...)
}

provider "google" {}

data "google_organization" "org" {
  organization = "organizations/${var.org_id}"
}

data "google_billing_account" "billing" {
  display_name = var.billing_account
  open         = true
}

resource "google_folder" "product-folders" {
  for_each     = toset(var.products)
  display_name = each.key
  parent       = data.google_organization.org.name
}

resource "google_folder" "product-environments" {
  for_each     = local.environments
  display_name = each.key
  parent       = google_folder.product-folders[each.value].id
}

resource "google_project" "product-environment-regions" {
  for_each        = local.regions
  folder_id       = google_folder.product-environments[each.value].id
  name            = each.key
  project_id      = each.key
  billing_account = data.google_billing_account.billing.id
}
