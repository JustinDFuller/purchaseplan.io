import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as ListIcon } from "bootstrap-icons/icons/list-ul.svg";
import { ReactComponent as PlusIcon } from "bootstrap-icons/icons/plus-circle-fill.svg";
import { ReactComponent as GearIcon } from "bootstrap-icons/icons/gear.svg";

import * as User from "user";
import { theme, colors } from "styles";

const buttonStyle = {
  width: "33.33%",
  height: "100%",
  padding: "12px 0 11px",
  background: "transparent",
  fill: theme.textColorFaded,
  border: 0,
  borderTop: `2px solid ${theme.borderColor}`,
};

const activeButtonStyle = {
  ...buttonStyle,
  borderTop: `2px solid ${colors.primary}`,
  fill: theme.textColor,
};

export function BottomNav() {
  const history = useHistory();
  const location = useLocation();

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-stretch"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: theme.background,
          height: 50,
        }}
      >
        <ListIcon
          onClick={() => history.push(User.routes.List.path)}
          style={
            location.pathname === User.routes.List.path
              ? activeButtonStyle
              : buttonStyle
          }
        >
          List
        </ListIcon>
        <PlusIcon
          onClick={() => history.push(User.routes.Add.path)}
          style={
            location.pathname === User.routes.Add.path
              ? activeButtonStyle
              : buttonStyle
          }
        >
          Add
        </PlusIcon>
        <GearIcon
          onClick={() => history.push(User.routes.Overview.path)}
          style={
            location.pathname === User.routes.Overview.path
              ? activeButtonStyle
              : buttonStyle
          }
        >
          Overview
        </GearIcon>
      </div>
      <div style={{ height: 50 }} />
    </>
  );
}
