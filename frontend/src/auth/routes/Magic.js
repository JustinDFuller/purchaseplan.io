import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import * as User from "user";

import * as context from "../context";

export function Magic() {
  const history = useHistory();
  const { auth, setAuth } = context.Use();
  const { user, setUser } = User.data.Use();

  useEffect(function () {
    const s = document.createElement("script");
    s.src = "https://auth.magic.link/pnp/callback";
    s.setAttribute(
      "data-magic-publishable-api-key",
      "pk_live_06BF9798B97B7BB7"
    );
    s.setAttribute("data-login-uri", "/app/auth/login");
    s.async = true;
    s.defer = true;
    document.body.append(s);
  }, []);

  useEffect(function () {
    const listener = window.addEventListener("@magic/ready", async (event) => {
      const { magic, idToken, userMetadata, oauth } = event.detail;
      console.log({ magic, idToken, userMetadata, oauth });

      const a = await auth.handleMagicCallback({ idToken });

      if (a.user()) {
        setUser(user.from(a.user()));
        history.push(User.getDashboardPath());
      }

      setAuth(a);
    });

    return function () {
      window.removeEventListener("@magic/ready", listener);
    };
  });

  return (
    <div
      style={{
        height: 600,
        width: 400,
        boxShadow: "0 12px 56px rgb(119 118 122 / 15%)",
        borderRadius: 28,
        marginLeft: "auto",
        marginRight: "auto",
        top: 48,
        position: "relative",
        background: "#323233",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="spinner-grow mt-1" role="status" />
      </div>
    </div>
  );
}

Magic.path = "/app/auth/magic";