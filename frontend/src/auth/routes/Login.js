import * as components from "../components";

export function Login() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <components.Login style={{ width: "100%", margin: 0 }} />
    </div>
  );
}

Login.path = "/app/auth/login";
