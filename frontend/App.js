import "./src/bootstrap-overrides.scss";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import * as Layout from "./src/layout";
import * as User from "./src/user";
import * as Auth from "./src/auth";

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

export default function App() {
  const [user, setUser] = useState(User.New());
  const [auth, setAuth] = useState(
    Auth.New().onLogout(function () {
      setUser(User.New());
    })
  );

  useEffect(function () {
    async function init() {
      setAuth(auth.setState(Auth.state.LOGGING_IN));
      const a = await auth.init();

      if (a.user()) {
        setUser(user.from(a.user()));
      }

      setAuth(a);
    }
    init();
  }, []); // eslint-disable-line

  return (
    <Auth.Context.Provider value={{ auth, setAuth }}>
      <User.Context.Provider value={{ user, setUser }}>
        <Layout.Header />
        <div className="container-fluid">
          {auth.state() === Auth.state.LOGGED_IN ? (
            <Layout.Dashboard />
          ) : (
            <Layout.Landing />
          )}
        </div>
      </User.Context.Provider>
    </Auth.Context.Provider>
  );
}
