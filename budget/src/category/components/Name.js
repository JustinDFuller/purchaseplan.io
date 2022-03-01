export function Name({ category, user, budget, onChange }) {
  return (
    <input
      className="d-inline-block form-control-plaintext text-white w-auto"
      value={category.Name()}
      onChange={(e) => {
        const u = user.setBudget(
          budget.setCategory(category.ID(), (cat) =>
            cat.setName(e.target.value)
          )
        );
        onChange(u);
      }}
    />
  );
}
