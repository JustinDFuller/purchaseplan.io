import React, { useContext } from "react";

import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function SavedForm({ next }) {
  const { user, setUser } = useContext(User.Context);

  async function handleSubmit(e) {
    e.preventDefault()
    await userapi.post({ id: user.email() })
    next(e)
  }

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
