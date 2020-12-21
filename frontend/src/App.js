import React, { useState, useEffect } from "react";

import { Header } from "./layout/Header";
import { EmailForm } from "./auth/Login";
import { Dashboard } from "./layout/Dashboard";
import * as User from "./user/context";
import * as Auth from "./auth/context";

export default function App() {
  const [user, setUser] = useState(User.New());
  const [auth, setAuth] = useState(Auth.New());

  useEffect(function () {
    async function init() {
      setAuth(a => a.setState(Auth.state.LOGGING_IN));
      const a = await auth.init();
      setAuth(a);

      if (a.data.user) {
        setUser(u => u.setEmail(a.data.user.email));
      }
    }
    init();
  }, []); // eslint-disable-line

  return (
    <Auth.Context.Provider value={{ auth, setAuth }}>
      <User.Context.Provider value={{ user, setUser }}>
        <Header />
        <div className="container-fluid">
        {
          auth.state() === Auth.state.LOGGED_IN
            ? <Dashboard />
            :  <EmailForm />
        }
        </div>
      </User.Context.Provider>
    </Auth.Context.Provider>
  );
}
