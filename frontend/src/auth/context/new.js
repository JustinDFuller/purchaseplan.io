import { Magic } from "magic-sdk";

import { state } from "./state";
import * as api from "../api";
import * as User from "../../user";
import { getterSetters } from "../../object/getterSetters";

const defaults = {
  user: null,
  error: null,
  state: state.UNKNOWN,
  serverError: false,
  unauthorized: false,
};

export function New(data = defaults) {
  const m = new Magic(
    ["dev.purchaseplan.io", "localhost"].includes(window.location.hostname)
      ? "pk_test_7CA76FAB0A17039F"
      : "pk_live_06BF9798B97B7BB7"
  );

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
        await Promise.all([m.user.logout(), api.logout()]);
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
    isLoggingIn() {
      return data.state === state.LOGGING_IN;
    },
    isLoggedIn() {
      return data.state === state.LOGGED_IN;
    },
    isLoggedOut() {
      return data.state === state.LOGGED_OUT;
    },
    setLoggingIn() {
      return New({
        ...data,
        state: state.LOGGING_IN,
      });
    },
  };
}
