resource "google_service_account" "drone-prd" {
  account_id   = "drone-prd"
  display_name = "Drone Central Dev"
  description  = "This service account has permissions for drone in purchase-plan-prd"
}

resource "google_project_iam_binding" "drone-prd-iam-binding-appenginedeployer" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/appengine.deployer"
  members = ["serviceAccount:${google_service_account.drone-prd.email}"]
}

resource "google_project_iam_binding" "drone-prd-iam-binding-appengineserviceadmin" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/appengine.serviceAdmin"
  members = ["serviceAccount:${google_service_account.drone-prd.email}"]
}

resource "google_project_iam_binding" "drone-prd-iam-binding-appengineappcreator" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/appengine.appCreator"
  members = ["serviceAccount:${google_service_account.drone-prd.email}"]
}

resource "google_project_iam_binding" "drone-prd-iam-binding-cloudbuildbuildeditor" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/cloudbuild.builds.editor"
  members = ["serviceAccount:${google_service_account.drone-prd.email}"]
}

resource "google_project_iam_binding" "drone-prd-iam-binding-computestorageadmin" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/compute.storageAdmin"
  members = ["serviceAccount:${google_service_account.drone-prd.email}"]
}

resource "google_project_iam_binding" "drone-prd-iam-binding-iamserviceaccountuser" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/iam.serviceAccountUser"
  members = ["serviceAccount:${google_service_account.drone-prd.email}"]
}

resource "google_project_iam_binding" "drone-prd-iam-binding-storageobjectcreator" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/storage.objectCreator"
  members = ["serviceAccount:${google_service_account.drone-prd.email}"]
}

resource "google_project_iam_binding" "drone-prd-iam-binding-storageobjectviewer" {
  project = google_project.purchase-plan-prd.id
  role    = "roles/storage.objectViewer"
  members = ["serviceAccount:${google_service_account.drone-prd.email}"]
}
