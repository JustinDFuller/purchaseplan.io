import * as uuid from "uuid";

import * as api from "api";

const PageViewID = uuid.v4();

function track(options) {
  return navigator.sendBeacon(
    api.withHost("/v1/tracking"),
    JSON.stringify({
      ...options,
      PageViewID,
      Time: new Date().toISOString(),
      URL: window.location.pathname,
    })
  );
}

export function action(options) {
  return track({
    Type: "action",
    ...options,
  });
}

export function view(options) {
  return track({
    Type: "view",
    ...options,
  });
}

export function error(options) {
  return track({
    Type: "error",
    ...options,
  });
}
