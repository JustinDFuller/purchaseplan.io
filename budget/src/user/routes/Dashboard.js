import * as Auth from "auth";
import * as User from "user";
import * as Notifications from "notifications";
import * as styles from "styles";
import * as Layout from "layout";
import * as Category from "category";

export const Dashboard = Auth.context.With(function ({ auth }) {
  const { user, setUser } = User.data.Use();

  const budget = user.Budgets().last();

  if (!auth.isLoggedIn()) {
    return null;
  }

  return (
    <>
      <div className="d-flex row m-auto pt-4" style={{ maxWidth: 1500 }}>
        {user.Budgets().isEmpty() ? (
          <User.components.SavingsOverview />
        ) : (
          <>
            <Layout.components.Card className="col-12">
              <div>Budget started: {budget.startDisplay()}</div>
              <div>Budget ends: {budget.endDisplay()}</div>
              <div>Budget frequency: {user.frequency()}</div>
            </Layout.components.Card>
            {budget
              .Categories()
              .groups()
              .map((g) => (
                <Layout.components.Card key={g.name} className="col-12">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item pl-0 text-white">
                      <div>
                        <h5 className="card-title d-inline">{g.name}</h5>{" "}
                        <strong className="float-right" style={styles.textDark}>
                          Planned
                        </strong>
                      </div>
                    </li>
                    {g.categories.map((c) => (
                      <li
                        key={c.ID()}
                        className="list-group-item pl-0 text-white"
                      >
                        <div>
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
                          <span className="float-right">
                            $
                            <input
                              size={Math.max(c.planned().toString().length, 1)}
                              style={{
                                width:
                                  Math.max(c.planned().toString().length, 1) *
                                    8 +
                                  16,
                              }}
                              className="d-inline-block form-control-plaintext text-white"
                              type="number"
                              value={c.planned() ? c.planned().toString() : ""}
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
                          </span>
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
          </>
        )}
      </div>
      <Notifications.components.Toasts />
    </>
  );
});

Dashboard.path = "/budget/app/user/dashboard";
