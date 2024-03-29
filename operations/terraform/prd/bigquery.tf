resource "google_bigquery_dataset" "default" {
  dataset_id    = "default"
  friendly_name = "Purchase Plan"
  description   = "Purchase Plan data"
  location      = "US"
}

resource "google_bigquery_table" "products" {
  dataset_id = google_bigquery_dataset.default.dataset_id
  table_id   = "products"

  schema = <<EOF
[
  {
    "name": "hostname",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The host from the URL that the user requested."
  },
  {
    "name": "requestURL",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The URL that the user requested."
  },
  {
    "name": "name",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "The product name that was found"
  },
  {
    "name": "description",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "The product description that was found"
  },
  {
    "name": "price",
    "type": "INT64",
    "mode": "NULLABLE",
    "description": "The product price that was found"
  },
  {
    "name": "URL",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "The product URL that was found"
  },
  {
    "name": "image",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "The product image that was found"
  },
  {
    "name": "Time",
    "type": "TIMESTAMP",
    "mode": "NULLABLE",
    "description": "The time of the event."
  }
]
EOF
}

resource "google_bigquery_table" "tracking" {
  dataset_id = google_bigquery_dataset.default.dataset_id
  table_id   = "tracking"

  schema = <<EOF
[
  {
    "name": "UserID",
    "type": "STRING",
    "mode": "NULLABLE",
    "description": "The User's ID."
  },
  {
    "name": "PageViewID",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The unique ID for this page view."
  },
  {
    "name": "Type",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The type of event being tracked."
  },
  {
    "name": "Name",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The human-readable name of the event being tracked."
  },
  {
    "name": "Time",
    "type": "TIMESTAMP",
    "mode": "REQUIRED",
    "description": "The time of the event."
  },
  {
    "name": "URL",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The URL of the event."
  },
  {
    "name": "UserAgent",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The User-Agent header from the request."
  },
  {
    "name": "Host",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The Host header from the request."
  },
  {
    "name": "Referer",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The Referer header from the request."
  },
  {
    "name": "Country",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The Country where the request originated."
  },
  {
    "name": "Region",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The Region (US-CA) where the request originated."
  },
  {
    "name": "Trace",
    "type": "STRING",
    "mode": "REQUIRED",
    "description": "The request's unique Trace ID."
  }
]
EOF
}
