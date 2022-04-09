import * as Product from "product";
import * as Tracking from "tracking";

export function Add() {
  Tracking.hooks.useOnce({ Type: "view", name: "user_add" });

  return (
    <div className="row m-auto">
      <div className="col-12 px-0" style={{ height: "94vh" }}>
        <Product.components.Card />
      </div>
    </div>
  );
}

Add.path = "/app/user/add";
