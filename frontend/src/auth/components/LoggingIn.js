import * as layout from "layout";

export function LoggingIn() {
  return (
    <layout.components.Card style={{ maxWidth: 400, margin: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <div className="spinner-border" role="status" />
        <h5 className="card-header">Logging you in</h5>
      </div>
    </layout.components.Card>
  );
}
