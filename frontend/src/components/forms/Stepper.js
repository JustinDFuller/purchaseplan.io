import React, { useState } from "react";

// Stepper only shows the current step.
// Each child is given an extra prop "next".
// Next is a function that moves the stepper to the next step.
export function Stepper({ children, start = 0 }) {
  const [step, setStep] = useState(start);

  function next(e) {
    if (e) {
      e.preventDefault();
    }

    setStep(step + 1);
  }

  return React.cloneElement(children[step], { next });
}
