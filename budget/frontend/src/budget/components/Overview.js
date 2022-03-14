import * as Layout from "layout";

import { DateRange } from "./DateRange";
import { Views } from "./Views";
import { PlannedRemaining } from "./PlannedRemaining";
import { Remaining } from "./Remaining";

export function Overview({ budget, view, setView }) {
  return (
    <Layout.components.Card>
      <Views view={view} setView={setView} />
      <DateRange budget={budget} />
      {view === Layout.views.planned && <PlannedRemaining budget={budget} />}
      {view === Layout.views.remaining && <Remaining budget={budget} />}
    </Layout.components.Card>
  );
}
