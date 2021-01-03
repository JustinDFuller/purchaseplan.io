import { Card } from "./Card";

export function HowItWorks() {
  return (
    <Card light>
      <h5 className="card-title">How It Works</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          Edit your savings overview with your saving plan.
        </li>
        <li className="list-group-item">
          Copy and Paste the URL of something you want to buy into the text box.
        </li>
        <li className="list-group-item">
          Drag and drop the products in the order you want to buy them.
        </li>
      </ul>
    </Card>
  );
}
