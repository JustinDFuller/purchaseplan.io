import { useHistory, useLocation } from "react-router-dom";
import * as User from "user";

const buttonStyle = {
  width: "33.33%",
  background: "transparent",
  color: "white",
  border: 0,
  borderTop: "2px solid white",
};

const activeButtonStyle = {
  ...buttonStyle,
  borderTop: "2px solid #4e2ecf",
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
          background: "#0a0a24",
          height: 50,
        }}
      >
        <button
          onClick={() => history.push(User.routes.List.path)}
          style={
            location.pathname === User.routes.List.path
              ? activeButtonStyle
              : buttonStyle
          }
        >
          List
        </button>
        <button
          onClick={() => history.push(User.routes.Add.path)}
          style={
            location.pathname === User.routes.Add.path
              ? activeButtonStyle
              : buttonStyle
          }
        >
          Add
        </button>
        <button
          onClick={() => history.push(User.routes.Overview.path)}
          style={
            location.pathname === User.routes.Overview.path
              ? activeButtonStyle
              : buttonStyle
          }
        >
          Overview
        </button>
      </div>
      <div style={{ height: 50 }} />
    </>
  );
}
