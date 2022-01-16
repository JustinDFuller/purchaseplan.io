import { useEffect } from "react";

import { Magic } from "./Magic";

export function Login() {
  useEffect(function () {
    const s = document.createElement("script");
    s.src = "https://auth.magic.link/pnp/login";
    s.setAttribute(
      "data-magic-publishable-api-key",
      "pk_live_06BF9798B97B7BB7"
    );
    s.setAttribute("data-terms-of-service-uri", "/app/terms-of-service");
    s.setAttribute("data-privacy-policy-uri", "/app/privacy-policy");
    s.setAttribute("data-redirect-uri", Magic.path);
    s.async = true;
    s.defer = true;
    document.body.append(s);
  }, []);

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

Login.path = "/app/auth/login";
