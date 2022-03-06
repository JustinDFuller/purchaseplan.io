import { New } from "../new";

export function NewGroup({ budget, user, onChange }) {
  return (
    <div
      className="text-white cursor-pointer d-flex align-items-center justify-content-center p-5"
      style={{
        borderRadius: 4,
        background: "#14142a",
        borderColor: "#424265",
        borderWidth: 1,
        borderStyle: "dotted",
        fontSize: 18,
      }}
      onClick={() => {
        const groups = budget
          .Categories()
          .filter((c) => c.Group().includes("New Group"))
          .reduce((sum, val) => {
            if (!sum.includes(val.Group())) {
              return [...sum, val.Group()];
            }
            return sum;
          }, []);

        let i = groups.length + 1;
        let newGroup = `New Group ${i}`;
        while (groups.includes(newGroup)) {
          i++;
          newGroup = `New Group ${i}`;
        }

        const u = user.setBudget(
          budget.addCategory(New().setName("New Category").setGroup(newGroup))
        );
        onChange(u);
      }}
    >
      Add Group
    </div>
  );
}
