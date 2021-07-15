import * as Layout from "layout";
import * as routes from "./routes";

export function getDashboardPath() {
  if (Layout.isNativeApp()) {
    return routes.List.path;
  }
  return routes.Dashboard.path;
}
