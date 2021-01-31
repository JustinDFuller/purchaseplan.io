import Alert from "react-bootstrap/Alert";

import * as Auth from "./context";
import * as User from "../user";
import { withContext } from "./with";
import { Card } from "../layout/Card";
import { Submit } from "../forms/Submit";

export const Login = withContext(
  User.withContext(function ({ user, setUser, auth, setAuth }) {
    async function handleSubmit(e) {
      e.preventDefault();

      const a = await auth.login({ email: user.email() });
      setAuth(a);

      if (a.data.user) {
        setUser(user.from(a.data.user));
      }
    }

    if (auth.state() === Auth.state.LOGGING_IN) {
      return (
        <Card style={{ maxWidth: 400, margin: "auto" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner-border" role="status" />
            <h5 className="card-header">Logging you in</h5>
          </div>
        </Card>
      );
    }

    return (
      <Card style={{ maxWidth: 500, margin: "auto" }}>
        {auth.serverError() ||
          (auth.unauthorized() && (
            <Alert variant="danger" style={{ borderRadius: 0 }}>
              {auth.serverError() &&
                "Purchase Plan is currently experiencing issues. If you are unable to log in, please try again later."}
              {auth.unauthorized() && "Unable to log you in. Please try again."}
            </Alert>
          ))}
        <form onSubmit={handleSubmit}>
          <div className="form-group margin-auto">
            <label className="form-label">
              To get started, log in with your email address.
            </label>
            <div className="row">
              <div className="col-12 col-lg-9">
                <input
                  required
                  className="form-control"
                  type="email"
                  name="email"
                  value={user.email()}
                  placeholder="email@example.com"
                  disabled={auth.state() === Auth.state.LOGGING_IN}
                  onChange={(e) => setUser(user.setEmail(e.target.value))}
                />
              </div>
              <div className="col-12 col-lg-3 text-right mt-3 mt-lg-0">
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
