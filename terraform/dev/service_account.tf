resource "google_service_account" "terraform-central-dev" {
  account_id   = "terraform-central-dev"
  display_name = "Terraform Central Dev"
  description  = "This service account has permissions for terraform in purchase-plan-central-dev"
}

resource "google_organization_iam_custom_role" "terraform" {
  role_id     = "terraform"
  org_id      = data.google_organization.purchaseplanio.org_id
  title       = "terraform"
  description = "All roles needed by terraform"
  permissions = [
    "resourcemanager.folders.create",
    "resourcemanager.projects.create"
  ]
}

data "google_iam_policy" "terraform" {
  binding {
    role = google_organization_iam_custom_role.terraform.id

    members = ["serviceAccount:${google_service_account.terraform-central-dev.email}"]
  }
}

resource "google_service_account_iam_policy" "terraform-central-dev-iam" {
  service_account_id = google_service_account.terraform-central-dev.id
  policy_data        = data.google_iam_policy.terraform.policy_data
}
