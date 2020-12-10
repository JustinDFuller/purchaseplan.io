export async function get(url) {
  return fetch(
    `http://localhost:8080/products/${encodeURIComponent(url)}`
  ).then((r) => r.json());
}
