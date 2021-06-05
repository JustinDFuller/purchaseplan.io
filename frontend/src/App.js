import React, { useState, useEffect } from "react";

import * as Layout from "./layout";
import * as User from "./user";
import * as Auth from "./auth";
import * as styles from "./styles";

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
        <div
          className="alert alert-dark text-center"
          style={{ borderRadius: 0 }}
        >
          Welcome to the Purchase Plan early access. The website may not work
          perfectly and may change at any time.
        </div>

        <div
          className={styles.classes("container-fluid", {
            "px-0 px-md-3": auth.state() === Auth.state.LOGGED_IN,
          })}
        >
          <Layout.Header />
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
