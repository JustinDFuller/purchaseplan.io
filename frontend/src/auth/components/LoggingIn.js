import * as layout from "layout";
import * as styles from "styles";

export function LoggingIn({ style }) {
  return (
    <layout.components.Card
      style={styles.combine({ maxWidth: 500, margin: "0 auto" }, style)}
    >
      <div style={{ textAlign: "center" }}>
        <div className="spinner-border" role="status" />
        <h5 className="card-header">Logging you in</h5>
      </div>
    </layout.components.Card>
  );
}
