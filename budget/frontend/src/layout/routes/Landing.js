import React from "react";

import * as Auth from "auth";
import * as styles from "styles";

export function Landing() {
  return (
    <div
      style={{
        color: styles.theme.textColor,
      }}
    >
      <div
        className="row m-auto px-0 px-md-3"
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          minHeight: 250,
          background: styles.colors.secondary,
        }}
      >
        <div className="col-12 col-md-6">
          <div className="m-auto" style={{ maxWidth: 424 }}>
            <h5>Budget App</h5>
          </div>
        </div>
        <div className="col-12 col-md-6 mt-4 px-0">
          <Auth.components.Login />
        </div>
      </div>
    </div>
  );
}

Landing.path = "/";
