import { CategoryBubble } from "./CategoryBubble";
import { Summary } from "./Summary";

export function Row({ transaction, budget }) {
  return (
    <li className="list-group-item px-0 d-flex align-items-center">
      <div>
        <CategoryBubble budget={budget} transaction={transaction} />
      </div>
      <span className="pl-3">
        <Summary transaction={transaction} />
      </span>
    </li>
  );
}
