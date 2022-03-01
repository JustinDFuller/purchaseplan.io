export function DateRange({ budget }) {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h4>{budget.startDisplay()}</h4>
      <h4>—</h4>
      <h4>{budget.endDisplay()}</h4>
    </div>
  );
}
