import * as api from "../api";

export async function put(user) {
  const res = await api
    .fetch("/v1/users", {
      method: "PUT",
      body: JSON.stringify(user),
    })
    .then((r) => r.json());

  return res;
}

export async function get() {
  return api.fetch("/v1/users").then((r) => r.json());
}
