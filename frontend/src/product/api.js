import * as api from "../api";

export async function get(url) {
  return fetch(
    api.withHost(`/products?url=${encodeURIComponent(url)}`)
  ).then((r) => r.json());
}
