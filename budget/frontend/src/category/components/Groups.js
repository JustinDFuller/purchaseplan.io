import { Group } from "./Group";

export function Groups({ budget, user, view, onChange }) {
  return budget
    .Categories()
    .groups()
    .map((group) => (
      <Group
        // This is really weird but since groups
        // Don't have an ID, and their name can change
        // The ID must be a category.
        // Right now categories can't change their order,
        // so this is actually a stable key for a group (for now...)
        key={group.categories[0].ID()}
        group={group}
        user={user}
        budget={budget}
        view={view}
        onChange={onChange}
      />
    ));
}
