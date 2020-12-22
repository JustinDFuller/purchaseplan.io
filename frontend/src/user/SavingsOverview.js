import * as styles from "../styles";
import { Card } from "../layout/Card";
import { withContext } from './context/with';

export const SavingsOverview = withContext(function ({ user }) {
  return (
    <Card>
      <div className="row">
        <div className="col-12">
          <h5 className="card-title d-inline">Savings Overview</h5>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 col-xl-7">
          <strong style={styles.textDark}>Saved So Far</strong>
          <p>${user.saved()}</p>
        </div>
        <div className="col-12 col-xl-5">
          <strong style={styles.textDark}>Planned Savings</strong>
          <p>
            ${user.contributions()}/{user.frequency()}
          </p>
        </div>
      </div>
    </Card>
  );
})
