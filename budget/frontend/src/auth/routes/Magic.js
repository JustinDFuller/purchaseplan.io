import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import * as User from "user";

import * as context from "../context";

const src = "https://auth.magic.link/pnp/callback";

export function Magic() {
  const history = useHistory();
  const { auth, setAuth } = context.Use();
  const { user, setUser } = User.data.Use();

  useEffect(function () {
    document.body.classList.remove("hide-magic-iframe");

    const s = document.createElement("script");
    s.src = src;
    s.setAttribute(
      "data-magic-publishable-api-key",
      "pk_live_06BF9798B97B7BB7"
    );
    s.setAttribute("data-login-uri", "/budget/app/auth/login");
    s.async = true;
    s.defer = true;
    document.body.append(s);

    return function () {
      const script = document.querySelector(`script[src="${src}"]`);
      if (script && typeof script.remove === "function") {
        script.remove();
      }

      const iframe = document.querySelector("iframe.magic-iframe");
      if (iframe && typeof iframe.remove === "function") {
        iframe.remove();
      }

      document.body.classList.add("hide-magic-iframe");
    };
  }, []);

  useEffect(function () {
    const listener = window.addEventListener("@magic/ready", async (event) => {
      const { idToken } = event.detail;

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
        height: 500,
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

Magic.path = "/budget/app/auth/magic";
