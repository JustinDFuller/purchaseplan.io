resource "google_service_account" "terraform-central-dev" {
  account_id   = "terraform-${var.region}-dev"
  display_name = "Terraform Central Dev"
  description  = "This service account has permissions for terraform in purchase-plan-central-dev"
}

resource "google_organization_iam_custom_role" "terraform" {
  role_id     = "terraform"
  org_id      = data.google_organization.org.org_id
  title       = "terraform"
  description = "All roles needed by terraform"
  permissions = [
    ### Necessary permissions to work ###
    "resourcemanager.folders.create",
    "resourcemanager.projects.create",
    "storage.objects.list",
    "storage.objects.get",
    "storage.objects.create",
    "storage.objects.delete",
    ### Needed to make service accounts and roles ###
    "iam.roles.create",
    "iam.roles.delete",
    "iam.roles.get",
    "iam.roles.list",
    "iam.roles.undelete",
    "iam.roles.update",
    "resourcemanager.projects.get",
    "resourcemanager.projects.getIamPolicy"
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
