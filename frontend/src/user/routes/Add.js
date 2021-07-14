import * as Product from "product";

export function Add() {
  return (
    <div className="row m-auto">
      <div className="col col-12">
        <Product.components.Form />
      </div>
    </div>
  );
}

Add.path = "/app/user/add";
