import { useEffect } from "react";

import * as api from "./api";

export function useView(options) {
  useEffect(() => {
    api.view(options);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
