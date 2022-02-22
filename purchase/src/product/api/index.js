import * as api from "api";

export async function get(url) {
  const res = await api.fetch(`/products?url=${encodeURIComponent(url)}`);
  return res.data;
}
