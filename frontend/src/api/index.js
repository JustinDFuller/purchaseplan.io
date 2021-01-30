const hostname = window.location.hostname;
const local = hostname === "localhost";
const host = `//${hostname}${local ? ":8080" : ""}`;

function withHost(url) {
  return `${host}${url}`;
}

function isNotLocal() {
  return !local;
}

function credentials() {
  return isNotLocal() ? "same-origin" : "include";
}

export function fetch(url, options) {
  return window.fetch(withHost(url), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: credentials(),
  });
}
