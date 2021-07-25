import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";

import * as User from "user";
import { getterSetters } from "object/getterSetters";

import { state } from "./state";
import * as api from "../api";

const defaults = {
  user: null,
  error: null,
  state: state.UNKNOWN,
  serverError: false,
  unauthorized: false,
};

const key = ["dev.purchaseplan.io", "localhost"].includes(
  window.location.hostname
)
  ? "pk_test_7CA76FAB0A17039F"
  : "pk_live_06BF9798B97B7BB7";

export function New(data = defaults) {
  const m = new Magic(key, {
    extensions: [new OAuthExtension()],
  });

  return {
    ...getterSetters(data, New),
    async init() {
      try {
        const response = await User.api.get();
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
      } catch (error) {
        return New({
          ...data,
          error,
          state: state.LOGGED_OUT,
        });
      }
    },
    async initEmail() {
      try {
        const params = new URLSearchParams(window.location.search);
        const didToken = params.get("magic_credential");
        const response = await api.login(didToken);
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
      } catch (error) {
        return New({
          ...data,
          error,
          state: state.LOGGED_OUT,
        });
      }
    },
    async login({ email }) {
      const redirectURI = `${window.location.origin}/app/auth/email`;

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
    async loginWithGoogle() {
      await m.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: `${window.location.origin}/app/auth/google`,
      });
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
    isNotLoggedOut() {
      return !this.isLoggedOut();
    },
    setLoggingIn() {
      return New({
        ...data,
        state: state.LOGGING_IN,
      });
    },
    isNotAuthPath() {
      switch (window.location.pathname) {
        case "/app/auth/email":
        case "/app/auth/google":
          return false;
        default:
          return true;
      }
    },
  };
}
