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
import * as Purchases from "./context/purchases";

export default function App() {
  const [user, setUser] = useState(User.New());
  const [purchases, setPurchases] = useState(Purchases.New());

  return (
    <User.Context.Provider value={{ user, setUser }}>
      <Purchases.Context.Provider value={{ purchases, setPurchases }}>
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
      </Purchases.Context.Provider>
    </User.Context.Provider>
  );
}

