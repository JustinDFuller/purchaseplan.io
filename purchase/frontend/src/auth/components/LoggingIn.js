import * as layout from "layout";
import * as styles from "styles";

export function LoggingIn({ style }) {
  return (
    <layout.components.Card
      style={styles.combine(
        { maxWidth: 500, margin: "0 auto", border: 0 },
        style
      )}
    >
      <div style={{ textAlign: "center" }}>
        <div className="spinner-border" role="status" />
        <h5 className="card-header" style={{ border: 0 }}>
          Logging you in
        </h5>
      </div>
    </layout.components.Card>
  );
}
