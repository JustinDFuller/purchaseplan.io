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

  try {
    return window.localStorage.getItem("isNativeApp");
  } catch (e) {
    return false;
  }
}
