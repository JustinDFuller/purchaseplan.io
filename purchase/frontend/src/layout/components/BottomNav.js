import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as ListIcon } from "bootstrap-icons/icons/list-ul.svg";
import { ReactComponent as PlusIcon } from "bootstrap-icons/icons/plus-circle-fill.svg";
import { ReactComponent as GearIcon } from "bootstrap-icons/icons/gear.svg";

import * as User from "user";
import * as Tracking from "tracking";
import { theme, colors } from "styles";

const buttonStyle = {
  width: "33.33%",
  height: "100%",
  padding: "12px 0 11px",
  background: "transparent",
  fill: colors.muted,
  border: 0,
  borderTop: `4px solid ${theme.borderColor}`,
};

const activeButtonStyle = {
  ...buttonStyle,
  borderTop: `4px solid ${colors.primary}`,
  fill: "white",
};

export function BottomNav() {
  const history = useHistory();
  const location = useLocation();

  return (
    <div
      className="d-flex d-xl-none justify-content-between align-items-stretch"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.secondary,
        height: 50,
        width: "100vw",
      }}
    >
      <ListIcon
        onClick={() => {
          Tracking.api.action({
            Name: "Bottom Nav Dashboard Link",
          });
          history.push(User.getDashboardPath());
        }}
        style={
          location.pathname === User.routes.List.path ||
          location.pathname === User.routes.Dashboard.path
            ? activeButtonStyle
            : buttonStyle
        }
      >
        List
      </ListIcon>
      <PlusIcon
        onClick={() => {
          Tracking.api.action({
            Name: "Bottom Nav Add Link",
          });
          history.push(User.routes.Add.path);
        }}
        style={
          location.pathname === User.routes.Add.path
            ? activeButtonStyle
            : buttonStyle
        }
      >
        Add
      </PlusIcon>
      <GearIcon
        onClick={() => {
          Tracking.api.action({
            Name: "Bottom Nav Overview Link",
          });
          history.push(User.routes.Overview.path);
        }}
        style={
          location.pathname === User.routes.Overview.path
            ? activeButtonStyle
            : buttonStyle
        }
      >
        Overview
      </GearIcon>
    </div>
  );
}
