import React, { useContext } from "react";

import * as User from "../../context/user";

export function SavedForm({ next }) {
  const { user, setUser } = useContext(User.Context);

  return (
    <form id="saved-form" class="card" onSubmit={next}>
      <label>How much have you saved so far?</label>
      <input
        type="number"
        name="saved"
        value={user.saved()}
        onChange={e => setUser(user.setSaved(e.target.value))}
      />
      <button type="submit">Next</button>
    </form>
  );
}
