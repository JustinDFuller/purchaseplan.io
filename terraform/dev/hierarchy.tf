data "google_organization" "org" {
  organization = "organizations/${var.org_id}"
}

data "google_billing_account" "billing" {
  display_name = "Purchase Plan"
  open         = true
}

resource "google_folder" "purchase-plan" {
  display_name = "Purchase Plan"
  parent       = data.google_organization.org.name
}

resource "google_folder" "purchase-plan-central" {
  display_name = "Purchase Plan Central"
  parent       = google_folder.purchase-plan.name
}

resource "google_project" "purchase-plan-central-dev" {
  folder_id       = google_folder.purchase-plan-central.id
  name            = "${var.product_name}-${var.region}-${var.environment}"
  project_id      = "${var.product_name}-${var.region}-${var.environment}"
  billing_account = data.google_billing_account.billing.id
}
