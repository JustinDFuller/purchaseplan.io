import React, { useState, useEffect } from "react";

import * as Layout from "./layout";
import * as User from "./user";
import * as Auth from "./auth";

export default function App() {
  const [user, setUser] = useState(User.New());
  const [auth, setAuth] = useState(Auth.New());

  useEffect(function () {
    async function init() {
      setAuth(auth.setState(Auth.state.LOGGING_IN));
      const a = await auth.init();
      setAuth(a);

      if (a.data.user) {
        setUser((u) => u.setEmail(a.data.user.email));
      }
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
            <Auth.Login />
          )}
        </div>
      </User.Context.Provider>
    </Auth.Context.Provider>
  );
}
