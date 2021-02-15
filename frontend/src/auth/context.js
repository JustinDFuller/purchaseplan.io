import React from "react";
import { Magic } from "magic-sdk";
import { getterSetters } from "../object/getterSetters";

import * as api from "./api";
import * as User from "../user";

export const state = {
  LOGGED_OUT: 0,
  LOGGING_IN: 1,
  LOGGED_IN: 2,
};

const defaults = {
  user: null,
  error: null,
  state: state.LOGGED_OUT,
  serverError: false,
  unauthorized: false,
};

export function New(data = defaults) {
  const m = new Magic("pk_test_B7C5606EDFA77AF7");

  return {
    ...getterSetters(data, New),
    async init() {
      try {
        let response;
        const params = new URLSearchParams(window.location.search);

        if (params.has("magic_credential")) {
          const didToken = params.get("magic_credential");
          response = await api.login(didToken);
          params.delete("magic_credential");
          window.history.replaceState(
            null,
            null,
            window.location.pathname + params.toString()
          );
          return New({
            ...data,
            ...response,
            user: response.data,
            state:
              response.data && !response.error
                ? state.LOGGED_IN
                : state.LOGGED_OUT,
          });
        } else {
          response = await User.api.get();
          // Don't return auth errors here. They just haven't logged in.
          return New({
            ...data,
            serverError: response.serverError,
            user: response.data,
            state:
              response.data && !response.error
                ? state.LOGGED_IN
                : state.LOGGED_OUT,
          });
        }
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
        const didToken = await m.auth.loginWithMagicLink({
          email,
          redirectURI,
        });
        const response = await api.login(didToken);
        return New({
          ...data,
          ...response,
          user: response.data,
          state:
            response.data && !response.error
              ? state.LOGGED_IN
              : state.LOGGED_OUT,
        });
      } catch (error) {
        return New({
          ...data,
          error,
          state: state.LOGGED_OUT,
        });
      }
    },
    async logout() {
      try {
        document.cookie =
          "Authorization=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        await m.user.logout();
        data.onLogout();

        return New({
          ...data,
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
    onLogout(onLogout) {
      return New({
        ...data,
        onLogout,
      });
    },
  };
}

export const Context = React.createContext({
  auth: null,
  setAuth: null,
});
