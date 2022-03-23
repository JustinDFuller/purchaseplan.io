import React, { useContext } from "react";

import { Context } from "./context";

export function WithContext(Component) {
  return function WithUserContext(props) {
    const { user, setUser } = useContext(Context);

    return <Component user={user} setUser={setUser} {...props} />;
  };
}

export function Use() {
  return useContext(Context);
}
