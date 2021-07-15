import * as Layout from "layout";
import * as routes from "./routes";

export function getLoginPath() {
  if (Layout.isNativeApp()) {
    return routes.Login.path;
  }
  return Layout.routes.Landing.path;
}
