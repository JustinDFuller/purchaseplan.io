import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router-dom";

import * as context from "../context";
import * as User from "user";
import * as layout from "layout";
import * as form from "form";

export const Login = context.With(
  User.data.WithContext(function ({ user, setUser, auth, setAuth }) {
    const history = useHistory();

    async function handleSubmit(e) {
      e.preventDefault();
      setAuth(auth.setLoggingIn());

      const a = await auth.login({ email: user.email() });
      setAuth(a);

      if (a.user()) {
        setUser(user.from(a.user()));
        history.push(User.routes.Dashboard.path);
      }
    }

    if (auth.isLoggingIn()) {
      return (
        <layout.components.Card style={{ maxWidth: 400, margin: "auto" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner-border" role="status" />
            <h5 className="card-header">Logging you in</h5>
          </div>
        </layout.components.Card>
      );
    }

    return (
      <layout.components.Card style={{ maxWidth: 500, margin: "auto" }}>
        {(auth.serverError() || auth.unauthorized()) && (
          <Alert variant="danger" style={{ borderRadius: 0 }}>
            {auth.serverError() &&
              "Purchase Plan is currently experiencing issues. If you are unable to log in, please try again later."}
            {auth.unauthorized() && "Unable to log you in. Please try again."}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group margin-auto">
            <label className="form-label">
              To get started, log in with your email address.
            </label>
            <div className="row">
              <div className="col-12 col-lg-9">
                <input
                  required
                  data-testid="login-input"
                  className="form-control"
                  type="email"
                  name="email"
                  value={user.email()}
                  placeholder="email@example.com"
                  disabled={auth.isLoggingIn()}
                  onChange={(e) => setUser(user.setEmail(e.target.value))}
                />
              </div>
              <div className="col-12 col-lg-3 text-right mt-3 mt-lg-0">
                <form.components.Submit
                  onClick={handleSubmit}
                  disabled={auth.isLoggingIn()}
                  loading={auth.isLoggingIn()}
                  text="Log in"
                  dataTestid="login-button"
                />
              </div>
            </div>
          </div>
        </form>
      </layout.components.Card>
    );
  })
);
