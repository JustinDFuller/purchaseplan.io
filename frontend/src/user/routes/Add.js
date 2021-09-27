import * as Product from "product";

export function Add() {
  return (
    <div className="row m-auto pt-4">
      <div className="col col-12">
        <Product.components.Card />
      </div>
    </div>
  );
}

Add.path = "/app/user/add";
