import React, { useState } from "react";

import { Header } from "./components/Header";
import { EmailForm } from "./components/forms/Email";
import { Dashboard } from './components/Dashboard';
import { Stepper } from "./components/forms/Stepper";

import * as User from "./context/user";

export default function App() {
  const [user, setUser] = useState(User.New());

  return (
    <User.Context.Provider value={{ user, setUser }}>
      <Header />
      <div className="container">
        <Stepper>
          <EmailForm />
          <Dashboard /> 
        </Stepper>
      </div>
    </User.Context.Provider>
  );
}
