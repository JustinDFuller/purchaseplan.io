import * as api from "../api";

export async function login(didToken) {
  const res = await api.fetch("/v1/users/login", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${didToken}`,
    },
  });
  if (!res.ok || res.status === 401) {
    console.log("Should log out", res.status, res.ok);
  }
  return res.json();
}
