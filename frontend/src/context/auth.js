import React from "react";
import { Magic } from "magic-sdk";
import { getterSetters } from "./getterSetters";

export const state = {
  LOGGED_OUT: 0,
  LOGGING_IN: 1,
  LOGGED_IN: 2,
};

const defaults = {
  user: null,
  error: null,
  state: state.LOGGED_OUT,
};

export function New(data = defaults) {
  const m = new Magic("pk_test_B7C5606EDFA77AF7");

  return {
    ...getterSetters(data, New),
    async init() {
      const isLoggedIn = await m.user.isLoggedIn();

      try {
        if (!isLoggedIn) {
          await m.auth.loginWithCredential();
        }

        return New({
          ...data,
          user: await m.user.getMetadata(),
          state: state.LOGGED_IN,
          error: null,
        });
      } catch (error) {
        return New({
          ...data,
          error,
          state: state.LOGGED_OUT,
        });
      }
    },
    async login({ email }) {
      const redirectURI = window.location.origin;

      try {
        if (email) {
          await m.auth.loginWithMagicLink({ email, redirectURI });
        }
      } catch (error) {
        return New({
          ...data,
          error,
          state: state.LOGGED_OUT,
        });
      }

      return New({
        ...data,
        error: null,
        state: state.LOGGED_IN,
        user: await m.user.getMetadata(),
      });
    },
    async logout() {
      try {
        await m.user.logout();

        return New({
          error: null,
          user: null,
          state: state.LOGGED_OUT,
        });
      } catch (error) {
        return New({
          ...data,
          error,
        });
      }
    },
  };
}

export const Context = React.createContext({
  auth: null,
  setAuth: null,
});
