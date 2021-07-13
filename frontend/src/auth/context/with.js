import React, { useContext } from "react";

import { Context } from "./context";

export function With(Component) {
  return function WithAuthContext(props) {
    const { auth, setAuth } = useContext(Context);
    return <Component {...props} auth={auth} setAuth={setAuth} />;
  };
}

export function Use() {
  return useContext(Context);
}
