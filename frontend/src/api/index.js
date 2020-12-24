const hostname = window.location.hostname;
const local = hostname === "localhost";
const host = `//${hostname}${local ? ":8080" : ""}`;

export function withHost(url) {
  return `${host}${url}`;
}
