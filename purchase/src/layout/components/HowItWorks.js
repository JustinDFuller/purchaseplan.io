import { Card } from "./Card";

export function HowItWorks() {
  return (
    <Card light>
      <h5 className="card-title">How It Works</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item pl-0">
          Edit your savings overview to adjust your plan.
        </li>
        <li className="list-group-item pl-0">
          Add a purchase that you're saving for.
        </li>
        <li className="list-group-item pl-0">
          Drag and drop purchases in the order you plan to buy.
        </li>
        <li className="list-group-item pl-0">
          Purchase plan will remind you when you can buy something!
        </li>
      </ul>
    </Card>
  );
}
