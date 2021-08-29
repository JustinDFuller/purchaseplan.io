import React, { useState, useEffect } from "react";

export function Offline() {
  const [offline, setOffline] = useState(window.navigator.onLine === false);

  const handleOffline = () => setOffline(true);
  const handleOnline = () => setOffline(false);

  useEffect(function () {
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return function () {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  });
  return offline ? (
    <div
      style={{
        backgroundColor: "#cf2e2e",
        padding: 10,
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <p style={{ color: "white", textAlign: "center", margin: 0 }}>
        Connect to the internet to use Purchase Plan.
      </p>
    </div>
  ) : null;
}
