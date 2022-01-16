import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import * as Layout from "layout";
import * as User from "user";
import * as Auth from "auth";
import * as styles from "styles";
import * as Notifications from "notifications";

export default function App() {
  const history = useHistory();
  const [user, setUser] = useState(User.data.New());
  const [auth, setAuth] = useState(
    Auth.context.New().onLogout(function () {
      setUser(User.data.New());
      history.push(Auth.getLoginPath(history));
    })
  );

  const tokens = Notifications.Use();
  const [updatedTokens, setUpdatedTokens] = useState(false);
  useEffect(
    function () {
      async function effect() {
        if (user.isReady() && tokens !== null && !updatedTokens) {
          setUpdatedTokens(true);

          const u = user.addPushNotificationTokens(tokens);
          const updated = u.from(await User.api.put(u));
          setUser(updated);
        }
      }
      effect();
    },
    [tokens, user, auth, updatedTokens]
  );

  useEffect(function () {
    async function init() {
      setAuth(auth.setLoggingIn());
      const a = await auth.init();
      setAuth(a);

      if (a.user()) {
        setUser(user.from(a.user()));
        history.push(User.getDashboardPath());
      }
    }

    if (auth.isNotAuthPath()) {
      init();
    }
  }, []); // eslint-disable-line

  return (
    <Auth.context.Context.Provider value={{ auth, setAuth }}>
      <User.data.Context.Provider value={{ user, setUser }}>
        <Layout.components.Offline />
        {auth.isNotAuthPath() && <Layout.components.Header />}
        <div
          style={{ height: "100vh", width: "100vw" }}
          className={styles.classes("container-fluid px-0", {
            "px-md-3": window.location.pathname !== Layout.routes.Landing.path,
            loading:
              auth.isLoggingIn() &&
              window.location.pathname !== Layout.routes.Landing.path,
          })}
        >
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
            <Route path={User.routes.Add.path}>
              <User.routes.Add />
            </Route>
            <Route path={Auth.routes.Login.path}>
              <Auth.routes.Login />
            </Route>
            <Route path={Auth.routes.Magic.path}>
              <Auth.routes.Magic />
            </Route>
            <Route path={Layout.routes.StyleGuide.path}>
              <Layout.routes.StyleGuide />
            </Route>
            <Route path={Layout.routes.Landing.path}>
              <Layout.routes.Landing />
            </Route>
          </Switch>
          {auth.isLoggedIn() && Layout.isNativeApp() && (
            <Layout.components.BottomNav />
          )}
        </div>
      </User.data.Context.Provider>
    </Auth.context.Context.Provider>
  );
}
