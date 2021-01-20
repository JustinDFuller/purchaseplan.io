resource "google_app_engine_application" "purchase-plan" {
  project     = google_project.purchase-plan-central-dev.project_id
  location_id = "us-central"
}

resource "google_service_account" "drone-central-dev" {
  account_id   = "drone-central-dev"
  display_name = "Drone Central Dev"
  description  = "This service account has permissions for drone in purchase-plan-central-dev"
}

resource "google_organization_iam_custom_role" "drone" {
  role_id     = "drone"
  org_id      = data.google_organization.purchaseplanio.org_id
  title       = "drone"
  description = "All roles needed by drone deployments"
  permissions = [
    "storage.objects.delete"
  ]
}

data "google_iam_policy" "drone" {
  binding {
    role = "roles/iam.serviceAccountUser"

    members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
  }

  binding {
    role = "roles/compute.storageAdmin"

    members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
  }

  binding {
    role = "roles/cloudbuild.builds.builder"

    members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
  }

  binding {
    role = "roles/appengine.serviceAdmin"

    members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
  }
}

resource "google_service_account_iam_policy" "drone-central-dev-iam" {
  service_account_id = google_service_account.drone-central-dev.id
  policy_data        = data.google_iam_policy.drone.policy_data
}
