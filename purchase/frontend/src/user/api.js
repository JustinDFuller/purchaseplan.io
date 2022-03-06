import * as api from "../api";

export async function put(user) {
  const res = await api.fetch("/v1/users", {
    method: "PUT",
    body: JSON.stringify(user),
  });

  return res.data;
}

export async function get() {
  return api.fetch("/v1/users");
}
