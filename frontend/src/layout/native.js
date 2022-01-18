export function isNativeApp() {
  if (window.isNativeApp) {
    return true;
  }

  if (!window.localStorage) {
    return false;
  }

  if (typeof window.localStorage.getItem !== "function") {
    return false;
  }

  return window.localStorage.getItem("isNativeApp");
}
