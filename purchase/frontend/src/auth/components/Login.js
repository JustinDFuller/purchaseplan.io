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

export const Login = context.With(
  User.data.WithContext(function ({
    user,
    setUser,
    auth,
    setAuth,
    style,
    className,
  }) {
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

    return (
      <layout.components.Card
        className={className}
        style={styles.combine(
          { maxWidth: 500, margin: "0 auto", border: 0 },
          style
        )}
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
            <div className="row">
              <div className="col-12">
                <a
                  href={
                    auth.isLoggedIn()
                      ? "/app/user/dashboard"
                      : "/app/auth/login"
                  }
                  data-testid="login-button"
                  className="btn btn-success w-100 w-md-auto p-3"
                >
                  {auth.isLoggedIn() ? (
                    "Get started"
                  ) : (
                    <span>
                      Get started for <strong>free</strong>
                    </span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </form>
      </layout.components.Card>
    );
  })
);
