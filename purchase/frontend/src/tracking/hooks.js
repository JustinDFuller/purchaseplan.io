import { useEffect } from "react";

import * as api from "./api";

export function useOnce(options) {
  useEffect(() => {
    api.track(options);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
