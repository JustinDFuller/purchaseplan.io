import * as Auth from "./context";
import { withContext } from "./with";
import * as User from "../user";
import { Card } from "../layout/Card";
import { Submit } from "../forms/Submit";

export const Login = withContext(
  User.withContext(function ({ user, setUser, auth, setAuth }) {
    async function handleSubmit(e) {
      e.preventDefault();

      const a = await auth.login({ email: user.email() });
      setAuth(a);

      if (a.data.user) {
        const u = user.setEmail(a.data.user.email);

        try {
          const existingUser = await User.api.get(u);
          setUser(user.from(existingUser));
          return;
        } catch (e) {
          console.error(e);
        }

        await User.api.put(u);
      }
    }

    if (auth.state() === Auth.state.LOGGING_IN) {
      return (
        <Card style={{ maxWidth: 400, margin: "auto" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner-border" role="status" />
            <h5 className="card-header">
              Hang tight, I'm fetching your data from the vault.
            </h5>
          </div>
        </Card>
      );
    }

    return (
      <Card style={{ maxWidth: 500, margin: "auto" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group margin-auto">
            <label className="form-label">
              To get started, log in with your email address.
            </label>
            <div className="row">
              <div className="col-9">
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={user.email()}
                  disabled={auth.state() === Auth.state.LOGGING_IN}
                  onChange={(e) => setUser(user.setEmail(e.target.value))}
                />
              </div>
              <div className="col-3">
                <Submit
                  onClick={handleSubmit}
                  loading={auth.state() === Auth.state.LOGGING_IN}
                  text="Log in"
                />
              </div>
            </div>
          </div>
        </form>
      </Card>
    );
  })
);
