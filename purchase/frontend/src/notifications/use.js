import { useEffect, useState } from "react";

import { New } from "./new";

export function Use() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    function initTokens() {
      if (window.PURCHASE_PLAN_TOKENS) {
        setTokens(New(window.PURCHASE_PLAN_TOKENS));
      }
    }

    initTokens();

    window.addEventListener("PURCHASE_PLAN_TOKENS", initTokens);
    return () => {
      window.removeEventListener("PURCHASE_PLAN_TOKENS", initTokens);
    };
  }, []);

  return tokens;
}
