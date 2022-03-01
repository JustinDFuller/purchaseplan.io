import * as Layout from "layout";

import { DateRange } from "./DateRange";
import { Views } from "./Views";

export function Overview({ budget, view, setView }) {
  return (
    <Layout.components.Card>
      <DateRange budget={budget} />
      <Views view={view} setView={setView} />
    </Layout.components.Card>
  );
}
