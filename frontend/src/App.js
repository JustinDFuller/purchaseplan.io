import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import * as Layout from "layout";
import * as User from "user";
import * as Auth from "auth";
import * as styles from "styles";

export default function App() {
  const history = useHistory();
  const [user, setUser] = useState(User.data.New());
  const [auth, setAuth] = useState(
    Auth.context.New().onLogout(function () {
      setUser(User.data.New());
      history.push(Layout.routes.Landing.path);
    })
  );

  useEffect(function () {
    async function init() {
      setAuth(auth.setLoggingIn());
      const a = await auth.init();

      if (a.user()) {
        setUser(user.from(a.user()));
        if (window.location.pathname === Layout.routes.Landing.path) {
          history.push(User.routes.Dashboard.path);
        }
      }

      setAuth(a);
    }
    init();
  }, []); // eslint-disable-line

  return (
    <Auth.context.Context.Provider value={{ auth, setAuth }}>
      <User.data.Context.Provider value={{ user, setUser }}>
        <div
          className={styles.classes("container-fluid", {
            "px-0 px-md-3": auth.isLoggingIn(),
          })}
        >
          <Layout.components.Header />
          <Switch>
            <Route path={User.routes.List.path}>
              <User.routes.List />
            </Route>
            <Route path={User.routes.Overview.path}>
              <User.routes.Overview />
            </Route>
            <Route path={User.routes.Dashboard.path}>
              <User.routes.Dashboard />
            </Route>
            <Route path={Auth.routes.Login.path}>
              <Auth.routes.Login />
            </Route>
            <Route path={Auth.routes.Email.path}>
              <Auth.routes.Email />
            </Route>
            <Route path={Layout.routes.Landing.path}>
              <Layout.routes.Landing />
            </Route>
          </Switch>
        </div>
      </User.data.Context.Provider>
    </Auth.context.Context.Provider>
  );
}
