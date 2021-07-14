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
      setAuth(a);

      if (a.user()) {
        setUser(user.from(a.user()));

        switch (window.location.pathname) {
          case Auth.routes.Login.path:
            history.push(User.routes.List.path);
            break;
          default:
            history.push(User.routes.Dashboard.path);
            break;
        }
      } else {
        switch (window.location.pathname) {
          case Layout.routes.Landing.path:
          case User.routes.Dashboard.path:
            history.push(Layout.routes.Landing.path);
            break;
          default:
            history.push(Auth.routes.Login.path);
            break;
        }
      }
    }

    if (auth.isNotAuthPath()) {
      init();
    }
  }, []); // eslint-disable-line

  return (
    <Auth.context.Context.Provider value={{ auth, setAuth }}>
      <User.data.Context.Provider value={{ user, setUser }}>
        <div
          style={{ height: "100%", width: "100%" }}
          className={styles.classes("container-fluid", {
            "px-0 px-md-3": auth.isLoggedIn(),
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
