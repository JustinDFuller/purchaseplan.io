import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import * as User from "user";

import * as context from "../context";
import * as components from "../components";

export function Email() {
  const history = useHistory();
  const { auth, setAuth } = context.Use();
  const { user, setUser } = User.data.Use();

  useEffect(function () {
    async function init() {
      setAuth(auth.setLoggingIn());
      const a = await auth.initEmail();

      if (a.user()) {
        setUser(user.from(a.user()));
        history.push(User.getDashboardPath());
      }

      setAuth(a);
    }
    init();
  }, []); // eslint-disable-line

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <components.LoggingIn style={{ width: "100%", margin: 0 }} />
    </div>
  );
}

Email.path = "/app/auth/email";
