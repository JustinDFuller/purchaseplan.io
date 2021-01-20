resource "google_storage_bucket" "terraform-state" {
  project  = google_project.purchase-plan-central-dev.project_id
  name     = "${local.project_name}-terraform-state"
  location = var.multiregion
}
