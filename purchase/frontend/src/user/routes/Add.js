import * as Product from "product";

export function Add() {
  return (
    <div className="row m-auto">
      <div className="col-12 px-0" style={{ height: "94vh" }}>
        <Product.components.Card />
      </div>
    </div>
  );
}

Add.path = "/app/user/add";
