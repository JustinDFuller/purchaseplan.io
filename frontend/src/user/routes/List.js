import * as Notifications from "notifications";
import * as Purchase from "purchase";

export function List() {
  return (
    <div className="row m-auto pt-4">
      <div className="col col-12">
        <Purchase.components.List />
      </div>
      <Notifications.components.Toasts />
    </div>
  );
}

List.path = "/app/user/list";
