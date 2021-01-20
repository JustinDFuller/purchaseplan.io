resource "google_app_engine_application" "purchase-plan" {
  project     = google_project.purchase-plan-central-dev.project_id
  location_id = "us-central"
}

resource "google_service_account" "drone-deploy-central-dev" {
  account_id   = "drone-deploy-central-dev"
  display_name = "Drone Deploy Central Dev"
  description  = "This service account has permissions for drone in purchase-plan-central-dev"
}

resource "google_organization_iam_custom_role" "drone-deploy" {
  role_id     = "drone-deploy"
  org_id      = data.google_organization.purchaseplanio.org_id
  title       = "drone-deploy"
  description = "All roles needed by drone deployments"
  permissions = [
    "storage.objects.delete"
  ]
}

data "google_iam_policy" "drone-deploy" {
  binding {
    role = "roles/iam.serviceAccountUser"

    members = ["serviceAccount:${google_service_account.drone-deploy-central-dev.email}"]
  }

  binding {
    role = "roles/compute.storageAdmin"

    members = ["serviceAccount:${google_service_account.drone-deploy-central-dev.email}"]
  }

  binding {
    role = "roles/cloudbuild.builds.editor"

    members = ["serviceAccount:${google_service_account.drone-deploy-central-dev.email}"]
  }

  binding {
    role = "roles/appengine.deployer"

    members = ["serviceAccount:${google_service_account.drone-deploy-central-dev.email}"]
  }
}

resource "google_service_account_iam_policy" "drone-deploy-central-dev-iam" {
  service_account_id = google_service_account.drone-deploy-central-dev.id
  policy_data        = data.google_iam_policy.drone-deploy.policy_data
}
