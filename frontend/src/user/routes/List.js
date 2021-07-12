import * as Notifications from "notifications";
import * as Purchase from "purchase";

export function List() {
  return (
    <>
      <Purchase.components.List />
      <Notifications.components.Toasts />
    </>
  );
}

List.path = "/app/user/list";
