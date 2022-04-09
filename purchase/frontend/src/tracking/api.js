import * as uuid from "uuid";

import * as api from "api";

const PageViewID = uuid.v4();

export function track(options) {
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
