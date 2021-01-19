resource "google_storage_bucket" "terraform-state" {
  project  = google_project.purchase-plan-central-dev.project_id
  name     = "purchase-plan-central-dev-terraform-state"
  location = "US"
}
