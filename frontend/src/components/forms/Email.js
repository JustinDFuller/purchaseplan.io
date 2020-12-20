import React, { useContext, useEffect } from "react";

import * as Auth from "../../context/auth";
import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function EmailForm({ next }) {
  const { user, setUser } = useContext(User.Context);
  const { auth, setAuth } = useContext(Auth.Context);

  useEffect(
    function () {
      if (auth.state() === Auth.state.LOGGED_IN) {
        next();
      }
    },
    [auth]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const a = await auth.login({ email: form.get("email") });
    setAuth(a);

    if (a.data.user) {
      const u = user.setEmail(a.data.user.email);

      try {
        const existingUser = await userapi.get(u);
        setUser(user.from(existingUser));
        return;
      } catch (e) {
        console.error(e);
      }

      await userapi.put(u);
    }
  }

  return (
    <div className="card bg-dark text-white">
      <div className="card-body">
        {auth.state() === Auth.state.LOGGING_IN ? (
          <div className="spinner-border" role="status" />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group margin-auto">
              <label className="ford-label">What's Your Email Address?</label>
              <div className="row">
                <div className="col-9">
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={user.email()}
                    onChange={(e) => setUser(user.setEmail(e.target.value))}
                  />
                </div>
                <div className="col-3">
                  <button className="btn btn-primary" type="submit">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
