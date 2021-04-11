import React, { useState, useEffect } from "react";

import * as Layout from "./src/layout";
import * as User from "./src/user";
import * as Auth from "./src/auth";

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
