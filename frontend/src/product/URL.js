import React, { useState } from "react";

import { Card } from "../layout/Card";
import { Submit } from "../forms/Submit";

export function URL({ onSubmit, loading }) {
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(url);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Enter the URL to the product you want to buy
          </label>
          <div className="row">
            <div className="col col-10 col-md-11">
              <input
                type="url"
                className="form-control"
                value={url}
                disabled={loading}
                placeholder="https://smile.amazon.com/cool-new-fitbit"
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="col col-2 col-md-1">
              <Submit onClick={handleSubmit} loading={loading} />
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
