data "google_project" "purchase-plan-dev-us-central" {}

resource "google_app_engine_application" "purchase-plan-dev-us-central" {
  project     = data.google_project.purchase-plan-dev-us-central.project_id
  location_id = var.region
}

resource "google_service_account" "drone-dev-us-central" {
  account_id   = "drone-${var.region}-dev"
  display_name = "Drone Central Dev"
  description  = "This service account has permissions for drone in purchase-plan-${var.region}-dev"
}

resource "google_project_iam_binding" "drone-dev-us-central-iam-binding-appenginedeployer" {
  project = data.google_project.purchase-plan-dev-us-central.id
  role    = "roles/appengine.deployer"
  members = ["serviceAccount:${google_service_account.drone-dev-us-central.email}"]
}

resource "google_project_iam_binding" "drone-dev-us-central-iam-binding-appengineserviceadmin" {
  project = data.google_project.purchase-plan-dev-us-central.id
  role    = "roles/appengine.serviceAdmin"
  members = ["serviceAccount:${google_service_account.drone-dev-us-central.email}"]
}

resource "google_project_iam_binding" "drone-dev-us-central-iam-binding-appengineappcreator" {
  project = data.google_project.purchase-plan-dev-us-central.id
  role    = "roles/appengine.appCreator"
  members = ["serviceAccount:${google_service_account.drone-dev-us-central.email}"]
}

resource "google_project_iam_binding" "drone-dev-us-central-iam-binding-cloudbuildbuildeditor" {
  project = data.google_project.purchase-plan-dev-us-central.id
  role    = "roles/cloudbuild.builds.editor"
  members = ["serviceAccount:${google_service_account.drone-dev-us-central.email}"]
}

resource "google_project_iam_binding" "drone-dev-us-central-iam-binding-computestorageadmin" {
  project = data.google_project.purchase-plan-dev-us-central.id
  role    = "roles/compute.storageAdmin"
  members = ["serviceAccount:${google_service_account.drone-dev-us-central.email}"]
}

resource "google_project_iam_binding" "drone-dev-us-central-iam-binding-iamserviceaccountuser" {
  project = data.google_project.purchase-plan-dev-us-central.id
  role    = "roles/iam.serviceAccountUser"
  members = ["serviceAccount:${google_service_account.drone-dev-us-central.email}"]
}

resource "google_project_iam_binding" "drone-dev-us-central-iam-binding-storageobjectcreator" {
  project = data.google_project.purchase-plan-dev-us-central.id
  role    = "roles/storage.objectCreator"
  members = ["serviceAccount:${google_service_account.drone-dev-us-central.email}"]
}

resource "google_project_iam_binding" "drone-dev-us-central-iam-binding-storageobjectviewer" {
  project = data.google_project.purchase-plan-dev-us-central.id
  role    = "roles/storage.objectViewer"
  members = ["serviceAccount:${google_service_account.drone-dev-us-central.email}"]
}
