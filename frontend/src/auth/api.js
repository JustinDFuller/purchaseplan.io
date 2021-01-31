import * as api from "../api";

export function login(didToken) {
  return api.fetch("/v1/users/login", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${didToken}`,
    },
  });
}
