import { Group } from "./Group";

export function Groups({ budget, user, view, onChange }) {
  return budget
    .Categories()
    .groups()
    .map((group) => (
      <Group
        key={group.name}
        group={group}
        user={user}
        budget={budget}
        view={view}
        onChange={onChange}
      />
    ));
}
