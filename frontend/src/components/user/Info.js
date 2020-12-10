import React, { useContext } from "react";

import * as User from "../../context/user";

export function UserInfo() {
  const { user } = useContext(User.Context);

  return (
    <div id="userinfo" className="card">
      <strong>Email: </strong>
      <p id="email">{user.email()}</p>
      <br />
      <strong>Saved: </strong>
      <p id="saved">{user.saved()}</p>
      <br />
      <strong>Frequency: </strong>
      <p id="frequency">{user.frequency()}</p>
      <br />
      <strong>Saved each time: </strong>
      <p id="savings">{user.contributions()}</p>
    </div>
  );
}
