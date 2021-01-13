import React, { useState } from "react";

import { Card } from "../layout/Card";
import { Submit } from "../forms/Submit";

export function URL({ onSubmit, loading, error }) {
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(url);
  }

  return (
    <Card>
      {error && (
        <div className="alert alert-danger" role="alert">
          Please make sure the URL is correct and try again.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-0">
          <label className="form-label">
            Enter the URL to the product you want to buy
          </label>
          <div className="row">
            <div className="col-12 col-md-10">
              <input
                type="url"
                className="form-control"
                value={url}
                disabled={loading}
                placeholder="https://smile.amazon.com/cool-new-fitbit"
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-2 text-right mt-3 mt-md-0">
              <Submit onClick={handleSubmit} loading={loading} text="Search" />
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
