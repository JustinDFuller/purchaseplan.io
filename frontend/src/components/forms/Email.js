import React, { useContext } from "react";

import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function EmailForm({ next }) {
  const { user, setUser } = useContext(User.Context);

  async function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    /*
     e.preventDefault();

    try {
      const u = await userapi.get(user);
      setUser(user.from(u));
      next(e);
      return;
    } catch (e) {
      console.error(e);
    }

    await userapi.put(user);
    next(e);
     */
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="g-signin2" data-onsuccess={onSuccess}></div>

        <form>
          <label>What's Your Email Address?</label>
          <input
            type="email"
            name="email"
            value={user.email()}
            onChange={(e) => setUser(user.setEmail(e.target.value))}
          />
          <button type="submit">Next</button>
        </form>
      </div>
    </div>
  );
}
