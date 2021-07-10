import React, { useContext } from "react";

import { Context } from "./context";

export function WithContext(Component) {
  return function WithUserContext(props) {
    const { user, setUser } = useContext(Context);

    return <Component {...props} user={user} setUser={setUser} />;
  };
}
