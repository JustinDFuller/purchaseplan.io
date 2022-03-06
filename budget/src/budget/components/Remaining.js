export function Remaining({ budget }) {
  if (budget.remainingToSpend() > 0) {
    return (
      <h5 style={{ fontWeight: "normal" }} className="mt-2 text-center">
        <strong className="text-success">
          {budget.formattedRemainingToSpend()}
        </strong>{" "}
        left to spend.
      </h5>
    );
  }

  return (
    <h5 style={{ fontWeight: "normal" }} className="mt-2 text-center">
      <strong className="text-danger">
        {budget.formattedRemainingToSpend()}
      </strong>{" "}
      overspent.
    </h5>
  );
}
