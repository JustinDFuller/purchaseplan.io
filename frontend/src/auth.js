import { Magic  } from 'magic-sdk';
import { getterSetters } from './context/getterSetters';

export const state = {
  LOGGED_OUT: 0,
  LOGGING_IN: 1,
  LOGGED_IN: 2,
}

const defaults = {
  user: null,
  error: null,
  state: state.LOGGED_OUT,
}

export function New(a = getterSetters(defaults)) {
  const m = new Magic('pk_test_B7C5606EDFA77AF7');

  return {
    ...a,
    async init() {
      const isLoggedIn = await m.user.isLoggedIn();

      try {
        if (!isLoggedIn) {
          await m.auth.loginWithCredential();
        }

        return New(a.setUser(await m.user.getMetadata()).setState(state.LOGGED_IN).setError(null));
      } catch (e) {
        return New(a.setError(e)).setState(state.LOGGED_OUT);    
      }
    },
    async login({ email }) {
      const redirectURI = `${window.location.origin}/callback`;

      try {
        if (email) {
          await magic.auth.loginWithMagicLink({ email, redirectURI  });
        }
      } catch (e) {
        return New(a.setError(e).setState(state.LOGGED_OUT))    
      }

      return New(a.setError(null).setState(state.LOGGING_IN));
    }
  }
}
