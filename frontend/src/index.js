import "./bootstrap-overrides.scss";

import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./App";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn:
      window.location.host === "purchaseplan.io"
        ? "https://3820e03a591e4884866030faf9e11bcb@o513637.ingest.sentry.io/5615908" // prod
        : "https://77d7a3f2761741999708fa339cbe2977@o513637.ingest.sentry.io/5615917", // dev
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
