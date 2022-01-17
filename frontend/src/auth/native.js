import * as routes from "./routes";

export function getLoginPath() {
  return routes.Login.path;
}

export function pathCanLogin(loc) {
  switch (loc.pathname) {
    case "/app/auth/magic":
      return false;
    default:
      return true;
  }
}

export function pathShowsLogin(loc) {
  switch (loc.pathname) {
    case "/app/auth/login":
    case "/app/auth/magic":
      return true;
    default:
      return false;
  }
}

export function pathShouldRedirectToLogin(loc) {
  switch (loc.pathname) {
    case "/":
      return false;
    default:
      return true;
  }
}
