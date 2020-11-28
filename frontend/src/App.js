import React, { useState } from "react";

import { Header } from "./components/Header";
import { EmailForm } from "./components/forms/Email";
import { SavedForm } from "./components/forms/Saved";
import { FrequencyForm } from "./components/forms/Frequency";
import { ContributionsForm } from "./components/forms/Contributions";
import { PurchaseForm } from "./components/forms/Purchase";
import { UserInfo } from "./components/user/Info";
import { PurchaseList } from "./components/purchase/List";
import { Stepper } from "./components/forms/Stepper";

import * as User from "./context/user";

export default function App() {
  const [user, setUser] = useState(User.New());

  return (
    <User.Context.Provider value={{ user, setUser }}>
      <Header />
      <Stepper>
        <EmailForm />
        <SavedForm />
        <FrequencyForm />
        <ContributionsForm />
        <PurchaseForm />
        <PurchaseList />
      </Stepper>
      <UserInfo />
    </User.Context.Provider>
  );
}

