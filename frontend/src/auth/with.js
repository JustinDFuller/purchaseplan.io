import React, { useContext } from "react";

import { Context } from "./context";

export function withContext(Component) {
  return function (props) {
    const { auth, setAuth } = useContext(Context);

    return <Component {...props} auth={auth} setAuth={setAuth} />;
  };
}
