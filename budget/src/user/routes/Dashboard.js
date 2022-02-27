import { useState } from "react";

import * as Auth from "auth";
import * as User from "user";
import * as Notifications from "notifications";
import * as styles from "styles";
import * as Layout from "layout";
import * as Category from "category";
import * as Transaction from "transaction";

const views = {
  planned: 0,
  remaining: 1,
};

export const Dashboard = Auth.context.With(function ({ auth }) {
  const [view, setView] = useState(views.planned);
  const { user, setUser } = User.data.Use();

  const budget = user.Budgets().last();

  if (!auth.isLoggedIn()) {
    return null;
  }

  function handleTransactionSubmit(transaction) {
    setUser(user.setBudget(budget.AddTransaction(transaction)));
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
              <Layout.components.Card>
                <div className="d-flex justify-content-between align-items-center">
                  <h4>{budget.startDisplay()}</h4>
                  <h4>—</h4>
                  <h4>{budget.endDisplay()}</h4>
                </div>
                <div className="btn-group w-100 mt-3" role="group">
                  <button
                    className={styles.classes("btn btn-primary", {
                      active: view === views.planned,
                    })}
                    onClick={() => setView(views.planned)}
                  >
                    Planned
                  </button>
                  <button
                    className={styles.classes("btn btn-primary", {
                      active: view === views.remaining,
                    })}
                    onClick={() => setView(views.remaining)}
                  >
                    Remaining
                  </button>
                </div>
              </Layout.components.Card>
              <Transaction.components.Card
                budget={budget}
                onSubmit={handleTransactionSubmit}
              />
            </div>
            <div className="col-12 col-xl-8">
              {budget
                .Categories()
                .groups()
                .map((g) => (
                  <Layout.components.Card key={g.name} className="col-12">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item pl-0 text-white">
                        <div className="row">
                          <div className="col-12 d-flex justify-content-between">
                            <h5 className="card-title d-inline">{g.name}</h5>{" "}
                            {view === views.planned && (
                              <strong style={styles.textDark}>Planned</strong>
                            )}
                            {view === views.remaining && (
                              <strong style={styles.textDark}>Remaining</strong>
                            )}
                          </div>
                        </div>
                      </li>
                      {g.categories.map((c) => (
                        <li
                          key={c.ID()}
                          className="list-group-item pl-0 text-white"
                        >
                          <div className="row">
                            <div className="col-12 d-flex justify-content-between">
                              <input
                                className="d-inline-block form-control-plaintext text-white w-auto"
                                value={c.Name()}
                                onChange={(e) => {
                                  const u = user.setBudget(
                                    budget.setCategory(c.ID(), (cat) =>
                                      cat.setName(e.target.value)
                                    )
                                  );
                                  setUser(u);
                                  User.api.put(u);
                                }}
                              />
                              <span className="d-flex align-items-center justify-content-end">
                                $
                                {view === views.planned && (
                                  <input
                                    size={Math.max(
                                      c.planned().toString().length,
                                      1
                                    )}
                                    style={{
                                      width:
                                        Math.max(
                                          c.planned().toString().length,
                                          1
                                        ) *
                                          8 +
                                        16,
                                    }}
                                    className="d-inline-block form-control-plaintext text-white"
                                    type="number"
                                    value={
                                      c.planned() ? c.planned().toString() : ""
                                    }
                                    placeholder="0"
                                    min="0"
                                    onChange={(e) => {
                                      const u = user.setBudget(
                                        budget.setCategory(c.ID(), (cat) =>
                                          cat.setPlanned(e.target.value)
                                        )
                                      );
                                      setUser(u);
                                      User.api.put(u);
                                    }}
                                  />
                                )}
                                {view === views.remaining && (
                                  <input
                                    size={Math.max(
                                      budget.remaining(c).toString().length,
                                      1
                                    )}
                                    style={{
                                      width:
                                        Math.max(
                                          budget.remaining(c).toString().length,
                                          1
                                        ) *
                                          8 +
                                        16,
                                    }}
                                    disabled
                                    className="d-inline-block form-control-plaintext text-white"
                                    type="number"
                                    value={budget.remaining(c)}
                                    placeholder="0"
                                    min="0"
                                  />
                                )}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <button
                        className="btn btn-link px-0"
                        style={styles.colorSuccess}
                        onClick={() => {
                          const u = user.setBudget(
                            budget.addCategory(
                              Category.New()
                                .setName("New Category")
                                .setGroup(g.name)
                            )
                          );
                          setUser(u);
                          User.api.put(u);
                        }}
                      >
                        Add Category
                      </button>
                    </div>
                  </Layout.components.Card>
                ))}
            </div>
          </>
        )}
      </div>
      <Notifications.components.Toasts />
    </>
  );
});

Dashboard.path = "/budget/app/user/dashboard";
