export function isNativeApp() {
  return (
    window.isNativeApp === true || window.localStorage.getItem("isNativeApp")
  );
}
