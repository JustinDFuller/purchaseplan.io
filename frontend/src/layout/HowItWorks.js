import { Card } from "./Card";

export function HowItWorks() {
  return (
    <Card light>
      <h5 className="card-title">How It Works</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          Edit your savings overview to adjust your plan.
        </li>
        <li className="list-group-item">
          Add all the purchases that you're saving for.
        </li>
        <li className="list-group-item">
          Drag and drop the purchases to arrange them in the order you plan to
          buy them.
        </li>
        <li className="list-group-item">
          Your purchase plan will remind you when you can buy something new!
        </li>
      </ul>
    </Card>
  );
}
