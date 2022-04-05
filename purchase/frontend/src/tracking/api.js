import * as uuid from "uuid";

import * as api from "api";

const PageViewID = uuid.v4();

export function track(options) {
  return api.fetch("/v1/tracking", {
    method: "POST",
    body: JSON.stringify({
      ...options,
      PageViewID,
      Time: new Date().toISOString(),
      URL: window.location.pathname,
    }),
  });
}
