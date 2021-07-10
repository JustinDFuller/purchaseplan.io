import React, { useState, useEffect } from "react";

import * as Layout from "./layout";
import * as User from "./user";
import * as Auth from "./auth";
import * as styles from "./styles";

export default function App() {
  const [user, setUser] = useState(User.New());
  const [auth, setAuth] = useState(
    Auth.context.New().onLogout(function () {
      setUser(User.New());
    })
  );

  useEffect(function () {
    async function init() {
      setAuth(auth.setState(Auth.context.state.LOGGING_IN));
      const a = await auth.init();

      if (a.user()) {
        setUser(user.from(a.user()));
      }

      setAuth(a);
    }
    init();
  }, []); // eslint-disable-line

  return (
    <Auth.context.Context.Provider value={{ auth, setAuth }}>
      <User.Context.Provider value={{ user, setUser }}>
        <div
          className={styles.classes("container-fluid", {
            "px-0 px-md-3": auth.state() === Auth.context.state.LOGGED_IN,
          })}
        >
          <Layout.components.Header />
          {auth.state() === Auth.context.state.LOGGED_IN ? (
            <Layout.components.Dashboard />
          ) : (
            <Layout.components.Landing />
          )}
        </div>
      </User.Context.Provider>
    </Auth.context.Context.Provider>
  );
}
