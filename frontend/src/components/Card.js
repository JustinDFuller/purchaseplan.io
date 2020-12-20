import { styles } from "../styles";

export function Card({ children }) {
  return (
    <div className="card text-white" style={styles.darkAlt}>
      <div className="card-body">{children}</div>
    </div>
  );
}
