export function Planned({ budget, category, user, onChange }) {
  return (
    <>
      $
      <input
        size={Math.max(category.planned().toString().length, 1)}
        style={{
          width: Math.max(category.planned().toString().length, 1) * 9,
        }}
        className="d-inline-block form-control-plaintext text-white text-right"
        type="number"
        value={category.planned() ? category.planned().toString() : ""}
        placeholder="0"
        min="0"
        onChange={(e) => {
          const u = user.setBudget(
            budget.setCategory(category.ID(), (cat) =>
              cat.setPlanned(e.target.value)
            )
          );
          onChange(u);
        }}
      />
    </>
  );
}
