data "google_organization" "org" {
  organization = "organizations/${var.org_id}"
}

data "google_billing_account" "billing" {
  display_name = var.billing_account
  open         = true
}

resource "google_folder" "product" {
  display_name = var.product_name
  parent       = data.google_organization.org.name
}

resource "google_folder" "product-environment" {
  display_name = "${var.product_name}-${var.environment}"
  parent       = google_folder.product.name
}

resource "google_project" "product-environment-region" {
  folder_id       = google_folder.product-environment.id
  name            = local.project_name
  project_id      = local.project_name
  billing_account = data.google_billing_account.billing.id
}
