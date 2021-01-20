resource "google_storage_bucket" "terraform-state" {
  project  = google_project.product-environment-region.project_id
  name     = "${local.project_name}-terraform-state"
  location = var.multiregion
}
