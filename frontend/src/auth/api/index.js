import * as api from "../../api";

export function login(didToken) {
  return api.fetch("/v1/users/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${didToken}`,
    },
  });
}

export function logout() {
  return api.fetch("/v1/users/sessions", {
    method: "DELETE",
  });
}
