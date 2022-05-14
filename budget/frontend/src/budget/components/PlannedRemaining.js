import { ReactComponent as Trophy } from "bootstrap-icons/icons/trophy-fill.svg";

export function PlannedRemaining({ budget }) {
  if (budget.isEmpty()) {
    return null;
  }

  if (budget.remainingToPlan() === 0) {
    return (
      <h5 style={{ fontWeight: "normal" }} className="mt-2 text-center">
        <Trophy style={{ color: "gold" }} className="mb-1" /> It's a perfect
        budget!
      </h5>
    );
  }

  if (budget.remainingToPlan() > 0) {
    return (
      <h5 style={{ fontWeight: "normal" }} className="mt-2 text-center">
        <strong className="text-success">
          {budget.formattedRemainingToPlan()}
        </strong>{" "}
        left to budget.
      </h5>
    );
  }

  return (
    <h5 style={{ fontWeight: "normal" }} className="mt-2 text-center">
      <strong className="text-danger">
        {budget.formattedRemainingToPlan()}
      </strong>{" "}
      over budget.
    </h5>
  );
}
