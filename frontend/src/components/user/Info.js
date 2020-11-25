import React, { useContext } from "react";

import * as User from "../../context/user";

export function UserInfo() {
  const { user } = useContext(User.Context);

  return (
    <div id="userinfo" class="card">
      <strong>Email: </strong>
      <p id="email">{user.email()}</p>
      <strong>Saved: </strong>
      <p id="saved">{user.saved()}</p>
      <strong>Frequency: </strong>
      <p id="frequency">{user.frequency()}</p>
      <strong>Saved each time: </strong>
      <p id="savings">{user.contributions()}</p>
    </div>
  );
}
