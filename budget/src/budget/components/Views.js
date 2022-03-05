import * as Layout from "layout";
import * as styles from "styles";

export function Views({ view, setView }) {
  return (
    <div className="btn-group w-100" role="group">
      <button
        className={styles.classes("btn btn-primary", {
          active: view === Layout.views.planned,
        })}
        onClick={() => setView(Layout.views.planned)}
      >
        Planned
      </button>
      <button
        className={styles.classes("btn btn-primary", {
          active: view === Layout.views.remaining,
        })}
        onClick={() => setView(Layout.views.remaining)}
      >
        Remaining
      </button>
    </div>
  );
}
