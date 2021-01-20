variable "org_id" {
  type        = number
  description = "The numerical ID of the organization"
}

variable "org_name" {
  type        = string
  description = "The display name of the organization"
}

variable "billing_account" {
  type        = string
  description = "The billing account name"
}

variable "product_name" {
  type        = string
  description = "The name of the product for this project"
}

variable "region" {
  type        = string
  description = "The region of the project"
}

variable "environment" {
  type        = string
  description = "The deployment environment, like 'dev', 'stg', 'prd'."
}

variable "multiregion" {
  type        = string
  description = "The multiregion for cloud storage, like 'US', 'EU'."
}

locals {
  project_name = "${var.product_name}-${var.environment}-${var.region}"
}
