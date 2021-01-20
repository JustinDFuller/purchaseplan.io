resource "google_app_engine_application" "purchase-plan" {
  project     = google_project.purchase-plan-central-dev.project_id
  location_id = "us-${var.region}"
}

resource "google_service_account" "drone-central-dev" {
  account_id   = "drone-${var.region}-dev"
  display_name = "Drone Central Dev"
  description  = "This service account has permissions for drone in purchase-plan-${var.region}-dev"
}

resource "google_project_iam_binding" "drone-central-dev-iam-binding-appenginedeployer" {
  project = google_project.purchase-plan-central-dev.id
  role    = "roles/appengine.deployer"
  members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
}

resource "google_project_iam_binding" "drone-central-dev-iam-binding-appengineserviceadmin" {
  project = google_project.purchase-plan-central-dev.id
  role    = "roles/appengine.serviceAdmin"
  members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
}

resource "google_project_iam_binding" "drone-central-dev-iam-binding-appengineappcreator" {
  project = google_project.purchase-plan-central-dev.id
  role    = "roles/appengine.appCreator"
  members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
}

resource "google_project_iam_binding" "drone-central-dev-iam-binding-cloudbuildbuildeditor" {
  project = google_project.purchase-plan-central-dev.id
  role    = "roles/cloudbuild.builds.editor"
  members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
}

resource "google_project_iam_binding" "drone-central-dev-iam-binding-computestorageadmin" {
  project = google_project.purchase-plan-central-dev.id
  role    = "roles/compute.storageAdmin"
  members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
}

resource "google_project_iam_binding" "drone-central-dev-iam-binding-iamserviceaccountuser" {
  project = google_project.purchase-plan-central-dev.id
  role    = "roles/iam.serviceAccountUser"
  members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
}

resource "google_project_iam_binding" "drone-central-dev-iam-binding-storageobjectcreator" {
  project = google_project.purchase-plan-central-dev.id
  role    = "roles/storage.objectCreator"
  members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
}

resource "google_project_iam_binding" "drone-central-dev-iam-binding-storageobjectviewer" {
  project = google_project.purchase-plan-central-dev.id
  role    = "roles/storage.objectViewer"
  members = ["serviceAccount:${google_service_account.drone-central-dev.email}"]
}
