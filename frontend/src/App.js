import React, { useState, useEffect } from "react";

import { Header } from "./components/Header";
import { EmailForm } from "./components/forms/Email";
import { Dashboard } from "./components/Dashboard";
import { Stepper } from "./components/forms/Stepper";

import * as User from "./context/user";
import * as Auth from "./context/auth";

export default function App() {
  const [user, setUser] = useState(User.New());
  const [auth, setAuth] = useState(Auth.New());

  useEffect(function () {
    async function init() {
      setAuth(auth.setState(Auth.state.LOGGING_IN));
      const a = await auth.init();
      setAuth(a);

      if (a.data.user) {
        setUser(user.setEmail(a.data.user.email));
      }
    }
    init();
  }, []);

  return (
    <Auth.Context.Provider value={{ auth, setAuth }}>
      <User.Context.Provider value={{ user, setUser }}>
        <Header />
        <div className="container-fluid">
          <Stepper>
            <EmailForm />
            <Dashboard />
          </Stepper>
        </div>
      </User.Context.Provider>
    </Auth.Context.Provider>
  );
}
