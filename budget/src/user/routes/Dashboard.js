import { useState } from "react";

import * as Auth from "auth";
import * as User from "user";
import * as Notifications from "notifications";
import * as Layout from "layout";
import * as Budget from "budget";
import * as Category from "category";
import * as Transaction from "transaction";
import * as api from "../api";

export const Dashboard = Auth.context.With(function ({ auth }) {
  const [view, setView] = useState(Layout.views.planned);
  const { user, setUser } = User.data.Use();

  const budget = user.Budgets().last();

  if (!auth.isLoggedIn()) {
    return null;
  }

  function handleTransactionSubmit(transaction) {
    const u = user.setBudget(budget.addTransaction(transaction));
    setUser(u);
    api.put(u);
  }

  return (
    <>
      <div
        className="d-flex row m-auto pt-xl-4 pb-5"
        style={{ maxWidth: 1500 }}
      >
        {user.Budgets().isEmpty() ? (
          <User.components.SavingsOverview />
        ) : (
          <>
            <div className="col-12 col-xl-4">
              <Budget.components.Overview
                budget={budget}
                view={view}
                setView={setView}
              />
              <Transaction.components.Card
                budget={budget}
                onSubmit={handleTransactionSubmit}
              />
            </div>
            <div className="col-12 col-xl-8">
              <Category.components.Groups
                budget={budget}
                view={view}
                user={user}
                onChange={(u) => {
                  setUser(u);
                  User.api.put(u);
                }}
              />
              <div
                className="text-white cursor-pointer d-flex align-items-center justify-content-center p-5"
                style={{
                  borderRadius: 4,
                  background: "#14142a",
                  borderColor: "#424265",
                  borderWidth: 1,
                  borderStyle: "dotted",
                }}
                onClick={() => {
                  const groups = budget
                    .Categories()
                    .filter((c) => c.Group().includes("New Group"))
                    .reduce((sum, val) => {
                      if (!sum.includes(val.Group())) {
                        return [...sum, val.Group()];
                      }
                      return sum;
                    }, []);

                  let i = groups.length + 1;
                  let newGroup = `New Group ${i}`;
                  while (groups.includes(newGroup)) {
                    i++;
                    newGroup = `New Group ${i}`;
                  }

                  const u = user.setBudget(
                    budget.addCategory(
                      Category.New({
                        Name: "New Category",
                        Group: newGroup,
                      })
                    )
                  );
                  setUser(u);
                  User.api.put(u);
                }}
              >
                Add Group
              </div>
            </div>
          </>
        )}
      </div>
      <Notifications.components.Toasts />
    </>
  );
});

Dashboard.path = "/budget/app/user/dashboard";
