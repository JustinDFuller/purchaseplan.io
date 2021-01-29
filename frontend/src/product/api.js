import * as api from "../api";

export async function get(url) {
  return api
    .fetch(`/products?url=${encodeURIComponent(url)}`)
    .then((r) => r.json());
}
