import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router-dom";
/*
import {
  GoogleLoginButton,
  AppleLoginButton,
} from "react-social-login-buttons";
*/

import * as context from "../context";
import * as User from "user";
import * as layout from "layout";
import * as form from "form";
import * as styles from "styles";

import { LoggingIn } from "./LoggingIn";

export const Login = context.With(
  User.data.WithContext(function ({ user, setUser, auth, setAuth, style }) {
    const history = useHistory();

    async function handleSubmit(e) {
      e.preventDefault();
      setAuth(auth.setLoggingIn());

      const a = await auth.login({ email: user.email() });
      setAuth(a);

      if (a.user()) {
        setUser(user.from(a.user()));
        history.push(User.getDashboardPath());
      }
    }

    if (auth.isLoggingIn()) {
      return <LoggingIn style={style} />;
    }

    return (
      <layout.components.Card
        style={styles.combine({ maxWidth: 500, margin: "0 auto" }, style)}
      >
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
              Get started with just an email.
            </label>
            <div className="row">
              <div className="col-12">
                <a
                  href="/budget/app/auth/login"
                  data-testid="login-button"
                  className="btn btn-success w-100 w-md-auto"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </form>
      </layout.components.Card>
    );
  })
);
