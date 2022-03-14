export function DateRange({ budget }) {
  return (
    <div className="d-flex align-items-center mt-3 justify-content-center">
      <h4>{budget.startDisplay()}</h4>
      <h4 className="mx-1">—</h4>
      <h4>{budget.endDisplay()}</h4>
    </div>
  );
}
