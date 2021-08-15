resource "google_service_account" "drone-dev" {
  account_id   = "drone-dev"
  display_name = "Drone Central Dev"
  description  = "This service account has permissions for drone in purchase-plan-dev"
}

resource "google_project_iam_binding" "drone-dev-iam-binding-appenginedeployer" {
  project = google_project.purchase-plan-dev.id
  role    = "roles/appengine.deployer"
  members = ["serviceAccount:${google_service_account.drone-dev.email}"]
}

resource "google_project_iam_binding" "drone-dev-iam-binding-appengineserviceadmin" {
  project = google_project.purchase-plan-dev.id
  role    = "roles/appengine.serviceAdmin"
  members = ["serviceAccount:${google_service_account.drone-dev.email}"]
}

resource "google_project_iam_binding" "drone-dev-iam-binding-appengineappcreator" {
  project = google_project.purchase-plan-dev.id
  role    = "roles/appengine.appCreator"
  members = ["serviceAccount:${google_service_account.drone-dev.email}"]
}

resource "google_project_iam_binding" "drone-dev-iam-binding-cloudbuildbuildeditor" {
  project = google_project.purchase-plan-dev.id
  role    = "roles/cloudbuild.builds.editor"
  members = ["serviceAccount:${google_service_account.drone-dev.email}"]
}

resource "google_project_iam_binding" "drone-dev-iam-binding-computestorageadmin" {
  project = google_project.purchase-plan-dev.id
  role    = "roles/compute.storageAdmin"
  members = ["serviceAccount:${google_service_account.drone-dev.email}"]
}

resource "google_project_iam_binding" "drone-dev-iam-binding-iamserviceaccountuser" {
  project = google_project.purchase-plan-dev.id
  role    = "roles/iam.serviceAccountUser"
  members = ["serviceAccount:${google_service_account.drone-dev.email}"]
}

resource "google_project_iam_binding" "drone-dev-iam-binding-storageobjectadmin" {
  project = google_project.purchase-plan-dev.id
  role    = "roles/storage.objectAdmin"
  members = ["serviceAccount:${google_service_account.drone-dev.email}"]
}

resource "google_project_iam_binding" "drone-dev-iam-binding-storageobjectviewer" {
  project = google_project.purchase-plan-dev.id
  role    = "roles/storage.objectViewer"
  members = ["serviceAccount:${google_service_account.drone-dev.email}"]
}
