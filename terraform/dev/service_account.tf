resource "google_service_account" "terraform-central-dev" {
  account_id   = "terraform-${var.region}-dev"
  display_name = "Terraform Central Dev"
  description  = "This service account has permissions for terraform"
}

data "google_iam_policy" "terraform" {
  binding {
    role = "organizations/${var.org_id}/roles/terraform"

    members = ["serviceAccount:${google_service_account.terraform-central-dev.email}"]
  }
}

resource "google_service_account_iam_policy" "terraform-central-dev-iam" {
  service_account_id = google_service_account.terraform-central-dev.id
  policy_data        = data.google_iam_policy.terraform.policy_data
}
